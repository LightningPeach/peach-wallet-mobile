import { StyleSheet } from 'react-native';
import { Colors, Fonts, ApplicationStyles } from '../../Themes/';

export default StyleSheet.create({
  header: {
    ...ApplicationStyles.screen.header,
  },
  headerStreams: {
    backgroundColor: Colors.background,
    borderBottomColor: Colors.background,
  },
  headerTitleStyle: {
    ...ApplicationStyles.screen.headerTitleStyle,
  },
  headerTitleStyleWithMargin: {
    ...ApplicationStyles.screen.headerTitleStyleWithMargin,
  },
  labelStyle: {
    ...Fonts.style.tab,
  },
  tabStyle: {
    backgroundColor: Colors.tabBar,
  },
  privacyViewStyle: {
    padding: 5,
  },
  lockStyle: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
});
