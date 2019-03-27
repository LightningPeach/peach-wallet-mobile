import { select, put, call } from 'redux-saga/effects';
import SplashScreen from 'react-native-splash-screen';
import { NavigationActions, StackActions } from 'react-navigation';
import { AccountSelectors } from '../Redux/AccountRedux';
import NfcActions from '../Redux/NfcRedux';
import Security from '../Services/Security';
import { isReallyEmpty } from '../Services/Utils';

// process STARTUP actions
export function* startup() {
  const userName = yield select(AccountSelectors.getUserName);
  let pin;
  try {
    pin = yield call([Security, Security.getPin]);
  } catch (e) {
    console.log(e);
  }
  const isSignedUp = !isReallyEmpty(userName);
  const isPinSetUp = !isReallyEmpty(pin);

  if (isPinSetUp) {
    yield put(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'UnlockPinScreen',
        }),
      ],
      key: null,
    }));
  } else if (isSignedUp) {
    yield put(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'SignIn',
        }),
      ],
      key: null,
    }));
  } else {
    yield put(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'SignUp',
          params: {
            firstScreen: true,
          },
        }),
      ],
      key: null,
    }));
  }

  yield call([SplashScreen, SplashScreen.hide]);
  yield put(NfcActions.isNfcSupportedRequest());
}
