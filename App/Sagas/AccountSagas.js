/* eslint-disable no-continue */
import { put, call, take, select, all, takeLatest } from 'redux-saga/effects';
import { StackActions } from 'react-navigation';
import AccountActions, { AccountTypes, AccountSelectors } from '../Redux/AccountRedux';
import UiActions from '../Redux/UiRedux';

import { pemToDem } from '../Transforms/crypto';
import Security from '../Services/Security';

import { isHttps, validateMacaroons, validatePin } from '../Services/Check';

import CommonActions from '../Redux/CommonRedux';
import LisActions from '../Redux/LisRedux';
import { delayForSagasRequest, delay } from '../Services/Delay';
import { ensureRealmIntilialized, AuthData } from '../Realm';
import { Events, logEvent } from '../Services/Analytics';
import { streamsInit } from '../Sagas/StreamsSagas';
import Errors, { handleLndResponseError } from '../Config/Errors';

import { showError } from '../Services/InformBox';
import { isReallyEmpty } from '../Services/Utils';
import { isIOS } from '../Themes';
import LightningActions from '../Redux/LightningRedux';
import OnchainActions from '../Redux/OnchainRedux';
import CurrenciesActions from '../Redux/CurrenciesRedux';
import AppConfig from '../Config/AppConfig';
import { NetworkSelectors } from '../Redux/NetworkRedux';
import ChannelsActions from '../Redux/ChannelsRedux';

function* getServerInfo(api) {
  let { response, error } = yield call(api.getInfo);

  if (response && response.status === 200) {
    response = JSON.parse(response.bodyString);
  } else {
    error = handleLndResponseError(Errors.EXCEPTION_CONNECT_NODE, response, error);
  }

  return { response, error };
}

function* onInitRealm() {
  yield call(streamsInit);
}

function* restoreApiParams(api) {
  try {
    const { host, macaroons, tlcCert } = AuthData.get();

    // Set API base params
    yield call(api.setBaseUrl, host);
    yield call(api.setHeaders, macaroons);
    yield call(api.setTLS, tlcCert);
  } catch (e) {
    console.log('restoreApiParams error', e);
  }
}

function* ensurePrivacyModeSelected() {
  const privacyMode = yield select(AccountSelectors.getPrivacyMode);
  if (!privacyMode) {
    yield put(StackActions.replace({ routeName: 'PrivacyModeSelectScreen', params: { firstScreen: true } }));
    yield take(AccountTypes.CHANGE_PRIVACY_MODE);
  }
}

export function* signIn(api, { password, isEnableAnalytics }) {
  yield put(UiActions.showLoading(true));
  // async state hack
  yield delayForSagasRequest();

  const storedPassword = yield call([Security, Security.getPassword]);

  if (password !== storedPassword) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.signInFailure(Errors.EXCEPTION_SIGNIN));
    return;
  }

  try {
    const dbKey = yield call([Security, Security.getDbKey]);
    yield call(ensureRealmIntilialized, dbKey);
    yield call(onInitRealm);
  } catch (ex) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.signInFailure(Errors.EXCEPTION_SIGNIN));
    return;
  }

  const authData = AuthData.get();
  if (!authData) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.signInFailure(Errors.EXCEPTION_SIGNIN_NO_SIGNUP));
    return;
  }

  yield call(restoreApiParams, api);

  const { response, error } = yield call(getServerInfo, api);
  if (!response || error) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.signInFailure(error));
    return;
  }

  logEvent(Events.Login);

  yield put(AccountActions.signInSuccess(response.testnet));
  yield put(UiActions.agreePolicy(true));
  yield put(UiActions.enableAnalytics(isEnableAnalytics));
  yield put(UiActions.showLoading(false));

  yield put(StackActions.replace({ routeName: 'CreatePinScreen' }));

  yield take(AccountTypes.CREATE_PIN_SUCCESS);

  yield call(ensurePrivacyModeSelected);

  yield put(AccountActions.unlockSuccess(response.testnet));
}

export function* signUp(api, {
  host, tlcCert, macaroons, isEnableAnalytics,
}) {
  // async state hack
  yield delayForSagasRequest();

  let isTestnet = false;

  if (!host) {
    yield put(AccountActions.connectNodeFailure(Errors.EXCEPTION_NAMED_FIELD_REQUIRED('Host')));
    return;
  }

  if (!isHttps(host)) {
    yield put(AccountActions.connectNodeFailure(Errors.EXCEPTION_HTTPS_HOST));
    return;
  }

  if (!tlcCert) {
    yield put(AccountActions.connectNodeFailure(Errors.EXCEPTION_NAMED_FIELD_REQUIRED('TLS cert')));
    return;
  }

  const error = validateMacaroons(macaroons);
  if (error) {
    yield put(AccountActions.connectNodeFailure(error));
    return;
  }

  yield put(UiActions.showLoading(true));

  try {
    let dbKey = yield call([Security, Security.getDbKey]);
    if (isReallyEmpty(dbKey)) {
      dbKey = yield call([Security, Security.generateAndSaveDbKey]);
    }

    yield call(ensureRealmIntilialized, dbKey);
  } catch (ex) {
    yield put(AccountActions.connectNodeFailure(ex.message || Errors.EXCEPTION_SIGNIN));
    yield put(UiActions.showLoading(false));
    return;
  }

  let cert = tlcCert;

  if (isIOS) cert = pemToDem(cert);

  // Set API base params
  yield call(api.setBaseUrl, host);
  yield call(api.setHeaders, macaroons);
  yield call(api.setTLS, cert);

  const { response, error: getServerInfoError } = yield call(getServerInfo, api);
  if (!response || getServerInfoError) {
    yield call(restoreApiParams, api);
    yield put(AccountActions.connectNodeFailure(getServerInfoError));
    yield put(UiActions.showLoading(false));
    return;
  }

  isTestnet = response.testnet;

  yield call([AuthData, AuthData.save], {
    host,
    tlcCert: cert,
    macaroons,
  });

  yield put(UiActions.showLoading(false));

  const hasPin = yield call([Security, Security.hasPin]);
  if (!hasPin) {
    yield put(StackActions.replace({ routeName: 'CreatePinScreen' }));
    yield take(AccountTypes.CREATE_PIN_SUCCESS);
  }

  yield call(ensurePrivacyModeSelected);

  yield put(CommonActions.reset());

  yield put(AccountActions.connectNodeSuccess(isTestnet));

  logEvent(Events.SignUp);
  yield put(UiActions.agreePolicy(true));
  yield put(UiActions.enableAnalytics(isEnableAnalytics));

  yield put(LisActions.closeConnection());
  yield put(LisActions.openConnection());
}

export function* createPin({ pin }) {
  yield delayForSagasRequest();

  try {
    yield call([Security, Security.savePin], pin);
    yield put(AccountActions.createPinSuccess());
  } catch (e) {
    showError(Errors.EXCEPTION_SAVE_PIN);
  }
}

export function* unlock(api, { pin }) {
  yield delayForSagasRequest();

  yield put(UiActions.showLoading(true));

  const error = yield call(validatePin, pin);
  if (error) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.unlockFailure(error));
    return;
  }

  try {
    const dbKey = yield call([Security, Security.getDbKey]);
    yield call(ensureRealmIntilialized, dbKey);
    yield call(onInitRealm);
  } catch (ex) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.unlockFailure(Errors.EXCEPTION_UNLOCK_NO_NODE));
    return;
  }

  const authData = AuthData.get();
  if (!authData) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.unlockFailure(Errors.EXCEPTION_UNLOCK_NO_NODE));
    return;
  }

  const { host, macaroons, tlcCert } = AuthData.get();

  // Set API base params
  yield call(api.setBaseUrl, host);
  yield call(api.setHeaders, macaroons);
  yield call(api.setTLS, tlcCert);

  const { response } = yield call(getServerInfo, api);
  if (!response) {
    yield put(UiActions.showLoading(false));
    yield put(AccountActions.unlockFailure(Errors.EXCEPTION_CONNECT_NODE));
    return;
  }

  logEvent(Events.Unlock);
  yield put(UiActions.showLoading(false));
  yield call(ensurePrivacyModeSelected);
  yield put(AccountActions.unlockSuccess(response.testnet));
  yield put(UiActions.agreePolicy(true));
  yield put(LisActions.openConnection());
}

export function* changePin({ pin }) {
  yield delayForSagasRequest();

  try {
    yield call([Security, Security.savePin], pin);
    yield put(StackActions.replace({
      routeName: 'ResponseScreen',
      params: { text: 'PIN has been changed' },
    }));
  } catch (e) {
    showError(Errors.EXCEPTION_SAVE_PIN);
  }
}

export function* onUnlockAndConnect() {
  yield put(LightningActions.pubkeyIdRequest());
  yield put(OnchainActions.addressRequest());

  while (true) {
    const isConnected = yield select(NetworkSelectors.isConnected);
    if (isConnected) {
      yield put(LightningActions.lightningBalanceRequest());
      yield put(OnchainActions.onchainBalanceRequest());
      yield put(CurrenciesActions.usdPerBtcRequest());
      yield put(ChannelsActions.channelsRequest());
    }

    yield call(delay, AppConfig.requestInterval);
  }
}

export default function* saga(api) {
  yield all([
    takeLatest(AccountTypes.SIGN_IN_REQUEST, signIn, api),
    takeLatest(AccountTypes.CONNECT_NODE_REQUEST, signUp, api),
    takeLatest(AccountTypes.UNLOCK_REQUEST, unlock, api),
    takeLatest(AccountTypes.CREATE_PIN_REQUEST, createPin),
    takeLatest(AccountTypes.CHANGE_PIN_REQUEST, changePin),
    takeLatest(
      [AccountTypes.UNLOCK_SUCCESS, AccountTypes.CONNECT_NODE_SUCCESS],
      onUnlockAndConnect,
      api,
    ),
  ]);
}
