import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollViewContentContainer: {
    ...ApplicationStyles.screen.centerContainer,
    paddingHorizontal: Metrics.tripleBaseMargin,
  },
  image: {
    ...Metrics.icons.success,
    alignSelf: 'center',
    marginBottom: Metrics.oneAndHalfBaseMargin,
  },
  textTitle: {
    ...Fonts.style.bold,
    fontSize: Fonts.size.h3,
    textAlign: 'center',
    marginBottom: Metrics.baseMargin,
  },
  errorMessage: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
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
  textSuccess: {
    color: Colors.lightGreen,
  },
  textError: {
    color: Colors.errors,
  },
  textSubTitle: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    marginBottom: Metrics.baseMargin,
    textAlign: 'center',
  },
  okButton: {
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.tripleBaseMargin,
  },
  createNewPaymentButton: {
    marginTop: Metrics.oneAndHalfBaseMargin,
    marginBottom: Metrics.oneAndHalfBaseMargin,
    marginHorizontal: Metrics.tripleBaseMargin,
  },
  closeIcon: {
    marginLeft: Metrics.oneAndHalfBaseMargin,
  },
});
