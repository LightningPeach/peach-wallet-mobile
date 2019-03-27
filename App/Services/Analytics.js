import firebase from 'react-native-firebase';
import Types from '../Config/Types';

firebase.utils().errorOnMissingPlayServices = false;
firebase.utils().promptOnMissingPlayServices = false;

export const Events = {
  ProfileSignout: 'profile_signout',
  ProfileBtcAddressCopy: 'profile_btc_address_copy',
  ProfileBtcAddressRenew: 'profile_btc_address_renew',
  ProfileLightningIdCopy: 'profile_lightning_id_copy',
  ProfileEnableBackgroundService: 'profile_enable_background_service',

  ChannelCloseCooperatively: 'channel_close_cooperatively',
  ChannelCloseNonCooperatively: 'channel_close_non_cooperatively',

  ProfileLicenseAgree: 'profile_license_agree',
  ProfileLicenseDataProcessingEnable: 'profile_license_data_processing_enable',
  DeployLndOpen: 'deploy_lnd_open',
  DeployLndShare: 'deploy_lnd_share',

  StreamInfoStartStream: 'stream_info_start_stream',
  StreamInfoPauseStream: 'stream_info_pause_stream',
  StreamInfoStopStream: 'stream_info_stop_stream',

  Login: 'login',
  SignUp: 'sign_up',
  Unlock: 'unlock',
};

const mapType = (type) => {
  switch (type) {
    case Types.LIGHTNING:
      return 'LI';
    case Types.ONCHAIN:
      return 'ON';
    default:
      return null;
  }
};

const mapSubType = (type) => {
  switch (type) {
    case Types.REGULAR:
      return 'RE';
    case Types.STREAM:
      return 'ST';
    default:
      return null;
  }
};

const getScreenName = (route) => {
  let { type, subType } = route.params || {};

  let screenName;
  switch (route.routeName) {
    case 'PaymentHistory':
    case 'PaymentCreate':
    case 'PaymentData':
    case 'PaymentResponse':
      type = mapType(type);
      subType = mapSubType(subType);
      screenName = `${route.routeName}${type ? `_${type}${subType ? `_${subType}` : ''}` : ''}`;
      break;
    default:
      screenName = route.routeName;
      break;
  }

  return screenName;
};

// gets the current screen from navigation state
export const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }

  return getScreenName(route);
};

export const enableAnalytics = (enable) => {
  firebase.analytics().setAnalyticsCollectionEnabled(enable);
};
export const logNavigation = (fromScreen, toScreen) => {
  console.log(`NAVIGATING ${fromScreen} to ${toScreen}`);
  firebase.analytics().setCurrentScreen(toScreen);
  firebase.analytics().logEvent(`nav_${fromScreen}_${toScreen}`);
};

export const logEvent = (event, params) => {
  firebase.analytics().logEvent(event, params);
};
