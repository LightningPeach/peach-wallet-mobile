import { StyleSheet } from 'react-native';
import { ApplicationStyles, Fonts, Metrics } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  text: {
    ...Fonts.style.normal,
    textAlign: 'center',
    marginHorizontal: Metrics.doubleSection,
    alignSelf: 'center',
  },
  title: {
    width: Metrics.profile.paymentRequestTitle,
    marginBottom: Metrics.doubleSection,
  },
  buttonsSection: {
    marginTop: Metrics.doubleSection,
  },
  button: {
    marginTop: 0,
    marginBottom: Metrics.oneAndHalfBaseMargin,
    marginLeft: Metrics.tripleBaseMargin,
    marginRight: Metrics.tripleBaseMargin,
  },
});
