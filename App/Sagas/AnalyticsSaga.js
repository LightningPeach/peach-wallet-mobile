import { all, takeEvery, call } from 'redux-saga/effects';
import { UiTypes } from '../Redux/UiRedux';
import { enableAnalytics } from '../Services/Analytics';

function* onEnableAnalytics({ enable }) {
  yield call(enableAnalytics, enable);
}

export default function* saga() {
  yield all([takeEvery(UiTypes.ENABLE_ANALYTICS, onEnableAnalytics)]);
}
