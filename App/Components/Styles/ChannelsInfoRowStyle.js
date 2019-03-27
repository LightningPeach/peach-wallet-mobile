import { StyleSheet, Platform } from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes';

export default StyleSheet.create({
  rowContainer: {
    ...Platform.select({
      ios: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Metrics.baseMargin,
        marginLeft: Metrics.tripleBaseMargin,
        paddingRight: Metrics.doubleBaseMargin,
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkGray,
      },
      android: {
        paddingVertical: Metrics.baseMargin,
        marginVertical: Metrics.smallMargin,
        marginLeft: Metrics.oneAndHalfBaseMargin,
        marginRight: Metrics.tripleBaseMargin,
      },
    }),
  },
  textLabel: {
    ...Platform.select({
      ios: {
        marginVertical: Metrics.smallMargin,
        ...Fonts.style.bold,
      },
      android: {
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.regular,
        color: Colors.darkGray,
      },
    }),
  },
  textValue: {
    ...Platform.select({
      ios: {
        marginVertical: Metrics.smallMargin,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.regular,
        color: Colors.darkGray,
      },
      android: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.regular,
        color: Colors.white,
      },
    }),
  },
});
