import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    marginLeft: Metrics.section,
  },
  copyButton: {
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
  },
  icon: {
    marginRight: Metrics.baseMargin,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.doubleBaseMargin,
    paddingRight: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  column: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingRight: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  textInfo: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    color: Colors.darkGray,
    textAlign: 'right',
  },
  descriptionText: {
    ...Fonts.style.bold,
  },
  tokenText: {
    ...Fonts.style.base,
    color: Colors.darkGray,
    marginTop: Metrics.baseMargin,
  },
});
