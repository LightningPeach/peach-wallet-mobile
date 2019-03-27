import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    ...ApplicationStyles.screen.container,
    paddingHorizontal: Metrics.tripleBaseMargin,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin,
  },
  selectize: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.input,
  },
  textPlaceholder: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.input,
    color: Colors.darkGray,
  },
  balanceText: {
    fontSize: Fonts.size.medium,
    marginRight: Metrics.oneAndHalfBaseMargin,
  },
  button: {
    margin: Metrics.tripleBaseMargin,
  },
  textInput: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    paddingVertical: 0,
    marginVertical: 0,
    flex: 1,
  },
  addContact: {
    paddingLeft: Metrics.doubleBaseMargin,
  },
  addContactImage: {
    ...Metrics.icons.small,
  },
});
