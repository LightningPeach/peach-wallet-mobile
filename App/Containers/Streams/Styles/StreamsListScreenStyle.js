import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    ...ApplicationStyles.screen.container,
    marginLeft: Metrics.doubleBaseMargin,
  },
  standardIcon: {
    ...Metrics.icons.streamPlaceholder,
    marginTop: 58,
    alignSelf: 'center',
  },
  standardText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    color: Colors.darkGray,
    marginTop: 20,
    alignSelf: 'center',
  },
  standardButton: {
    marginTop: 30,
    marginLeft: 32,
    marginRight: 32,
  },
  lockIcon: {
    ...Metrics.icons.lock,
    tintColor: Colors.orange,
    marginLeft: Metrics.baseMargin,
  },
});
