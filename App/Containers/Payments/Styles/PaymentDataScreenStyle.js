import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    ...ApplicationStyles.screen.container,
    paddingHorizontal: Metrics.tripleBaseMargin,
  },
  row: {
    marginVertical: Metrics.baseMargin,
  },
  label: {
    ...Fonts.style.bold,
    paddingBottom: Metrics.oneAndHalfBaseMargin,
  },
  value: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    color: Colors.darkGray,
  },
  addressText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    color: Colors.darkGray,
    marginTop: Metrics.baseMargin,
  },
  valueAmount: {
    color: Colors.orange,
    fontSize: Fonts.size.h3,
    fontFamily: Fonts.type.bold,
  },
  button: {
    marginHorizontal: Metrics.tripleBaseMargin,
    marginVertical: Metrics.section,
  },
});
