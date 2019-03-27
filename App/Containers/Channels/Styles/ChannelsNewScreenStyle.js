import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  toggleContainer: {
    height: Metrics.channels.customChannelSwitchHeight,
    paddingHorizontal: Metrics.section,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.tabBar,
  },
  toggleText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
  },
  button: {
    marginVertical: Metrics.doubleBaseMargin,
    marginHorizontal: 0,
  },
  infoText: {
    ...Fonts.style.base,
    color: Colors.darkGray,
    textAlign: 'center',
  },
});
