import { eventChannel, END } from 'redux-saga';
import { put, call, take, race, all, takeLatest } from 'redux-saga/effects';
import { createActions } from 'reduxsauce';
import { Platform } from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import { NavigationActions, StackActions } from 'react-navigation';
import { find, isNil } from 'ramda';
import { showConfirmAsync } from '../Services/Alert';
import NfcActions, { NfcTypes } from '../Redux/NfcRedux';
import { decodePaymentData } from '../Services/Payment';
import Types from '../Config/Types';
import { showError } from '../Services/InformBox';
import Errors from '../Config/Errors';

const { Types: MsgTypes, Creators: MsgActions } = createActions({
  enabled: ['enabled'],
  tagDiscovered: ['tag'],
});

function createNfcChannel() {
  return eventChannel((emit) => {
    let stateChangedSubscription;
    let started = false;
    console.log('NFC createNfcChannel');
    const asyncExec = async () => {
      await NfcManager.start({
        onSessionClosedIOS: () => {
          console.log('NFC onSessionClosedIOS');
          emit(END);
        },
      });

      started = true;

      if (Platform.OS === 'android') {
        const isEnabled = await NfcManager.isEnabled();
        emit(MsgActions.enabled(isEnabled));

        stateChangedSubscription = await NfcManager.onStateChanged((event) => {
          if (event.state === 'on') {
            emit(MsgActions.enabled(true));
          } else if (event.state === 'off') {
            emit(MsgActions.enabled(false));
          }
        });
      }

      console.log('NFC registerTagEvent');
      await NfcManager.registerTagEvent(
        (tag) => {
          console.log('NFC registerTagEventCallback', tag);
          emit(MsgActions.tagDiscovered(tag));
        },
        null,
        true,
      );
    };

    asyncExec().catch(err => emit(err));

    return () => {
      console.log('NFC cancelCallback');
      if (stateChangedSubscription) {
        stateChangedSubscription.remove();
      }

      NfcManager.unregisterTagEvent();
      if (started) {
        NfcManager.stop();
      }
    };
  });
}

function handleError(error) {
  showError(error);
}

function handleDiscoveredTag(tag) {
  console.log('NFC handleDiscoveredTag1');
  if (!tag) {
    handleError('Incorrect tag');
    return null;
  }

  console.log('NFC handleDiscoveredTag2');
  if (!tag.ndefMessage || tag.ndefMessage.length <= 0) {
    handleError('Incorrect tag');
    return null;
  }

  console.log('NFC handleDiscoveredTag3');
  const uriNdefRecord = find(
    ndefRecord => Ndef.isType(ndefRecord, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI),
    tag.ndefMessage,
  );

  console.log('NFC handleDiscoveredTag4', uriNdefRecord);
  if (!uriNdefRecord) {
    handleError('Incorrect tag');
    return null;
  }

  const encodedData = Ndef.uri.decodePayload(uriNdefRecord.payload);
  console.log('NFC handleDiscoveredTag5', encodedData);
  const {
    type, data, amount, name, error,
  } = decodePaymentData(
    encodedData,
    Errors.EXCEPTION_NFC_DECODE_ERROR,
  );

  console.log('NFC handleDiscoveredTag6', type, data, amount, name, error);

  if (error) {
    handleError(error);
    return null;
  }

  return {
    type,
    data,
    amount,
    name,
  };
}

function* onChannelMessage(nfcChannel) {
  while (true) {
    const message = yield take(nfcChannel);
    console.log('NFC onChannelMessage', message);
    switch (message.type) {
      case MsgTypes.ENABLED:
        {
          const { enabled } = message;
          if (!enabled) {
            const { cancel } = yield call(
              showConfirmAsync,
              'NFC disabled. Do you want to enable it?',
            );

            if (!cancel) {
              yield call([NfcManager, NfcManager.goToNfcSetting]);
            }
          }
        }
        break;
      case MsgTypes.TAG_DISCOVERED: {
        const { tag } = message;
        const result = handleDiscoveredTag(tag);
        if (!isNil(result)) {
          return result;
        }
        break;
      }
      default:
        break;
    }
  }
}

export function* nfcRequestSaga({ openPaymentScreenOnSuccess }) {
  let nfcChannel;
  const isAndroid = Platform.OS === 'android';
  console.log('NFC nfcRequestSaga1');
  try {
    if (isAndroid) {
      yield put(NavigationActions.navigate({
        routeName: 'NfcPayment',
      }));
    }

    console.log('NFC nfcRequestSaga2');
    nfcChannel = yield call(createNfcChannel);
    const { decodedTagData } = yield race({
      decodedTagData: call(onChannelMessage, nfcChannel),
      cancel: take(NfcTypes.NFC_CANCEL_REQUEST),
    });
    console.log('NFC nfcRequestSaga3', decodedTagData);
    if (decodedTagData) {
      yield put(NfcActions.nfcSuccess(decodedTagData));

      if (openPaymentScreenOnSuccess) {
        const {
          type, data, amount, name,
        } = decodedTagData;

        const params = {
          type,
          subType: Types.REGULAR,
          address: data,
          amount,
          name,
        };

        if (isAndroid) {
          yield put(StackActions.replace({
            routeName: 'PaymentCreate',
            params,
          }));
        } else {
          yield put(NavigationActions.navigate({
            routeName: 'PaymentCreate',
            params,
          }));
        }
      } else if (isAndroid) {
        yield put(NavigationActions.back());
      }
    }
  } catch (e) {
    console.log('nfcRequestSaga error', e);
    showError(Errors.EXCEPTION_NFC_ERROR);
    yield put(NfcActions.nfcFailure());
  } finally {
    if (nfcChannel) {
      nfcChannel.close();
    }
  }
}

export function* nfcSupportRequestSaga() {
  let isNfcSupported = false;
  try {
    isNfcSupported = yield call([NfcManager, NfcManager.isSupported]);
  } catch (err) {
    console.log('nfcSupportRequestSaga error', err);
  }

  yield put(NfcActions.isNfcSupportedSuccess(isNfcSupported));
}

export default function* sagas() {
  yield all([
    takeLatest(NfcTypes.NFC_REQUEST, nfcRequestSaga),
    takeLatest(NfcTypes.IS_NFC_SUPPORTED_REQUEST, nfcSupportRequestSaga),
  ]);
}
