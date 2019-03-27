import { take, fork } from 'redux-saga/effects';

export const takeLeading = (patternOrChannel, saga, ...args) => fork(function* g() {
  let lastTask;
  while (true) {
    const action = yield take(patternOrChannel);
    if (!lastTask || !lastTask.isRunning()) {
      lastTask = yield fork(saga, ...args.concat(action));
    }
  }
});
