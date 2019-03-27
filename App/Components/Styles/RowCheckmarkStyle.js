import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  row: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Metrics.oneAndHalfBaseMargin,
  },
  text: {
    ...Fonts.style.normal,
  },
  active: {
    color: Colors.orange,
  },
  lockIcon: {
    ...Metrics.icons.smallLock,
    tintColor: Colors.orange,
    marginLeft: 5,
  },
  description: {
    ...Fonts.style.secondaryDescription,
  },
  profileText: {
    ...Fonts.style.secondaryDescription,
    color: Colors.orange,
  },
  lockedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
    flexDirection: 'column',
    paddingBottom: 20,
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  checkMark: {
    marginLeft: Metrics.baseMargin,
  },
});
