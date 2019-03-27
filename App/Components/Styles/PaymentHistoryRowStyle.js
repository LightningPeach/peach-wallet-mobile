import { StyleSheet } from 'react-native';
import { isIOS, Metrics, Fonts, Colors } from '../../Themes/';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Metrics.baseMargin,
    alignItems: 'center',
  },
  icon: {
    marginRight: Metrics.baseMargin,
  },
  descriptionText: {
    flex: 1,
    ...Fonts.style.regular,
    color: isIOS ? Colors.black : Colors.white,
    marginRight: Metrics.doubleBaseMargin,
  },
  btcText: {
    color: Colors.darkGray,
    ...Fonts.style.regular,
    fontSize: Fonts.size.medium,
    textAlign: 'right',
  },
  timeText: {
    ...Fonts.style.base,
    color: Colors.darkGray,
    textAlign: 'right',
  },
});
