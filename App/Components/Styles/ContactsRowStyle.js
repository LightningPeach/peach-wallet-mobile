import { StyleSheet } from 'react-native';
import { Metrics, Fonts } from '../../Themes';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Metrics.doubleBaseMargin,
    marginLeft: Metrics.section,
  },
  titleTextFirstLetter: {
    ...Fonts.style.semibold,
    fontSize: Fonts.size.regular,
  },
  titleText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    flex: 1,
    flexWrap: 'wrap',
  },
});
