import { StyleSheet } from 'react-native';
import { ApplicationStyles, Fonts, Metrics, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    ...ApplicationStyles.screen.container,
    paddingHorizontal: Metrics.tripleBaseMargin,
    justifyContent: 'center',
  },
  title: {
    ...Fonts.style.normal,
    textAlign: 'center',
    width: Metrics.profile.paymentRequestTitle,
    alignSelf: 'center',
    paddingBottom: Metrics.doubleSection,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin,
  },
  textInput: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    paddingVertical: 0,
    marginVertical: 0,
    flex: 1,
  },
  textAmount: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.input,
    color: Colors.orange,
    marginVertical: 0,
  },
  button: {
    margin: Metrics.tripleBaseMargin,
  },
});
