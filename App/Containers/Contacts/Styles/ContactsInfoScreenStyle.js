import { StyleSheet, Platform } from 'react-native';
import { isIOS, ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  screenContainer: {
    ...ApplicationStyles.screen.screenContainer,
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    ...Metrics.icons.userPlaceholder,
    marginVertical: Metrics.doubleBaseMargin,
  },
  nameText: {
    ...Fonts.style.medium,
    fontSize: Fonts.size.h2,
    marginBottom: Metrics.section,
  },
  buttonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...Platform.select({
      ios: {
        backgroundColor: Colors.tabBar,
      },
      android: {
        paddingBottom: Metrics.baseMargin,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkGray,
      },
    }),
  },
  buttonText: {
    ...Fonts.style.medium,
    paddingVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    fontSize: Fonts.size.regular,
    color: Colors.orange,
  },
  inputSection: {
    margin: Metrics.section,
    marginHorizontal: 0,
    paddingHorizontal: isIOS ? Metrics.tripleBaseMargin : Metrics.oneAndHalfBaseMargin,
  },
  buttonStyle: {
    borderColor: Colors.errors,
  },
  buttonTextStyle: {
    color: Colors.errors,
  },
});
