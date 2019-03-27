import { has, append, inc, dec, keys } from 'ramda';
import { call, put, fork, select, all, takeLatest, takeEvery } from 'redux-saga/effects';

import StreamsActions, { StreamsTypes } from '../Redux/StreamsRedux';
import LightningActions from '../Redux/LightningRedux';

import Errors, { handleLndResponseError, handleLndError } from '../Config/Errors';
import Types from '../Config/Types';

import { createMemo } from '../Services/Streams';
import { delay, delayForSagasRequest } from '../Services/Delay';

import { requestInvoice } from './LisSaga';
import { StreamData } from '../Realm';
import { AccountSelectors, AccountTypes } from '../Redux/AccountRedux';

const Streams = {};

export function* fetchStreams() {
  const streams = yield call([StreamData, StreamData.getAll]);
  yield put(StreamsActions.fetchStreamsSuccess(streams));
}

function* handlePayStreamError(stream, error) {
  yield put(LightningActions.lightningHistoryRequest());
  if (stream.status !== Types.STREAM_END) {
    // eslint-disable-next-line no-param-reassign
    stream.status = Types.STREAM_ERROR;
    yield call([StreamData, StreamData.update], stream.id, {
      status: Types.STREAM_ERROR,
      error,
    });
  }
}

function* payStreamSecond(api, id, secToPay) {
  console.log(`payStreamSecond ${secToPay} ${id}`);
  yield call([StreamData, StreamData.update], id, {
    ongoingPaymentsNumber: inc,
  });

  const stream = Streams[id];

  let { response, error } = yield call(
    requestInvoice,
    api,
    stream.price,
    stream.destination,
    stream.memo,
  );

  if (error) {
    console.log(`payStreamSecond ${secToPay} requestInvoice error ${error} exit`);
    yield call(handlePayStreamError, stream, error);
    yield call([StreamData, StreamData.update], id, {
      ongoingPaymentsNumber: dec,
    });
    return;
  }

  console.log(`payStreamSecond ${secToPay} requestInvoice success`);

  const paymentHash = response.decodedPaymentRequest.payment_hash;

  // save payment hash asap
  yield call([StreamData, StreamData.update], stream.id, {
    payments: append(paymentHash),
  });

  ({ response, error } = yield call(api.sendLightningPayment, response.payment_request));
  if (!response || response.status !== 200) {
    console.log(`payStreamSecond ${secToPay} sendLightningPayment error ${error} exit`);
    const err = handleLndResponseError(Errors.EXCEPTION_LIGHTNING_SEND_PAYMENT, response, error);
    yield call(handlePayStreamError, stream, err);
    yield call([StreamData, StreamData.update], id, {
      ongoingPaymentsNumber: dec,
    });
    return;
  }

  const { payment_error: paymentError } = JSON.parse(response.bodyString);
  if (paymentError) {
    console.log(`payStreamSecond ${secToPay} sendLightningPayment paymentError ${paymentError} exit`);
    const err = handleLndError(Errors.EXCEPTION_LIGHTNING_SEND_PAYMENT, paymentError, error);
    yield call(handlePayStreamError, stream, err);
    yield call([StreamData, StreamData.update], id, {
      ongoingPaymentsNumber: dec,
    });
    return;
  }

  if (secToPay >= stream.totalTime) {
    stream.status = Types.STREAM_END;
    yield put(LightningActions.lightningHistoryRequest());
    yield put(LightningActions.lightningBalanceRequest());
  }

  yield call([StreamData, StreamData.update], stream.id, {
    status: stream.status,
    secPaid: inc,
    ongoingPaymentsNumber: dec,
  });

  console.log(`payStreamSecond ${secToPay} exit`);
}

function* payStream(api, id) {
  console.log(`payStream ${id}`);

  const stream = Streams[id];

  const isSynced = yield select(AccountSelectors.isSynced);
  if (!isSynced) {
    yield call(handlePayStreamError, stream, Errors.EXCEPTION_NOT_SYNCED);
    return;
  }

  while (true) {
    console.log(`payStream stream.status ${stream.status}`);

    if (stream.secToPay >= stream.totalTime) {
      stream.status = Types.STREAM_END;
      console.log(`payStream ${stream.status} ${stream.secToPay} exit`);
      yield put(LightningActions.lightningHistoryRequest());
      yield put(LightningActions.lightningBalanceRequest());
      yield call([StreamData, StreamData.update], stream.id, {
        status: Types.STREAM_END,
      });
      return;
    }

    if (stream.status !== Types.STREAM_RUN) {
      console.log(`payStream ${stream.status} ${stream.secToPay} exit`);
      return;
    }

    stream.secToPay += 1;
    console.log(`fork payStreamSecond ${id} ${stream.secToPay}`);
    yield call([StreamData, StreamData.update], stream.id, {
      secToPay: stream.secToPay,
    });
    yield fork(payStreamSecond, api, id, stream.secToPay);
    yield call(delay, 1000);
  }
}

// eslint-disable-next-line object-curly-newline
export function* addStream({ name, price, totalTime, destination }) {
  const dateNow = Date.now();
  const id = String(dateNow);
  const time = parseInt(totalTime, 10);

  if (!price) {
    yield put(StreamsActions.streamsAddFailure(Errors.EXCEPTION_NAMED_FIELD_REQUIRED('Price')));
    return;
  }

  if (!time || time <= 0) {
    yield put(StreamsActions.streamsAddFailure(Errors.EXCEPTION_NAMED_FIELD_REQUIRED('Time')));
    return;
  }

  yield call([StreamData, StreamData.createOrUpdate], {
    id,
    name,
    created: dateNow,
    secPaid: 0,
    secToPay: 0,
    totalTime: time,
    price: Math.abs(price),
    status: Types.STREAM_NEW,
    destination,
    memo: createMemo(name),
    payments: [],
  });

  // async state hack
  yield delayForSagasRequest();

  yield put(StreamsActions.streamsAddSuccess(id));
}

export function* updateStatus(api, { id, status }) {
  console.log(`updateStatus ${id} ${status}`);
  const stream = { ...(yield call([StreamData, StreamData.getOne], id)) };
  let previousStatus;
  stream.status = status;
  if (!has(id)(Streams)) {
    Streams[id] = stream;
  } else {
    previousStatus = Streams[id].status;
    Streams[id].status = status;
  }

  if (previousStatus !== Types.STREAM_RUN && status === Types.STREAM_RUN) {
    Streams[id].payStreamTask = yield fork(payStream, api, id);
  }

  if (status !== Types.STREAM_RUN && Streams[id].payStreamTask) {
    Streams[id].payStreamTask = undefined;
    yield put(LightningActions.lightningHistoryRequest());
    yield put(LightningActions.lightningBalanceRequest());
  }

  yield call([StreamData, StreamData.update], stream.id, { status });
}

export function* streamsInit() {
  yield call([StreamData, StreamData.updateAll], undefined, {
    ongoingPaymentsNumber: 0,
  });
  yield call([StreamData, StreamData.updateAll], `status == "${Types.STREAM_RUN}"`, {
    status: Types.STREAM_PAUSE,
  });
}

export function* onChangePrivacyMode(api, { privacyMode }) {
  if (privacyMode === Types.MODE_STANDARD) {
    const ids = keys(Streams);
    for (let i = 0; i < ids.length; i += 1) {
      console.log('streams: onChangePrivacyMode pause', ids[i]);
      yield call(updateStatus, api, { id: ids[i], status: Types.STREAM_PAUSE });
    }
  }
}

export default function* saga(api) {
  yield all([
    takeLatest(StreamsTypes.STREAMS_ADD_REQUEST, addStream),
    takeEvery(StreamsTypes.UPDATE_STATUS_REQUEST, updateStatus, api),
    takeEvery(AccountTypes.CHANGE_PRIVACY_MODE, onChangePrivacyMode, api),
  ]);
}
