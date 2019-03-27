import { StyleSheet } from 'react-native';
import { isIOS, ApplicationStyles, Fonts, Colors, Metrics } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  screenContainer: {
    ...ApplicationStyles.screen.screenContainer,
    borderTopWidth: 0,
  },
  searchContainer: {
    backgroundColor: isIOS ? Colors.background : Colors.black,
    paddingTop: isIOS ? Metrics.baseMargin : 0,
    paddingBottom: isIOS ? Metrics.oneAndHalfBaseMargin : Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  search: {
    marginVertical: 0,
    marginHorizontal: Metrics.marginHorizontal,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.darkGray,
    margin: isIOS ? Metrics.doubleBaseMargin : Metrics.oneAndHalfBaseMargin,
    marginRight: isIOS ? 0 : Metrics.oneAndHalfBaseMargin,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Fonts.style.base,
    color: Colors.darkGray,
    paddingTop: Metrics.doubleBaseMargin,
  },
  emptyChannels: {
    ...Metrics.icons.channelsEmptyPlaceholder,
  },
  listContainer: {
    marginTop: Metrics.doubleBaseMargin,
  },
});
