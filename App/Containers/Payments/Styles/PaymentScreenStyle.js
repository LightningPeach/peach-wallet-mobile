import { StyleSheet, Platform } from 'react-native';
import { isIOS, ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  header: {
    ...ApplicationStyles.screen.section,
    alignItems: 'center',
  },
  headerTitleText: {
    ...Fonts.style.semibold,
    fontSize: Fonts.size.h1,
  },
  headerSubTitleText: {
    ...Fonts.style.medium,
  },
  headerTokenText: {
    ...Fonts.style.base,
    marginTop: Metrics.doubleBaseMargin,
    fontSize: Fonts.size.small,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  buttonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...Platform.select({
      ios: {
        backgroundColor: Colors.tabBar,
      },
      android: {
        marginHorizontal: isIOS ? 0 : Metrics.oneAndHalfBaseMargin,
        borderBottomColor: Colors.darkGray,
        borderBottomWidth: 1,
      },
    }),
  },
  buttonText: {
    ...Fonts.style.medium,
    paddingVertical: Metrics.doubleBaseMargin,
    fontSize: isIOS ? Fonts.size.regular : Fonts.size.medium,
    color: Colors.orange,
  },
  historySection: {
    backgroundColor: isIOS ? Colors.white : Colors.transparent,
  },
  historyTitleText: {
    ...Fonts.style.medium,
    color: isIOS ? Colors.black : Colors.white,
    margin: Metrics.baseMargin,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
    backgroundColor: isIOS ? Colors.white : Colors.transparent,
  },
  placeholderSection: {
    marginTop: Metrics.doubleSection,
    alignItems: 'center',
  },
  placeholderText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    color: Colors.darkGray,
    marginTop: Metrics.doubleBaseMargin,
    marginHorizontal: Metrics.section,
  },
  headerStyle: {
    paddingVertical: 20,
  },
  titleSection: {
    padding: Metrics.baseMargin,
    backgroundColor: isIOS ? Colors.lightGray : Colors.informBox,
  },
  titleText: {
    ...Fonts.style.medium,
    fontSize: isIOS ? Fonts.size.input : Fonts.size.small,
    color: isIOS ? Colors.black : Colors.white,
  },
  privacyModeView: {
    flexDirection: 'row',
  },
  lockStyle: {
    ...Metrics.icons.smallLock,
    alignSelf: 'center',
    marginLeft: 2,
  },
});
