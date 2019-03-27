import { StyleSheet } from 'react-native';
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    marginBottom: 4,
  },
  numberButton: {
    width: 66,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 50,
  },
  lastColumn: {
    marginRight: 0,
  },
  numberButtonText: {
    ...Fonts.style.regular,
    fontSize: 40,
    lineHeight: 40,
    textAlign: 'justify',
  },
  title: {
    fontFamily: Fonts.type.regular,
    fontSize: 18,
    color: Colors.white,
    alignSelf: 'center',
    marginTop: 50,
  },
  indicatorContainer: {
    marginTop: 40,
  },
  numbersContainer: {
    flexDirection: 'column',
  },
  cancel: {
    ...Fonts.style.medium,
    fontSize: 16,
  },
  deleteIcon: {
    ...Metrics.icons.delete,
    alignSelf: 'center',
  },
  errorText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    color: Colors.errors,
    textAlign: 'center',
    marginTop: 30,
  },
});
