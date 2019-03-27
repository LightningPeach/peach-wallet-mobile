import { StyleSheet, Platform } from 'react-native';
import { isIOS, Metrics, Colors, Fonts } from '../../Themes/';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: Metrics.doubleBaseMargin,
    ...Platform.select({
      ios: {
        flexDirection: 'row',
      },
    }),
  },
  image: {
    ...Metrics.icons.profileAddressType,
    marginRight: Metrics.oneAndHalfBaseMargin,
    alignSelf: isIOS ? 'center' : 'flex-start',
    marginTop: isIOS ? 0 : Metrics.smallMargin,
  },
  textContainer: {
    flex: isIOS ? 0.55 : 1,
    marginRight: isIOS ? Metrics.profile.addressRightMargin : Metrics.baseMargin,
    flexDirection: 'row',
  },
  text: {
    color: Colors.white,
    fontSize: isIOS ? Fonts.size.medium : Fonts.size.regular,
    fontFamily: Fonts.type.regular,
  },
  actionsContainer: {
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        justifyContent: 'space-between',
        flex: 0.45,
      },
      android: {
        marginLeft: Metrics.doubleBaseMargin,
      },
    }),
  },
  actionsContainerSingle: {
    ...Platform.select({
      ios: {
        justifyContent: 'flex-end',
      },
    }),
  },
});
