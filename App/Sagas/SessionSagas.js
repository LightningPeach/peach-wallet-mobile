import { call, put, take, race } from 'redux-saga/effects';

import { AccountTypes } from '../Redux/AccountRedux';
import { AppStateTypes } from '../Redux/AppStateRedux';
import SessionActions from '../Redux/SessionRedux';
import { delay } from '../Services/Delay';

const SESSION_LENGTH = 5 * 60 * 1000;

export function* handleExpiration() {
  while (true) {
    yield take(AppStateTypes.APP_BACKGROUND);

    const { expire } = yield race({
      foreground: take(AppStateTypes.APP_FOREGROUND),
      expire: call(delay, SESSION_LENGTH),
    });

    if (expire) {
      return;
    }
  }
}

export default function* onSessionStart() {
  while (true) {
    yield take([AccountTypes.UNLOCK_SUCCESS, AccountTypes.CONNECT_NODE_SUCCESS]);
    yield put(SessionActions.sessionStart());
    console.log('Session start');

    yield race({
      expire: call(handleExpiration),
    });

    console.log('Session stop');
    yield put(SessionActions.sessionStop());
  }
}
