import { Dimensions } from 'react-native';
import { isIOS } from './Utils';

const { width, height } = Dimensions.get('window');

const screenWidth = width < height ? width : height;
const screenHeight = width < height ? height : width;

// Used via Metrics.baseMargin
const metrics = {
  mainScreenWidgetWidth: 88,
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  oneAndHalfBaseMargin: 15,
  doubleBaseMargin: 20,
  tripleBaseMargin: 30,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth,
  screenHeight,
  navBarHeight: isIOS ? 56 : 0,
  buttonRadius: isIOS ? 8 : 2,
  walletRadius: 8,
  channelsRadius: isIOS ? 7 : 12.5,
  widget: 75,
  menuItemHeight: 75,
  widgetRadius: 37.5,
  activeOpacity: 0.7,
  halfWidth: '50%',
  fullSize: '100%',
  tabBarHeight: 68,
  bottomShadowHeight: 10,
  search: {
    searchIconExpandedMargin: 20,
    searchIconCollapsedMargin: (screenWidth / 2) - 30,
    placeholderExpandedMargin: 40,
    placeholderCollapsedMargin: (screenWidth / 2) - 50,
  },
  qr: {
    height: 76,
    width: 76,
  },
  qrRadius: 38,
  profile: {
    addressRightMargin: 55,
    signOutVerticalMargin: 32.5,
    paymentRequestTitle: '50%',
  },
  channels: {
    progressHeight: 25,
    customChannelHeight: 31,
    customChannelWidth: 51,
    customChannelToggleSize: 29.5,
    customChannelSwitchHeight: 45,
    customChannelBorderRadius: 16,
  },
  icons: {
    tiny: {
      height: 15,
      width: 15,
    },
    small: {
      height: 20,
      width: 20,
    },
    logo: {
      width: isIOS ? 20 : 26,
      height: isIOS ? 20 : 26,
    },
    medium: {
      height: 30,
      width: 30,
    },
    large: {
      height: 45,
      width: 45,
    },
    xl: {
      height: 50,
      width: 50,
    },
    walletSmall: {
      height: 16,
      width: 10,
    },
    walletBig: {
      height: 40.5,
      width: 42.5,
    },
    qr: {
      height: 38,
      width: 38,
    },
    createChanel: {
      height: 39,
      width: 43.5,
    },
    nfcPayment: {
      height: 40,
      width: 40,
    },
    paymentHistoryIcon: {
      success: {
        height: 14.5,
        width: 20,
      },
      error: {
        height: 18,
        width: 18,
      },
      pending: {
        height: 18,
        width: 20,
      },
    },
    add: {
      height: 17,
      width: 17,
    },
    headerIcom: {
      height: 17,
      width: 17,
    },
    close: 43,
    search: 14.5,
    searchPlaceholder: 59,
    contactsPlaceholder: {
      height: 54.5,
      width: 51,
    },
    userPlaceholder: {
      height: 62,
      width: 52.5,
    },
    icEye: 25,
    profileAddressType: {
      width: 9.3,
      height: 13.7,
    },
    profileAddressAction: {
      width: 40.5,
      height: 40.5,
    },
    channelsEmptyPlaceholder: {
      width: 72,
      height: 39,
    },
    channelsError: {
      width: 136.5,
      height: 136.5,
    },
    success: {
      width: 136.5,
      height: 136.5,
    },
    streamPlaceholder: {
      width: 75,
      height: 59,
    },
    historyPlaceholder: {
      width: 72,
      height: 58,
    },
    mainTab: {
      width: isIOS ? 39 : 30,
      height: isIOS ? 27 : 30,
    },
    qrMarker: {
      width: 250,
      height: 250,
    },
    streamCreated: {
      width: 138,
      height: 107,
    },
    delete: {
      width: 27,
      height: 20,
    },
    lock: {
      width: 16,
      height: 16,
    },
    smallLock: {
      width: 14,
      height: 14,
    },
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200,
  },
};

export default metrics;
