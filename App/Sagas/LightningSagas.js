import { call, put, select, fork, take, cancel, all, takeLatest } from 'redux-saga/effects';
import { path, pathOr, reduce, last } from 'ramda';

import Errors, { handleLndError, handleLndResponseError } from '../Config/Errors';
import Types from '../Config/Types';

import { showError } from '../Services/InformBox';
import LightningActions, { LightningSelectors, LightningTypes } from '../Redux/LightningRedux';
import { AccountSelectors } from '../Redux/AccountRedux';
import { PaymentData } from '../Realm';
import AppConfig from '../Config/AppConfig';
import { parseNameFromDescription } from '../Services/Payment';
import { requestInvoice } from './LisSaga';

export function* getPubKey(api) {
  let pubKey = yield select(LightningSelectors.getPubkeyId);

  if (pubKey) {
    yield put(LightningActions.pubkeyIdSuccess(pubKey));
  } else {
    const { response, error } = yield call(api.getInfo);

    if (response && response.status === 200) {
      pubKey = path(['identity_pubkey'], JSON.parse(response.bodyString));

      yield put(LightningActions.pubkeyIdSuccess(pubKey));
    } else {
      const err = pathOr(Errors.EXCEPTION_LIGHTNING_GET_PUBKEY, ['message'], error);

      showError(err);
      yield put(LightningActions.pubkeyIdFailure(err));
    }
  }
}

function* calculateMaxPaymentSize(api) {
  const { response } = yield call(api.getChannels);
  if (!response || response.status !== 200) {
    return;
  }

  const channels = pathOr([], ['channels'], JSON.parse(response.bodyString));

  const currentMaxPaymentSize = yield select(LightningSelectors.getMaxPaymentSize);

  const maximumCapacity = reduce(
    (mc, channel) => (mc < channel.local_balance ? parseInt(channel.local_balance, 10) : mc),
    0,
    channels,
  );

  if (maximumCapacity !== currentMaxPaymentSize) {
    yield put(LightningActions.setMaxPaymentSize(maximumCapacity));
  }
}

export function* getChannelsBalance(api) {
  const { response, error } = yield call(api.getChannelsBalance);
  if (!response || response.status !== 200) {
    const err = handleLndResponseError(Errors.EXCEPTION_LIGHTNING_GET_BALANCE, response, error);
    showError(err);
    yield put(LightningActions.lightningBalanceFailure(err));
    return;
  }

  yield call(calculateMaxPaymentSize, api);

  const balance = path(['balance'], JSON.parse(response.bodyString));

  yield put(LightningActions.lightningBalanceSuccess(balance));
}

export function* loadMoreLightningHistory(api, { lastVisibleDate }) {
  let invoicesOffset = yield select(LightningSelectors.getInvoicesOffset);

  if (invoicesOffset <= 1) {
    // all data already loaded
    return;
  }

  let endLoop = false;

  do {
    // GET Invoces
    console.log(`loadMoreLightningHistory ${lastVisibleDate} ${invoicesOffset}`);
    const { response, error } = yield call(api.getInvoices, invoicesOffset);
    let invoices = [];
    if (response && response.status === 200) {
      ({ invoices, first_index_offset: invoicesOffset } = JSON.parse(response.bodyString));
      yield put(LightningActions.lightningHistoryInvoicesUpdate(invoices, invoicesOffset));
      yield put(LightningActions.lightningHistorySuccess());

      const lastInvoiceDate = last(invoices).creation_date;
      if (!lastVisibleDate || lastInvoiceDate < lastVisibleDate) {
        console.log(`loadMoreLightningHistory ${lastInvoiceDate} < ${lastVisibleDate} ${invoicesOffset}`);
        endLoop = true;
      }
    } else {
      const err = pathOr(Errors.EXCEPTION_LIGHTNING_INVOICES_HISTORY, ['message'], error);

      showError(err);
      yield put(LightningActions.lightningHistoryFailure(err));
      endLoop = true;
    }
  } while (!endLoop);
}

export function* decodePayment(api, payreq) {
  let parsedResponse;
  const { response, error } = yield call(api.decodePayment, payreq);
  if (response && response.status === 200) {
    parsedResponse = JSON.parse(response.bodyString);
    parsedResponse.description = parseNameFromDescription(parsedResponse.description);
  }

  return { response, parsedResponse, error };
}

export function* getLightningHistory(api) {
  console.log('getLightningHistory getPayments');
  // GET Payments
  let { response, error } = yield call(api.getPayments);
  console.log('getLightningHistory getPayments response', response, error);
  if (!response || response.status !== 200) {
    const err = pathOr(Errors.EXCEPTION_LIGHTNING_PAYMENTS_HISTORY, ['message'], error);

    showError(err);
    yield put(LightningActions.lightningHistoryFailure(err));
    return;
  }

  const { payments = [] } = JSON.parse(response.bodyString);
  yield put(LightningActions.lightningHistoryPaymentsUpdate(payments));

  // GET Invoces
  ({ response, error } = yield call(api.getInvoices));
  console.log('getLightningHistory getInvoices response', response, error);
  if (response && response.status === 200) {
    const { invoices, first_index_offset: invoicesOffset } = JSON.parse(response.bodyString);
    yield put(LightningActions.lightningHistoryInvoicesUpdate(invoices, invoicesOffset));
  } else {
    const err = pathOr(Errors.EXCEPTION_LIGHTNING_INVOICES_HISTORY, ['message'], error);
    showError(err);
    yield put(LightningActions.lightningHistoryFailure(err));
  }

  yield put(LightningActions.lightningHistorySuccess());
}

export function* sendLightningPayment(
  api,
  {
    name, address, amount, amountUsd, paymentType, paymentData,
  },
) {
  let response = null;
  let error = null;
  let paymentRequest = paymentData;

  const isSynced = yield select(AccountSelectors.isSynced);
  if (!isSynced) {
    yield put(LightningActions.lightningSendPaymentFailure(Errors.EXCEPTION_NOT_SYNCED));
    return;
  }

  if (!paymentData) {
    ({ response, error } = yield call(requestInvoice, api, amount, address, name));

    if (error) {
      yield put(LightningActions.lightningSendPaymentFailure(error));
      return;
    }

    ({ payment_request: paymentRequest } = response);
  }

  const { parsedResponse, error: decodePaymentError } = yield call(
    decodePayment,
    api,
    paymentRequest,
  );
  if (decodePaymentError) {
    yield put(LightningActions.lightningSendPaymentFailure(decodePaymentError));
    return;
  }

  const { payment_hash: paymentHash } = parsedResponse;

  ({ response, error } = yield call(api.sendLightningPaymentAmt, paymentRequest, amount));
  if (!response || response.status !== 200) {
    const friendlyError = handleLndResponseError(
      Errors.EXCEPTION_LIGHTNING_SEND_PAYMENT,
      response,
      error,
    );
    yield put(LightningActions.lightningSendPaymentFailure(friendlyError));
    return;
  }

  const { payment_error: paymentError } = JSON.parse(response.bodyString);
  if (paymentError) {
    const friendlyError = handleLndError(Errors.EXCEPTION_LIGHTNING_SEND_PAYMENT, paymentError);
    yield put(LightningActions.lightningSendPaymentFailure(friendlyError));
    return;
  }

  const payment = {
    id: paymentHash,
    name,
    address,
    amount,
    amountUsd,
    paymentType,
    date: Date.now(),
    status: Types.SUCCESS,
  };

  yield call([PaymentData, PaymentData.createOrUpdate], payment);

  yield put(LightningActions.lightningSendPaymentSuccess(payment));
  yield fork(getChannelsBalance, api);
}

export function* decodePaymentRequest(api, { payreq }) {
  const { parsedResponse, error } = yield call(decodePayment, api, payreq);
  if (parsedResponse) {
    yield put(LightningActions.lightningDecodePaymentSuccess(parsedResponse));
  } else {
    const err = pathOr(Errors.EXCEPTION_LIGHTNING_DECODE_PAYMENT_REQUEST, ['message'], error);

    showError(err);
    yield put(LightningActions.lightningDecodePaymentFailure(err));
  }
}

export function* getPaymentRequest(api, { amount }) {
  if (parseInt(amount, 10) < 0) {
    showError(Errors.EXCEPTION_AMOUNT_NEGATIVE);
    yield put(LightningActions.pubkeyIdFailure(Errors.EXCEPTION_AMOUNT_NEGATIVE));
    return;
  }

  const { response, error } = yield call(api.addInvoice, { value: amount });

  if (response && response.status === 200) {
    const paymentRequest = path(['payment_request'], JSON.parse(response.bodyString));

    yield put(LightningActions.lightningPaymentRequestSuccess(paymentRequest));
  } else {
    const err = handleLndResponseError(Errors.EXCEPTION_LIGHTNING_GET_PAYREQ, response, error);
    showError(err);
    yield put(LightningActions.pubkeyIdFailure(err));
  }
}

export function* getLightningFee(api, { lightningID, amount }) {
  const { response, error } = yield call(api.getRoutes, lightningID, amount);
  console.log('getLightningFee', response, error);
  if (response && response.status === 200) {
    const { routes = [] } = JSON.parse(response.bodyString);
    const result = reduce(
      (acc, route) => {
        const fee = route.total_fees || 0;
        return {
          min: fee < acc.min ? fee : acc.min,
          max: fee > acc.max ? fee : acc.max,
          sum: fee + acc.sum,
        };
      },
      {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        sum: 0,
      },
      routes,
    );

    if (routes.length > 0) {
      // I guess lightning will send payment by route witm minimal fee
      yield put(LightningActions.feeSuccess(result.min));
    } else {
      yield put(LightningActions.feeFailure(Errors.EXCEPTION_LIGHTNING_GET_FEE));
    }
  } else {
    yield put(LightningActions.feeFailure(Errors.EXCEPTION_LIGHTNING_GET_FEE));
  }
}

export function* getSendCoinsFee(api, { address, amount }) {
  const { response } = yield call(
    api.getFeeRate,
    address,
    amount,
    AppConfig.sendBitcoinsTargetConf,
  );

  if (!response || response.status !== 200) {
    yield put(LightningActions.feeFailure(Errors.EXCEPTION_LIGHTNING_GET_FEE));
    return;
  }

  const fee = pathOr(0, ['fee_sat'], JSON.parse(response.bodyString));
  yield put(LightningActions.feeSuccess(fee));
}

export function* calculateFee(api, { paymentType, idOrAddress, amount }) {
  if (paymentType === Types.LIGHTNING) {
    yield call(getLightningFee, api, { lightningID: idOrAddress, amount });
  } else {
    yield call(getSendCoinsFee, api, { address: idOrAddress, amount });
  }
}

export function* loadInvoicesSaga(api) {
  let lastTask;
  while (true) {
    const action = yield take([
      LightningTypes.LIGHTNING_HISTORY_REQUEST,
      LightningTypes.LIGHTNING_LOAD_MORE_HISTORY_REQUEST,
    ]);

    if (action.type === LightningTypes.LIGHTNING_HISTORY_REQUEST) {
      if (lastTask && lastTask.isRunning()) {
        yield cancel(lastTask);
      }
      lastTask = yield fork(getLightningHistory, api, action);
    } else if (!lastTask || !lastTask.isRunning()) {
      lastTask = yield fork(loadMoreLightningHistory, api, action);
    }
  }
}

export default function* saga(api) {
  yield all([
    takeLatest(LightningTypes.FEE_REQUEST, calculateFee, api),
    takeLatest(LightningTypes.PUBKEY_ID_REQUEST, getPubKey, api),
    takeLatest(LightningTypes.LIGHTNING_BALANCE_REQUEST, getChannelsBalance, api),
    takeLatest(LightningTypes.LIGHTNING_SEND_PAYMENT_REQUEST, sendLightningPayment, api),
    takeLatest(LightningTypes.LIGHTNING_DECODE_PAYMENT_REQUEST, decodePaymentRequest, api),
    takeLatest(LightningTypes.LIGHTNING_PAYMENT_REQUEST_REQUEST, getPaymentRequest, api),
    fork(loadInvoicesSaga, api),
  ]);
}
