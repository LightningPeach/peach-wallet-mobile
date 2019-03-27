import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { StartupTypes } from '../Redux/StartupRedux';
import { getServerLightningPeerAddress, getLisServer } from '../Config/AppConfig';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signInRequest: ['password', 'isEnableAnalytics'],
  signInSuccess: ['isTestnet'],
  signInFailure: ['error'],

  signOutRequest: null,

  connectNodeRequest: ['host', 'tlcCert', 'macaroons', 'isEnableAnalytics'],
  connectNodeSuccess: ['isTestnet'],
  connectNodeFailure: ['error'],

  chainSyncUpdate: ['isSynced', 'syncProgress'],

  unlockRequest: ['pin'],
  unlockSuccess: null,
  unlockFailure: ['error'],

  createPinRequest: ['pin'],
  createPinSuccess: null,

  changePinRequest: ['pin'],

  changePrivacyMode: ['privacyMode'],
});

export const AccountTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  signedIn: false,
  userName: null,
  errorSignIn: null,
  errorSignUp: null,
  isTestnet: false,
  changePasswordRequest: false,
  changePasswordError: null,
  isSynced: false,
  syncProgress: 0,
  errorUnlock: null,
  changePinError: null,
  privacyMode: null,
});

/* ------------- Selectors ------------- */

export const AccountSelectors = {
  getSignedIn: state => state.account.signedIn,
  getUserName: state => state.account.userName,
  isTestnet: state => state.account.isTestnet,
  getServerLightningPeerAddress: state => getServerLightningPeerAddress(state.account.isTestnet),
  getLisServer: state => getLisServer(state.account.isTestnet),
  isSynced: state => state.account.isSynced,
  getSyncProgress: state => state.account.syncProgress,
  getUnlockError: state => state.account.errorUnlock,
  getPrivacyMode: state => state.account.privacyMode,
};

/* ------------- Reducers ------------- */

export const requestSignIn = state => state.merge({ errorSignIn: null });
export const requestSignUp = state => state.merge({ errorSignUp: null });
export const requestUnlock = state => state.merge({ errorUnlock: null });

export const successSignIn = (state, { isTestnet }) => state.merge({ signedIn: true, isTestnet });
export const successSignUp = (state, { isTestnet }) => state.merge({ signedIn: true, isTestnet });

export const failureSignIn = (state, { error }) => state.merge({ errorSignIn: error });
export const failureSignUp = (state, { error }) => state.merge({ errorSignUp: error });
export const failureUnlock = (state, { error }) => state.merge({ errorUnlock: error });

export const onStartUp = state => state.merge({ signedIn: false });

export const onChainSyncUpdate = (state, { isSynced, syncProgress }) =>
  state.merge({ isSynced, syncProgress });

export const onChangePrivacyMode = (state, { privacyMode }) => state.merge({ privacyMode });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGN_IN_REQUEST]: requestSignIn,
  [Types.SIGN_IN_SUCCESS]: successSignIn,
  [Types.SIGN_IN_FAILURE]: failureSignIn,

  [Types.CONNECT_NODE_REQUEST]: requestSignUp,
  [Types.CONNECT_NODE_SUCCESS]: successSignUp,
  [Types.CONNECT_NODE_FAILURE]: failureSignUp,

  [Types.CHAIN_SYNC_UPDATE]: onChainSyncUpdate,
  [StartupTypes.STARTUP]: onStartUp,

  [Types.UNLOCK_REQUEST]: requestUnlock,
  [Types.UNLOCK_FAILURE]: failureUnlock,

  [Types.CHANGE_PRIVACY_MODE]: onChangePrivacyMode,
});
