import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts } from '../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    ...ApplicationStyles.screen.centerContainer,
    alignItems: 'center',
    paddingHorizontal: Metrics.tripleBaseMargin,
  },
  textTitle: {
    ...Fonts.style.bold,
    fontSize: Fonts.size.h3,
    textAlign: 'center',
    marginBottom: Metrics.baseMargin,
    marginTop: Metrics.oneAndHalfBaseMargin,
  },
});
