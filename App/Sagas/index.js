import { all, fork, takeLatest } from 'redux-saga/effects';
import { networkEventsListenerSaga } from 'react-native-offline';

import API from '../Services/Api';
import Config from '../Config/AppConfig';
import FixtureAPI from '../Services/FixtureApi';
import DebugConfig from '../Config/DebugConfig';

/* ------------- Types ------------- */
import { StartupTypes } from '../Redux/StartupRedux';
import { CurrenciesTypes } from '../Redux/CurrenciesRedux';

/* ------------- Sagas ------------- */
import { startup } from './StartupSagas';
import accountSaga from './AccountSagas';
import contactsSaga from './ContactsSagas';
import { getCurrentUsdPerBtc } from './CurrenciesSagas';
import lisSagas from './LisSaga';
import backgroundServiceSaga from './BackgroundServiceSaga';
import nfcSagas from './NfcSagas';
import sessionSagas from './SessionSagas';
import analyticsSaga from './AnalyticsSaga';
import streamsSaga from './StreamsSagas';

import lightningSaga from './LightningSagas';
import onchainSaga from './OnchainSagas';
import channelsSaga from './ChannelsSagas';
import paymentCreateScreenSaga from './PaymentCreateScreenSaga';
import syncSagas from './SyncSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(CurrenciesTypes.USD_PER_BTC_REQUEST, getCurrentUsdPerBtc, api),

    fork(contactsSaga),
    fork(accountSaga, api),
    fork(lightningSaga, api),
    fork(onchainSaga, api),
    fork(channelsSaga, api),

    fork(networkEventsListenerSaga, {
      checkConnectionInterval: Config.checkInternetTimeout,
      withExtraHeadRequest: false,
    }),

    fork(paymentCreateScreenSaga, api),
    fork(streamsSaga, api),
    fork(backgroundServiceSaga),
    fork(nfcSagas),
    fork(sessionSagas),
    fork(syncSagas, api),
    fork(analyticsSaga),
    fork(lisSagas, api),
  ]);
}
