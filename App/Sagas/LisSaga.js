import { eventChannel, END } from 'redux-saga';
import { all, call, put, take, race, takeEvery, cancelled, select, fork } from 'redux-saga/effects';
import { path, pathOr, isNil, equals } from 'ramda';
import { Buffer } from 'buffer';
import { ec as Elliptic } from 'elliptic';
import Aesjs from 'aes-js';
import { generateSecureRandom } from 'react-native-securerandom';

import Types from '../Config/Types';
import LisActions, { LisTypes } from '../Redux/LisRedux';
import { AccountSelectors, AccountTypes } from '../Redux/AccountRedux';

import { takeLeading } from '../Services/SagaHelpers';
import AppConfig from '../Config/AppConfig';
import { delay } from '../Services/Delay';
import Errors, { handleLndResponseError } from '../Config/Errors';
import { decodePayment } from '../Sagas/LightningSagas';

// generation of local private key for the wallet session
// to encrypt communication with other wallets
const ec = new Elliptic('secp256k1');

generateSecureRandom(32).then((entropy) => {
  this.secret = ec.genKeyPair({
    entropy,
  });
});

// local storage for shared keys
const keyStorage = {};

const encrypt = (key, data) => {
  try {
    const aesCtr = new Aesjs.ModeOfOperation.ctr(key.toArray()); // eslint-disable-line new-cap
    console.log('LIS encrypt data:', data);
    const msgBytes = Aesjs.utils.utf8.toBytes(JSON.stringify(data));
    const encryptedSendedBytes = aesCtr.encrypt(msgBytes);
    const encryptedHex = Aesjs.utils.hex.fromBytes(encryptedSendedBytes);
    console.log('LIS encrypt encrypted data:', encryptedHex);
    return { data: encryptedHex };
  } catch (error) {
    return { error };
  }
};

const decrypt = (key, data) => {
  try {
    const encryptedReceivedBytes = Aesjs.utils.hex.toBytes(data);
    console.log('LIS decrypt encrypted data:', encryptedReceivedBytes);
    const aesCtr = new Aesjs.ModeOfOperation.ctr(key.toArray()); // eslint-disable-line new-cap
    const decryptedBytes = aesCtr.decrypt(encryptedReceivedBytes);
    const decryptedRequest = Aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log('LIS encrypt decrypted data:', decryptedRequest);
    return { data: JSON.parse(decryptedRequest) };
  } catch (error) {
    return { error };
  }
};

function* send(msg) {
  yield put(LisActions.send(msg));
}

function* sendSigned(api, msg) {
  const { response, error } = yield call(api.signMessage, {
    msg: Buffer.from(msg.toString()).toString('base64'),
  });

  if (!response || response.status !== 200) {
    console.log('LIS signMessage:', response, error);
    return { error };
  }

  yield put(LisActions.send({ data: msg, sign: JSON.parse(response.bodyString).signature }));

  return {};
}

function* receiveSigned(api, action, id) {
  const rawMsg = yield take(m =>
    m.type === LisTypes.RECEIVE &&
      m.data &&
      m.data.message &&
      m.data.message.data &&
      m.data.message.data.action === action &&
      (!id || m.data.message.data.id === id));

  const { response, error } = yield call(api.verifyMessage, {
    signature: rawMsg.data.message.sign,
    msg: Buffer.from(rawMsg.data.message.data.toString()).toString('base64'),
  });

  if (!response || response.status !== 200) {
    console.log('LIS verifyMessage:', response, error);
    return { error: true };
  }

  const { pubkey } = JSON.parse(response.bodyString);
  if (!equals(pubkey, rawMsg.data.sender)) {
    return { error: true };
  }

  return { msg: rawMsg.data.message.data, sender: rawMsg.data.sender };
}

function* receive(action, id) {
  const rawMsg = yield take(m =>
    m.type === LisTypes.RECEIVE &&
      m.data &&
      m.data.message &&
      m.data.message.action === action &&
      (!id || m.data.message.id === id));
  return { msg: rawMsg.data.message, sender: rawMsg.data.sender };
}

function* receiveWithTimeout(action, id) {
  const { response: { msg, sender, error } = {}, timeout } = yield race({
    response: receive(action, id),
    timeout: call(delay, 10000),
  });

  return { msg, sender, error: error || timeout ? 'timeout' : null };
}

function* receiveSignedWithTimeout(api, action, id) {
  const { response: { msg, sender, error } = {}, timeout } = yield race({
    response: receiveSigned(api, action, id),
    timeout: call(delay, 10000),
  });

  return { msg, sender, error: error || timeout ? 'timeout' : null };
}

function watchMessages(socket) {
  return eventChannel((emit) => {
    /* eslint-disable no-param-reassign */
    socket.onopen = () => {
      console.log('LIS', 'Connection opened');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('LIS', 'Receive msg:', event.data);
      emit(data);
    };

    socket.onclose = () => {
      console.log('LIS', 'onclose');
      emit(END);
    };

    socket.onerror = ({ message }) => {
      console.log('LIS', 'onerror', message);
    };

    return () => {};
  });
}

function* backgroundTask(socketChannel) {
  try {
    while (true) {
      const payload = yield take(socketChannel);
      yield put(LisActions.receive(payload));
    }
  } catch (e) {
    console.log('LIS', 'backgroundTask catch', e);
  } finally {
    console.log('LIS', 'backgroundTask finally');
  }
}

function* sendTask(socket) {
  while (true) {
    const action = yield take(LisTypes.SEND);
    console.log('LIS', 'Will send:', action.data);
    try {
      socket.send(JSON.stringify(action.data));
    } catch (sendError) {
      console.log('LIS', 'Will send error', sendError);
      throw new Error(sendError);
    }
  }
}

export function* onAuthorize(api) {
  let { response, error } = yield call(api.getInfo);
  if (!response || response.status !== 200) {
    console.log('LIS  SOCKET_UNAUTHORIZED_CONNECTION LND.getInfo', error);
    const friendlyError = handleLndResponseError(Errors.COMMON_LIS_ERROR, response, error);
    yield put(LisActions.authError(friendlyError));
    return;
  }

  const pubKey = path(['identity_pubkey'], JSON.parse(response.bodyString));
  const authorizeParams = {
    action: Types.SOCKET_CONNECT_REQUEST,
    lightning_id: pubKey,
    type: Types.SOCKET_TYPE,
  };
  console.log('LIS', 'Server socket successfully opened. Will send:', authorizeParams);

  yield send(authorizeParams);

  let msg;
  ({ msg, error } = yield receiveWithTimeout(Types.SOCKET_SIGN_MESSAGE_REQUEST));
  if (!msg || error) {
    yield put(LisActions.authError(Errors.COMMON_LIS_ERROR));
    return;
  }

  console.log('LIS', 'SOCKET_SIGN_MESSAGE_REQUEST', msg);

  ({ response, error } = yield call(api.signMessage, {
    msg: Buffer.from(msg.msg, 'hex').toString('base64'),
  }));
  if (!response || response.status !== 200) {
    console.log('LIS SOCKET_SIGN_MESSAGE_REQUEST LND.signMessage:', response, error);
    const friendlyError = handleLndResponseError(Errors.COMMON_LIS_ERROR, response, error);
    yield put(LisActions.authError(friendlyError));
    return;
  }

  yield send({
    action: Types.SOCKET_SIGN_MESSAGE_RESPONSE,
    message: pathOr('', ['signature'], JSON.parse(response.bodyString)),
    type: Types.SOCKET_TYPE,
  });

  ({ msg, error } = yield receiveWithTimeout(Types.SOCKET_SIGN_MESSAGE_SUCCESS));
  if (!msg || error) {
    yield put(LisActions.authError(Errors.COMMON_LIS_ERROR));
    return;
  }

  console.log('LIS', 'Successfully authorized');
}

function* onAddInvoiceRemoteRequest(api, msg, sender) {
  const amount = parseInt(msg.amount, 10);
  const invoiceData = {
    value: amount,
  };
  if ('memo' in msg) {
    invoiceData.memo = msg.memo;
  }
  const { response, error } = yield call(api.addInvoice, invoiceData);
  if (!response || response.status !== 200) {
    console.log('LIS  SOCKET_ADD_INVOICE_REMOTE_REQUEST LND.addInvoice', error);
    return;
  }

  yield send({
    /* eslint-disable no-underscore-dangle */
    id: msg.id || '',
    action: Types.SOCKET_ADD_INVOICE_REMOTE_RESPONSE,
    invoice: JSON.parse(response.bodyString),
    lightning_id: sender,
    type: Types.SOCKET_TYPE,
    value: amount,
  });
}

function* onAddInvoiceEncryptedRemoteRequest(api, msg, sender) {
  const { sharedKey } = keyStorage[msg.id];
  const { data, error } = yield call(decrypt, sharedKey, msg.msg);
  if (!data || error) {
    console.log('LIS  onAddInvoiceEncryptedRemoteRequest decrypt error', error);
    return;
  }

  const amount = parseInt(data.amount, 10);
  const invoiceData = {
    value: amount,
  };

  if ('memo' in data) {
    invoiceData.memo = data.memo;
  }

  const { response } = yield call(api.addInvoice, invoiceData);
  if (!response || response.status !== 200) {
    console.log('LIS  SOCKET_ADD_INVOICE_REMOTE_REQUEST LND.addInvoice', error);
    return;
  }
  const invoice = JSON.parse(response.bodyString);

  const { data: encryptedData, error: encryptError } = yield call(encrypt, sharedKey, invoice);
  if (encryptError) {
    console.log('LIS  onAddInvoiceEncryptedRemoteRequest encrypt error', encryptError);
    return;
  }

  yield sendSigned(api, {
    id: msg.id,
    action: Types.SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_RESPONSE,
    msg: encryptedData,
    lightning_id: sender,
    type: Types.SOCKET_TYPE,
  });
}

function* onPubkeyRequest(api, msg, sender) {
  const pubkey = ec.keyFromPublic(msg.pubkey, 'hex');
  const sharedKey = this.secret.derive(pubkey.getPublic());

  keyStorage[msg.id] = {
    sharedKey,
  };

  yield sendSigned(api, {
    action: Types.SOCKET_PUBKEY_RESPONSE,
    lightning_id: sender,
    id: msg.id,
    pubkey: this.secret.getPublic().encode('hex'),
  });
}

function* exchangeKeys(api, lightningId, id) {
  const { error } = yield sendSigned(api, {
    action: Types.SOCKET_PUBKEY_REQUEST,
    lightning_id: lightningId,
    pubkey: this.secret.getPublic().encode('hex'),
    id,
  });
  if (error) {
    return { error };
  }

  const { msg, error: responseError } = yield receiveSignedWithTimeout(
    api,
    Types.SOCKET_PUBKEY_RESPONSE,
    id,
  );
  if (responseError) {
    console.log('LIS Receive SOCKET_PUBKEY_RESPONSE error', responseError);
    return { error: responseError };
  }

  const pubkey = ec.keyFromPublic(msg.pubkey, 'hex');
  return { sharedKey: this.secret.derive(pubkey.getPublic()) };
}

export function* requestInvoice(api, amount, lightningId, memo) {
  console.log('LIS', 'REQUEST INVOICE');

  const id = `${Date.now() * Math.random()}`;

  const { sharedKey, error } = yield call(exchangeKeys, api, lightningId, id);
  if (error) {
    return { error: Types.LIS_DEFAULT_ERROR };
  }

  const value = parseInt(amount, 10);

  const data = {
    amount: value,
  };

  if (memo) {
    data.memo = memo;
  }

  const { data: encryptedData, error: encryptError } = yield call(encrypt, sharedKey, data);
  if (encryptError) {
    return { error: Types.LIS_DEFAULT_ERROR };
  }

  const { error: sendError } = yield sendSigned(api, {
    id,
    action: Types.SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_REQUEST,
    lightning_id: lightningId,
    type: Types.SOCKET_TYPE,
    msg: encryptedData,
  });
  if (sendError) {
    return { error: Types.LIS_DEFAULT_ERROR };
  }

  const { msg, error: receiveError } = yield receiveSignedWithTimeout(
    api,
    Types.SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_RESPONSE,
    id,
  );
  if (!msg || receiveError) {
    console.log('LIS', 'Invoice error:', receiveError, msg);
    return { error: Types.LIS_DEFAULT_ERROR };
  }

  console.log('LIS', 'Invoice received:', id, msg, receiveError);

  const { data: invoice, error: decryptError } = yield call(decrypt, sharedKey, msg.msg);
  if (!invoice || decryptError) {
    console.log('LIS  requestInvoice decrypt error', decryptError);
    return { error: Types.LIS_DEFAULT_ERROR };
  }

  const { response, parsedResponse, error: decodePaymentError } = yield call(
    decodePayment,
    api,
    invoice.payment_request,
  );
  console.log('LIS', 'payReq', response, decodePaymentError);
  if (!response || response.status !== 200) {
    const friendlyError = handleLndResponseError(
      Errors.EXCEPTION_LIGHTNING_DECODE_PAYMENT_REQUEST,
      response,
      decodePaymentError,
    );
    return { error: friendlyError };
  }

  console.log('LIS', 'Invoice decoded:', parsedResponse);
  const eqLightning = parsedResponse.destination === lightningId;
  const eqAmount = parseInt(parsedResponse.num_satoshis, 10) === value;
  if (!eqLightning || !eqAmount) {
    console.log('LIS', 'malformed invoice', eqLightning, eqAmount);
    return { error: Types.ERROR_MALFORMED_INVOICE };
  }

  return {
    response: {
      ...invoice,
      decodedPaymentRequest: parsedResponse,
    },
  };
}

export function* establishConnectionSaga() {
  const privacyMode = yield select(AccountSelectors.getPrivacyMode);
  if (privacyMode === Types.MODE_STANDARD) {
    console.log("Can't start LIS service in the standard mode");
    return;
  }

  const lisServer = yield select(AccountSelectors.getLisServer);
  const LIS_PROTOCOL = `ws${AppConfig.lisTLS ? 's' : ''}://`;
  const LIS_HOST = `${LIS_PROTOCOL}${lisServer}`;

  console.log('LIS', 'establishConnection', LIS_HOST);

  let socket;
  let socketChannel;
  let cancel;

  while (true) {
    try {
      socket = new WebSocket(LIS_HOST); // eslint-disable-line no-undef
      socketChannel = yield call(watchMessages, socket);
      ({ cancel } = yield race({
        receive: call(backgroundTask, socketChannel),
        send: call(sendTask, socket),
        authError: take(LisTypes.AUTH_ERROR),
        cancel: take(LisTypes.CLOSE_CONNECTION),
      }));
    } catch (e) {
      console.log('LIS', 'establishConnectionSaga catch', e);
    } finally {
      console.log('LIS', 'establishConnectionSaga finally', cancel);
      if (socketChannel) {
        socketChannel.close();
      }
      if (socket) {
        socket.close();
      }
    }

    const taskCanceled = yield cancelled();
    if (taskCanceled || !isNil(cancel)) {
      console.log('LIS', 'establishConnectionSaga canceled');
      return;
    }

    console.log('LIS', 'establishConnectionSaga reconnect');

    yield call(delay, AppConfig.lisReconnectTimeout);
  }
}

function* onChangePrivacyMode({ privacyMode }) {
  if (privacyMode === Types.MODE_EXTENDED) {
    yield put(LisActions.openConnection());
  } else {
    yield put(LisActions.closeConnection());
  }
}

export const onMessage = (api, signed, action, handler) =>
  fork(function* g() {
    while (true) {
      let msg;
      let error;
      let sender;
      if (signed) {
        ({ msg, sender, error } = yield receiveSigned(api, action));
      } else {
        ({ msg, sender, error } = yield receive(action));
      }

      if (msg && !error) {
        yield fork(handler, api, msg, sender);
      } else {
        console.log('LIS : onMessage error', error);
      }
    }
  });

export default function* saga(api) {
  yield all([
    takeLeading(LisTypes.OPEN_CONNECTION, establishConnectionSaga),
    onMessage(api, false, Types.SOCKET_UNAUTHORIZED_CONNECTION, onAuthorize),
    onMessage(api, false, Types.SOCKET_ADD_INVOICE_REMOTE_REQUEST, onAddInvoiceRemoteRequest),
    onMessage(
      api,
      true,
      Types.SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_REQUEST,
      onAddInvoiceEncryptedRemoteRequest,
    ),
    onMessage(api, true, Types.SOCKET_PUBKEY_REQUEST, onPubkeyRequest),
    takeEvery(AccountTypes.CHANGE_PRIVACY_MODE, onChangePrivacyMode),
  ]);
}
