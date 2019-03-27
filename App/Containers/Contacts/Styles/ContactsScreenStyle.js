import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts, isIOS } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    ...ApplicationStyles.screen.container,
    paddingTop: isIOS ? 0 : Metrics.baseMargin,
  },
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
  placeholderContainer: {
    flex: 1,
  },
  placeholderSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    ...Metrics.icons.contactsPlaceholder,
    marginBottom: Metrics.baseMargin,
  },
  placeholderText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    color: Colors.darkGray,
  },
  listFooterSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.darkGray,
    marginLeft: Metrics.section,
    paddingVertical: Metrics.doubleBaseMargin,
  },
  listFooterText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.medium,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  titleSection: {
    backgroundColor: Colors.tabBar,
    padding: Metrics.baseMargin,
  },
  titleText: {
    fontFamily: Fonts.type.semibold,
    fontSize: Fonts.size.regular,
    color: Colors.orange,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.darkGray,
    marginLeft: Metrics.section,
  },
  lockIcon: {
    ...Metrics.icons.lock,
    tintColor: Colors.orange,
    marginLeft: Metrics.baseMargin,
  },
  standardIcon: {
    ...Metrics.icons.contactsPlaceholder,
    marginTop: 58,
    alignSelf: 'center',
  },
  standardText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    color: Colors.darkGray,
    marginTop: 20,
    alignSelf: 'center',
  },
  standardButton: {
    marginTop: 30,
    marginLeft: 32,
    marginRight: 32,
  },
});
