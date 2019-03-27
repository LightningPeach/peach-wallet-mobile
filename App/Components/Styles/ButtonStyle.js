import { StyleSheet, Platform } from 'react-native';
import { isIOS, Metrics, Colors, Fonts } from '../../Themes';

const containerStyle = {
  minHeight: 40,
  paddingLeft: Metrics.marginHorizontal,
  paddingRight: Metrics.marginHorizontal,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
};

export default StyleSheet.create({
  container: {
    ...containerStyle,
    borderRadius: Metrics.buttonRadius,
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: Colors.orange,
      },
      android: {
        backgroundColor: Colors.orange,
      },
    }),
  },
  containerInline: {
    ...containerStyle,
  },
  disabled: {
    ...Platform.select({
      ios: {
        borderColor: Colors.orangeDisabled,
      },
      android: {
        backgroundColor: Colors.orangeDisabled,
      },
    }),
  },
  titleText: {
    ...Fonts.style.medium,
    fontSize: isIOS ? Fonts.size.regular : Fonts.size.medium,
    color: isIOS ? Colors.orange : Colors.white,
    paddingVertical: Metrics.baseMargin,
  },
  titleTextInline: {
    ...Fonts.style.medium,
    fontSize: isIOS ? Fonts.size.regular : Fonts.size.medium,
    color: Colors.orange,
    paddingVertical: Metrics.baseMargin,
  },
  disabledText: {
    color: isIOS ? Colors.orangeDisabled : Colors.whiteDisabled,
  },
  disabledTextInline: {
    color: Colors.orangeDisabled,
  },
  image: {
    ...Metrics.icons.add,
    tintColor: Colors.orange,
    marginRight: Metrics.baseMargin,
  },
});
