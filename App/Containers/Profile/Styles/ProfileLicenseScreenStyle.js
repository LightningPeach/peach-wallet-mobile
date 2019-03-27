import { StyleSheet } from 'react-native';
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  webView: {
    backgroundColor: '#00000000',
  },
  content: {
    ...Fonts.style.normal,
  },
  bottomBarContainer: {
    marginTop: -Metrics.bottomShadowHeight,
  },
  bottomBar: {
    height: 56,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: 0,
    marginLeft: Metrics.marginHorizontal,
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    marginRight: Metrics.marginHorizontal,
  },
  pagingText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.medium,
    color: Colors.white54,
  },
});
