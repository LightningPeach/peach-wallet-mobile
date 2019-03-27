import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors, isIOS } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  connectButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  scrollView: {
    marginBottom: Metrics.baseMargin,
  },
  scrollViewContent: {
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
  },
  bottomContainer: {
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
    marginBottom: Metrics.baseMargin,
  },
  scrollContent: {
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
  },
  subButtonText: {
    ...Fonts.style.base,
    marginHorizontal: Metrics.section,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  scanQrText: {
    ...Fonts.style.medium,
    fontSize: Fonts.size.medium,
    color: Colors.orange,
    textAlign: 'center',
  },
  guideText: {
    ...Fonts.style.medium,
    fontSize: Fonts.size.medium,
    color: Colors.orange,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: Metrics.section,
  },
  textInput: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    marginVertical: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  multilineTextInput: {
    maxHeight: 80,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxText: {
    ...Fonts.style.regular,
    color: Colors.white,
    fontSize: Fonts.size.small,
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  lndGuideText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.medium,
    color: Colors.orange,
    paddingVertical: Metrics.baseMargin,
    textAlign: 'center',
  },
  qrDescription: {
    ...Fonts.style.secondaryDescription,
    textAlign: 'center',
    marginTop: 23,
    marginBottom: 30,
  },
});
