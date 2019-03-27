import { StyleSheet, Platform } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  rowContainerInline: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
    ...Platform.select({
      ios: {
        paddingVertical: Metrics.baseMargin,
        marginLeft: Metrics.tripleBaseMargin,
        paddingRight: Metrics.doubleBaseMargin,
      },
      android: {
        paddingVertical: Metrics.doubleBaseMargin,
        marginVertical: Metrics.smallMargin,
        marginLeft: Metrics.oneAndHalfBaseMargin,
        marginRight: Metrics.tripleBaseMargin,
      },
    }),
  },
  rowContainerLast: {
    borderBottomWidth: 0,
    marginBottom: Metrics.section,
  },
  image: {
    ...Metrics.icons.paymentHistoryIcon.success,
    marginRight: Metrics.oneAndHalfBaseMargin,
  },
  textValueGreen: {
    color: Colors.lightGreen,
  },
  textRecipient: {
    ...Platform.select({
      ios: {
        ...Fonts.style.base,
        color: Colors.darkGray,
      },
    }),
  },
});
