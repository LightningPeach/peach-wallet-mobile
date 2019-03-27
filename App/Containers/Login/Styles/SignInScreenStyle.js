import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  signUpText: {
    ...Fonts.style.description,
    color: Colors.orange,
    textAlign: 'center',
    marginHorizontal: Metrics.section,
  },
  infoText: {
    ...Fonts.style.base,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: Metrics.section,
    marginHorizontal: Metrics.section,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: Metrics.section,
    marginTop: 8,
  },
  checkboxText: {
    ...Fonts.style.regular,
    color: Colors.white,
    fontSize: Fonts.size.small,
    marginLeft: Metrics.marginHorizontal,
  },
});
