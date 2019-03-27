import { call, put, all, takeLatest, select } from 'redux-saga/effects';

import Errors from '../Config/Errors';

import PaymentCreateScreenActions, { PaymentCreateScreenTypes } from '../Redux/PaymentCreateScreenRedux';
import { AccountSelectors } from '../Redux/AccountRedux';
import { delay } from '../Services/Delay';
import Config from '../Config/AppConfig';
import { validateLightningId, validateOnchainAddress, Net } from '../Services/Check';
import Types from '../Config/Types';
import { decodePayment } from '../Sagas/LightningSagas';

function* handlePaymentRequestValue(api, value) {
  yield call(delay, 200);

  const { parsedResponse } = yield call(decodePayment, api, value);
  if (parsedResponse) {
    yield put(PaymentCreateScreenActions.handleToFieldValueChangeSuccess(parsedResponse));
  } else {
    const error = Errors.EXCEPTION_LIGHTNING_INCORRECT_PAYREQ;
    yield put(PaymentCreateScreenActions.handleToFieldValueChangeError(error));
  }
}

function* handleIdValue(value, paymentType) {
  const privacyMode = yield select(AccountSelectors.getPrivacyMode);

  let error;
  if (paymentType === Types.LIGHTNING) {
    if (privacyMode === Types.MODE_STANDARD) {
      error = Errors.EXCEPTION_LIGHTNING_ID_STANDARD;
    } else {
      error = validateLightningId(value);
    }
  } else {
    let net;
    if (Config.network.isSimnet) {
      net = Net.SIMNET;
    } else {
      const isTestnet = yield select(AccountSelectors.isTestnet);
      net = isTestnet ? Net.TESTNET : Net.MAIN;
    }
    error = validateOnchainAddress(value, net);
  }

  if (error) {
    yield put(PaymentCreateScreenActions.handleToFieldValueChangeError(error));
  } else {
    yield put(PaymentCreateScreenActions.handleToFieldValueChangeSuccess(undefined));
  }
}

export function* onToFieldValueChange(api, { value, paymentType, paymentSubType }) {
  if (
    paymentType === Types.LIGHTNING &&
    paymentSubType === Types.REGULAR &&
    value.length >= Config.paymentRequestLength
  ) {
    yield* handlePaymentRequestValue(api, value);
  } else {
    yield* handleIdValue(value, paymentType);
  }
}

export default function* saga(api) {
  yield all([
    takeLatest(PaymentCreateScreenTypes.HANDLE_TO_FIELD_VALUE_CHANGE, onToFieldValueChange, api),
  ]);
}
