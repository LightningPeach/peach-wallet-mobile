import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    ...ApplicationStyles.screen.container,
    marginTop: Metrics.doubleBaseMargin,
    marginLeft: Metrics.tripleBaseMargin,
    marginRight: Metrics.tripleBaseMargin,
  },
  description: {
    ...Fonts.style.description,
    color: Colors.warmGrey,
  },
});
