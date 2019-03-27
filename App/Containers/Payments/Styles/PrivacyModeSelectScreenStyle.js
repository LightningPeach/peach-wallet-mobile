import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';
import metrics from '../../../Themes/Metrics';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.baseMargin,
  },
  container: {
    ...ApplicationStyles.screen.container,
    paddingTop: Metrics.baseMargin,
  },
  item: {
    paddingTop: metrics.doubleBaseMargin,
    paddingLeft: Metrics.tripleBaseMargin,
    paddingRight: Metrics.tripleBaseMargin,
  },
  title: {
    ...Fonts.style.regular,
    fontSize: 16,
  },
  radioIcon: {},
  icon: {
    tintColor: Colors.white,
  },
  iconSelected: {
    tintColor: Colors.orange,
  },
  selected: {
    color: Colors.orange,
  },
  description: {
    ...Fonts.style.secondaryDescription,
    marginTop: 12,
  },
  activeLabel: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    marginEnd: Metrics.baseMargin,
  },
});
