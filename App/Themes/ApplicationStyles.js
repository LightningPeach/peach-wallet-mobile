import { Platform } from 'react-native';

import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';
import { isIOS } from './Utils';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    screenContainer: {
      flex: 1,
      backgroundColor: Colors.background,
      ...Platform.select({
        android: {
          borderTopWidth: 1,
          borderTopColor: Colors.darkGray,
        },
      }),
    },
    centerContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: Colors.background,
    },
    divider: {
      height: 1,
      backgroundColor: Colors.darkGray,
    },
    bottomShadowDivider: {
      height: Metrics.bottomShadowHeight,
      backgroundColor: Colors.transparent,
    },
    section: {
      margin: Metrics.section,
    },
    popupMenuTextItemWrapper: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: Metrics.menuItemHeight,
      padding: Metrics.baseMargin,
    },
    popupMenuTextItem: {
      ...Fonts.style.medium,
      color: Colors.black,
      textAlign: 'center',
    },
    headerTitleStyle: {
      ...Fonts.style.headerTitle,
      color: Colors.white,
      marginHorizontal: 0,
    },
    headerTitleStyleWithMargin: {
      ...Fonts.style.headerTitle,
      color: Colors.white,
      marginLeft: 16,
    },
    btcCurrentText: {
      flex: 1,
      ...Fonts.style.medium,
      fontSize: isIOS ? Fonts.size.input : Fonts.size.h3,
      textAlign: 'right',
      alignSelf: 'flex-end',
    },
    percentText: {
      ...Fonts.style.regular,
      fontSize: Fonts.size.tab,
      marginLeft: 5,
    },
    textFloat: {
      flex: 1,
    },
    errorText: {
      ...Fonts.style.regular,
      color: Colors.errors,
      fontSize: Fonts.size.small,
      marginHorizontal: Metrics.baseMargin,
      textAlign: 'center',
      marginTop: Metrics.marginVertical,
    },
    linkText: {
      ...Fonts.style.regular,
      color: Colors.orange,
      fontSize: Fonts.size.small,
      textDecorationLine: 'underline',
    },
    placeholderTop: {
      height: 40.5,
      backgroundColor: Colors.tabBar,
    },
    searchShadow: {
      position: 'absolute',
      width: Metrics.screenWidth,
      height: Metrics.screenHeight,
      backgroundColor: Colors.searchShadow,
    },
    closeIcon: {
      marginLeft: Metrics.oneAndHalfBaseMargin,
      marginRight: Metrics.oneAndHalfBaseMargin,
    },
    flexSpace: {
      flex: 1,
    },
    header: {
      backgroundColor: isIOS ? Colors.background : Colors.black,
      borderBottomColor: Colors.background,
    },
    customHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: isIOS ? 'center' : 'flex-start',
      backgroundColor: isIOS ? Colors.background : Colors.black,
      borderBottomColor: Colors.background,
    },
    headerLockStyle: {
      ...Metrics.icons.smallLock,
      alignSelf: 'center',
      marginLeft: 5,
    },
    flex: {
      flex: 1,
    },
  },
};

export default ApplicationStyles;

export { isIOS };
