import { pathOr } from 'ramda';
import { call, put, take, select, race } from 'redux-saga/effects';

import { SessionTypes } from '../Redux/SessionRedux';

import { delay } from '../Services/Delay';

import AccountActions, { AccountSelectors } from '../Redux/AccountRedux';
import AppConfig from '../Config/AppConfig';

function* mainLoop(api) {
  if (AppConfig.network.isSimnet) {
    yield put(AccountActions.chainSyncUpdate(true, 1));
    return;
  }

  const isTestnet = yield select(AccountSelectors.isTestnet);
  while (true) {
    let { response } = yield call(api.getInfo);
    console.log('getInfo', response);
    if (response && response.status === 200) {
      const body = JSON.parse(response.bodyString);
      const { synced_to_chain: syncedToChain, block_height: blockHeight } = body;

      let progress = 0;
      if (syncedToChain) {
        progress = 1.0;
      } else {
        response = yield call(api.getBlockchainHeight, isTestnet);
        console.log('getHeight response', response);
        if (response.ok) {
          console.log('getBlockchainHeight', response.data);
          const currentBlockChainHeight = pathOr(0, ['data', 'height'], response);
          console.log('currentBlockChainHeight', currentBlockChainHeight);

          progress = blockHeight / currentBlockChainHeight;
          if (progress > 0.99) {
            progress = 0.99;
          }
        }
      }

      console.log('chainSyncUpdate', syncedToChain, progress);
      yield put(AccountActions.chainSyncUpdate(syncedToChain, progress));
      if (syncedToChain) {
        return;
      }
    }

    yield call(delay, AppConfig.lndSyncInterval);
  }
}

export default function* sagas(api) {
  while (true) {
    yield take(SessionTypes.SESSION_START);
    yield race({
      task: call(mainLoop, api),
      cancel: take(SessionTypes.SESSION_STOP),
    });
  }
}
