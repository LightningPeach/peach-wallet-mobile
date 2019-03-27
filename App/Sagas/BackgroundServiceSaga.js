import { all, call, takeEvery, select } from 'redux-saga/effects';
import PushNotification from 'react-native-push-notification';
import { AccountTypes, AccountSelectors } from '../Redux/AccountRedux';
import BackgroundService from '../Services/BackgroundService';
import { UiSelectors, UiTypes } from '../Redux/UiRedux';
import Types from '../Config/Types';

function* onStartService() {
  const privacyMode = yield select(AccountSelectors.getPrivacyMode);
  if (privacyMode === Types.MODE_STANDARD) {
    console.log("Can't start Background service in the standard mode");
    return;
  }

  const isEnableBackgroundService = yield select(UiSelectors.isEnableBackgroundService);

  yield call([PushNotification, PushNotification.requestPermissions]);
  yield call(
    [BackgroundService, BackgroundService.start],
    isEnableBackgroundService,
    `You can receive payments and send stream payments when app in background.
Background mode can be disabled in the app Profile screen`,
    () => {
      PushNotification.presentLocalNotification({
        alertBody:
          'Wallet stopped. Bring it up to make it possible to receive payments and send stream payments',
      });
    },
  );
}

function* onStopService() {
  yield call([BackgroundService, BackgroundService.stop]);
}

function* onEnableBackgroundService({ isEnableBackgroundService }) {
  if (isEnableBackgroundService) {
    yield call(onStartService);
  } else {
    yield call(onStopService);
  }
}

function* onChangePrivacyMode({ privacyMode }) {
  if (privacyMode === Types.MODE_EXTENDED) {
    yield call(onStartService);
  } else {
    yield call(onStopService);
  }
}

export default function* backgroundServiceSaga() {
  yield all([
    takeEvery([AccountTypes.SIGN_IN_SUCCESS, AccountTypes.CONNECT_NODE_SUCCESS], onStartService),
    takeEvery(UiTypes.ENABLE_BACKGROUND_SERVICE, onEnableBackgroundService),
    takeEvery(AccountTypes.CHANGE_PRIVACY_MODE, onChangePrivacyMode),
  ]);
}
