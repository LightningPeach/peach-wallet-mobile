import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    ...ApplicationStyles.screen.centerContainer,
    marginHorizontal: Metrics.doubleBaseMargin,
  },
  icon: {
    ...Metrics.icons.channelsError,
    marginBottom: Metrics.smallMargin,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    color: Colors.errors,
    fontSize: Fonts.size.h3,
    fontFamily: Fonts.type.bold,
    marginBottom: Metrics.baseMargin,
  },
  description: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    marginBottom: Metrics.baseMargin,
    textAlign: 'center',
  },
  errorInstructionsMessage: {
    marginTop: Metrics.doubleBaseMargin,
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    textAlign: 'left',
  },
  linkText: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    textAlign: 'left',
    color: Colors.orange,
    textDecorationLine: 'underline',
  },
  button: {
    marginBottom: Metrics.doubleBaseMargin,
    marginHorizontal: Metrics.doubleBaseMargin,
  },
});
