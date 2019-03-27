import { StyleSheet } from 'react-native';
import { isIOS, ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  icon: {
    ...Metrics.icons.channelsError,
    marginBottom: Metrics.smallMargin,
    alignSelf: 'center',
  },
  title: {
    fontSize: Fonts.size.h3,
    fontFamily: Fonts.type.bold,
    color: isIOS ? Colors.errors : Colors.white,
    marginVertical: Metrics.baseMargin,
    textAlign: 'center',
  },
  text: {
    fontSize: Fonts.size.regular,
    fontFamily: Fonts.type.regular,
    color: isIOS ? Colors.errors : Colors.white,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginVertical: Metrics.doubleSection - Metrics.smallMargin,
    marginHorizontal: Metrics.tripleBaseMargin,
  },
  button: {
    marginVertical: Metrics.smallMargin,
  },
});
