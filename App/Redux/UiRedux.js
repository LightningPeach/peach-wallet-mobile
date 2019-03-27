import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import ConfigTypes from '../Config/Types';
import AppConfig from '../Config/AppConfig';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  updateBtcFraction: ['btcFraction'],
  showLoading: ['isShowLoading'],
  enableBackgroundService: ['isEnableBackgroundService'],
  agreePolicy: ['agree'],
  enableAnalytics: ['enable'],
});

export const UiTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  btcFraction: ConfigTypes.mBTC,
  isShowLoading: false,
  isEnableBackgroundService: true,
  agreedPolicyVersion: undefined,
  analyticsEnabled: false,
});

/* ------------- Selectors ------------- */

export const UiSelectors = {
  getBtcFraction: state => state.ui.btcFraction,
  isShowLoading: state => state.ui.isShowLoading,
  isEnableBackgroundService: state => state.ui.isEnableBackgroundService,
  isPolicyAgreed: state => state.ui.agreedPolicyVersion === AppConfig.policyVersion,
  isAnalyticsEnabled: state => state.ui.analyticsEnabled,
};

/* ------------- Reducers ------------- */
export const update = (state, { btcFraction }) => state.merge({ btcFraction });
export const onShowLoading = (state, { isShowLoading }) => state.merge({ isShowLoading });
export const onEnableBackgroundService = (state, { isEnableBackgroundService }) =>
  state.merge({ isEnableBackgroundService });
export const onAgreePolicy = (state, { agree }) =>
  state.merge({ agreedPolicyVersion: agree ? AppConfig.policyVersion : null });

export const onEenableAnalytics = (state, { enable }) => state.merge({ analyticsEnabled: enable });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_BTC_FRACTION]: update,
  [Types.SHOW_LOADING]: onShowLoading,
  [Types.ENABLE_BACKGROUND_SERVICE]: onEnableBackgroundService,
  [Types.AGREE_POLICY]: onAgreePolicy,
  [Types.ENABLE_ANALYTICS]: onEenableAnalytics,
});
