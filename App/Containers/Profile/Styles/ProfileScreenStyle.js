import { StyleSheet, Platform } from 'react-native';
import { isIOS, ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...Fonts.style,
  container: {
    ...ApplicationStyles.screen.container,
    paddingHorizontal: isIOS ? 0 : Metrics.oneAndHalfBaseMargin,
  },
  headerTitleStyle: {
    ...ApplicationStyles.screen.headerTitleStyle,
    paddingLeft: 0,
  },
  header: {
    padding: Metrics.section,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: Colors.darkGray,
        borderBottomWidth: 1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  userIcon: {
    ...Platform.select({
      android: {
        padding: Metrics.oneAndHalfBaseMargin,
        borderColor: Colors.orange,
        borderWidth: 1,
        borderRadius: 100,
      },
    }),
  },
  title: {
    ...Fonts.style.medium,
    fontSize: isIOS ? Fonts.size.h2 : Fonts.size.input,
    marginLeft: isIOS ? Metrics.doubleBaseMargin : 0,
    marginTop: isIOS ? 0 : Metrics.baseMargin,
  },
  addressSection: {
    marginLeft: isIOS ? Metrics.oneAndHalfBaseMargin : 0,
    marginRight: Metrics.doubleBaseMargin,
    marginTop: 0,
    marginBottom: 0,
  },
  addressSeparator: {
    height: 1,
    backgroundColor: Colors.darkGray,
    marginLeft: Metrics.tripleBaseMargin,
    marginRight: -Metrics.section,
  },
  actionsContainer: {
    borderTopColor: Colors.darkGray,
    borderTopWidth: 1,
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1,
  },
  actionsRowBase: {
    flexDirection: 'row',
    paddingVertical: Metrics.doubleBaseMargin,
    paddingLeft: Metrics.section,
    paddingRight: Metrics.section,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsRowWithValueBase: {
    flexDirection: 'row',
    paddingVertical: Metrics.doubleBaseMargin,
    paddingLeft: Metrics.section,
    paddingRight: Metrics.section,
    alignItems: 'center',
  },
  actionsRowBorderBottom: {
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1,
  },
  connectButtonStyle: {
    marginTop: 40,
    marginLeft: 32,
    marginRight: 32,
  },
  passButtonStyle: {
    marginBottom: Metrics.baseMargin,
  },
  signOutHelp: {
    ...Fonts.base,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: Metrics.marginVertical,
  },
  contactSection: {
    marginTop: isIOS ? Metrics.doubleBaseMargin : 0,
  },
  contactText: {
    color: Colors.orange,
    textAlign: 'center',
    ...Fonts.base,
  },
  footerSection: {
    marginTop: isIOS ? Metrics.doubleSection : Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionValue: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    color: Colors.warmGrey,
    marginRight: Metrics.baseMargin,
  },
});
