import { StyleSheet, Platform } from 'react-native';
import { isIOS, Metrics, Fonts, Colors } from '../../Themes/';

export default StyleSheet.create({
  container: {
    marginTop: isIOS ? Metrics.doubleBaseMargin : Metrics.baseMargin,
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
    borderWidth: 1,
    borderRadius: Metrics.walletRadius,
  },
  mainSection: {
    padding: Metrics.baseMargin,
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: Metrics.walletRadius,
    borderTopRightRadius: Metrics.walletRadius,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    ...Metrics.icons.walletSmall,
  },
  titleText: {
    ...Fonts.style.medium,
    color: Colors.black,
    marginLeft: Metrics.baseMargin,
  },
  tokenText: {
    marginVertical: Metrics.baseMargin,
    fontFamily: isIOS ? Fonts.type.base : Fonts.type.bold,
    fontSize: Fonts.size.tab,
    color: Colors.black,
  },
  balanceSection: {
    padding: Metrics.baseMargin,
    backgroundColor: Colors.darkGray,
    borderBottomLeftRadius: Metrics.walletRadius,
    borderBottomRightRadius: Metrics.walletRadius,
  },
  balanceRow: {
    flexDirection: 'row',
  },
  balanceSecondRow: {
    flexDirection: 'row',
    marginTop: Metrics.smallMargin,
  },
  balanceText: {
    color: Colors.white,
    ...Platform.select({
      ios: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.medium,
      },
      android: {
        fontFamily: Fonts.type.bold,
        fontSize: Fonts.size.small,
      },
    }),
  },
  unconfirmedBalanceText: {
    color: Colors.white,
    ...Platform.select({
      ios: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.tiny,
      },
      android: {
        fontFamily: Fonts.type.bold,
        fontSize: Fonts.size.tiny,
      },
    }),
  },
  balanceMainText: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
