import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  section: {
    margin: Metrics.section,
  },
  textInput: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    marginVertical: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  createButton: {
    marginTop: Metrics.section,
  },
});
