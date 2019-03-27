import { call, put, select, all, takeLatest } from 'redux-saga/effects';
import { path, pathOr, map, has, last, filter, compose } from 'ramda';
import moment from 'moment';

import { takeLeading } from '../Services/SagaHelpers';
import Errors, { handleLndResponseError } from '../Config/Errors';
import Types from '../Config/Types';

import { showError, showInfo } from '../Services/InformBox';
import OnchainActions, { OnchainSelectors, OnchainTypes } from '../Redux/OnchainRedux';
import { AccountSelectors } from '../Redux/AccountRedux';
import { PaymentData } from '../Realm';
import AppConfig from '../Config/AppConfig';
import { transformOnchainDataForPaymentsHistory } from '../Transforms/array';

export function* getAddress(api) {
  let address = yield select(OnchainSelectors.getAddress);

  if (address) {
    yield put(OnchainActions.addressSuccess(address));
  } else {
    const { response, error } = yield call(api.newBitcoinAddress);

    if (response && response.status === 200) {
      address = path(['address'], JSON.parse(response.bodyString));

      yield put(OnchainActions.addressSuccess(address));
    } else {
      const err = pathOr(Errors.EXCEPTION_ONCHAIN_GET_ADDRESS, ['message'], error);

      showError(err);
      yield put(OnchainActions.addressFailure(err));
    }
  }
}

export function* getNewAddress(api) {
  const { response, error } = yield call(api.newBitcoinAddress);

  if (response && response.status === 200) {
    const address = path(['address'], JSON.parse(response.bodyString));

    showInfo('You have new BTC Address');
    yield put(OnchainActions.addressSuccess(address));
  } else {
    const err = pathOr(Errors.EXCEPTION_ONCHAIN_GET_ADDRESS, ['message'], error);

    showError(err);
    yield put(OnchainActions.addressFailure(err));
  }
}

export function* getBlockchainBalance(api) {
  const { response, error } = yield call(api.getBlockchainBalance);

  if (response && response.status === 200) {
    const body = JSON.parse(response.bodyString);
    const { confirmed_balance: balance, unconfirmed_balance: unconfirmedBalance } = body;
    yield put(OnchainActions.onchainBalanceSuccess(balance, unconfirmedBalance));
  } else {
    const err = pathOr(Errors.EXCEPTION_ONCHAIN_GET_BALANCE, ['message'], error);

    showError(err);
    yield put(OnchainActions.onchainBalanceFailure(err));
  }
}

export function* getBlockchainHistory(api) {
  // GET Transactions
  const { response, error } = yield call(api.getTransactions);

  if (response && response.status === 200) {
    let payload = pathOr([], ['transactions'], JSON.parse(response.bodyString));
    payload = compose(
      map(p => ({
        id: p.tx_hash,
        address: has('dest_addresses')(p) ? last(p.dest_addresses) : undefined,
        amount: p.amount,
        date: p.time_stamp,
        status:
          p.num_confirmations >= AppConfig.sendBitcoinsTargetConf ? Types.SUCCESS : Types.PENDING,
        paymentType: Types.ONCHAIN,
        paymentSubType: Types.REGULAR,
      })),
      filter(i => parseInt(i.amount, 10) !== 0),
    )(payload);

    /**
     *  Transform data:
     *  1) JOIN with Payments history
     *  2) Find contact name
     *  3) Group by Date
     */
    payload = yield call(transformOnchainDataForPaymentsHistory('date'), payload);

    yield put(OnchainActions.onchainHistorySuccess(payload));
  } else {
    const err = pathOr(Errors.EXCEPTION_ONCHAIN_GET_HISTORY, ['message'], error);

    showError(err);
    yield put(OnchainActions.onchainHistoryFailure(err));
  }
}

export function* onchainSendCoins(api, {
  name, address, amount, amountUsd, paymentType,
}) {
  const isSynced = yield select(AccountSelectors.isSynced);
  if (!isSynced) {
    yield put(OnchainActions.onchainSendCoinsFailure(Errors.EXCEPTION_NOT_SYNCED));
    return;
  }

  const { response, error } = yield call(api.sendCoins, address, amount);
  if (!response || response.status !== 200) {
    const err = handleLndResponseError(Errors.EXCEPTION_ONCHAIN_SEND_COINS, response, error);
    yield put(OnchainActions.onchainSendCoinsFailure(err));
    return;
  }

  const payload = path(['txid'], JSON.parse(response.bodyString));

  const payment = {
    id: payload,
    name,
    address,
    amount,
    amountUsd,
    paymentType,
    date: moment().unix(),
    // all transactions existing in db but not in lnd are considered as failed ones
    status: Types.ERROR,
  };

  yield call([PaymentData, PaymentData.createOrUpdate], payment);

  yield put(OnchainActions.onchainSendCoinsSuccess(payment));
  yield call(getBlockchainBalance, api);
}

export default function* saga(api) {
  yield all([
    takeLatest(OnchainTypes.ADDRESS_REQUEST, getAddress, api),
    takeLatest(OnchainTypes.ONCHAIN_BALANCE_REQUEST, getBlockchainBalance, api),
    takeLatest(OnchainTypes.NEW_ADDRESS_REQUEST, getNewAddress, api),
    takeLeading(OnchainTypes.ONCHAIN_HISTORY_REQUEST, getBlockchainHistory, api),
    takeLatest(OnchainTypes.ONCHAIN_SEND_COINS_REQUEST, onchainSendCoins, api),
  ]);
}
