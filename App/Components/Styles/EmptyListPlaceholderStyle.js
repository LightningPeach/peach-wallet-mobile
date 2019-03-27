import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes';

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    ...Metrics.icons.xl,
  },
  infoText: {
    fontFamily: Fonts.type.regular,
    fontSize: Fonts.size.small,
    color: Colors.darkGray,
    paddingTop: Metrics.doubleBaseMargin,
    textAlign: 'center',
  },
});
