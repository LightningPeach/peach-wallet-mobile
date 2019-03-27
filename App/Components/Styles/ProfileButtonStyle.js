import { StyleSheet, Platform } from 'react-native';
import { Fonts, Metrics, Colors } from '../../Themes/';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    ...Platform.select({ android: { display: 'none' } }),
    ...Metrics.icons.profileAddressAction,
  },
  text: {
    ...Platform.select({
      ios: {
        ...Fonts.style.base,
        textAlign: 'center',
      },
      android: {
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.medium,
        color: Colors.orange,
        margin: Metrics.baseMargin,
      },
    }),
  },
});
