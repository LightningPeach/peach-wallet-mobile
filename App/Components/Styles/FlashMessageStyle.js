import { StyleSheet, Platform } from 'react-native';
import { isIOS, Metrics, Fonts } from '../../Themes';

export default StyleSheet.create({
  flashMessage: {
    marginHorizontal: isIOS ? Metrics.doubleSection : 0,
    paddingHorizontal: isIOS ? 0 : Metrics.section,
    borderRadius: isIOS ? Metrics.buttonRadius : 0,
  },
  titleStyle: {
    ...Platform.select({
      ios: {
        textAlign: 'center',
        ...Fonts.style.medium,
        fontSize: Fonts.size.regular,
      },
      android: {
        ...Fonts.style.regular,
      },
    }),
  },
});
