import { StyleSheet } from 'react-native';
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  connectNodeContainer: {
    marginBottom: 30,
  },
  connectNodeText: {
    ...Fonts.style.medium,
    fontSize: Fonts.size.regular,
    color: Colors.orange,
    paddingVertical: Metrics.baseMargin,
    textAlign: 'center',
  },
});
