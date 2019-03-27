import { StyleSheet } from 'react-native';
import { isIOS, Metrics, Fonts, Colors } from '../../Themes/';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Metrics.mainScreenWidgetWidth,
  },
  mainSection: {
    width: Metrics.widget,
    height: Metrics.widget,
    borderColor: Colors.orange,
    borderWidth: 1,
    borderRadius: Metrics.widgetRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    fontFamily: isIOS ? Fonts.type.regular : Fonts.type.bold,
    marginTop: Metrics.smallMargin,
    textAlign: 'center',
  },
});
