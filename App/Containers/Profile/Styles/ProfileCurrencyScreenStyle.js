import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    ...ApplicationStyles.screen.container,
    marginLeft: Metrics.tripleBaseMargin,
    marginRight: Metrics.tripleBaseMargin,
  },
});
