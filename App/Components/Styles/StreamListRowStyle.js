import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes';

export default StyleSheet.create({
  row: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
  },
  textRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInfo: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    maxWidth: Metrics.halfWidth,
  },
  textDate: {
    ...Fonts.style.base,
    color: Colors.darkGray,
  },
});
