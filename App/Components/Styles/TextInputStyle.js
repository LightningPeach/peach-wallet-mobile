import { StyleSheet } from 'react-native';
import { Metrics, Fonts, Colors } from '../../Themes/';

export default StyleSheet.create({
  textInput: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    marginVertical: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
});
