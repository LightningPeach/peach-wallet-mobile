import { StyleSheet } from 'react-native';
import { isIOS, Metrics, Colors, Fonts } from '../../Themes';

export default StyleSheet.create({
  container: {
    marginHorizontal: Metrics.baseMargin,
  },
  headerActive: {
    marginTop: isIOS ? Metrics.section : 0,
  },
  textInput: {
    fontFamily: isIOS ? Fonts.type.base : Fonts.type.regular,
    fontSize: isIOS ? Fonts.size.regular : Fonts.size.medium,
    color: Colors.white,
    backgroundColor: Colors.darkGray,
  },
  textCancel: {
    fontFamily: isIOS ? Fonts.type.base : Fonts.type.regular,
    fontSize: isIOS ? Fonts.size.regular : Fonts.size.medium,
  },
});
