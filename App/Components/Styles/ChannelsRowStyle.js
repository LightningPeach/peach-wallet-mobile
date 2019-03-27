import { StyleSheet } from 'react-native';
import { isIOS, Metrics, Fonts, Colors } from '../../Themes';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.oneAndHalfBaseMargin,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: Metrics.oneAndHalfBaseMargin,
    alignItems: 'baseline',
  },
  nameText: {
    ...Fonts.style.regular,
    marginRight: Metrics.baseMargin,
  },
  leftBraceText: {
    ...Fonts.style.regular,
  },
  rightBraceText: {
    ...Fonts.style.regular,
    marginRight: 'auto',
  },
  peerText: {
    flexShrink: 1,
    ...Fonts.style.regular,
  },
  statusText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.small,
    textAlign: 'right',
    marginLeft: Metrics.baseMargin,
  },
  statusPending: {
    color: Colors.orange,
  },
  statusGray: {
    color: Colors.darkGray,
  },
  progressContainer: {
    height: Metrics.channels.progressHeight,
    backgroundColor: isIOS ? Colors.white : Colors.darkGray,
    borderRadius: Metrics.channelsRadius,
  },
  progressValue: {
    borderRadius: Metrics.channelsRadius,
    flex: 1,
    backgroundColor: Colors.lightGreen,
  },
  progressValueOrange: {
    backgroundColor: Colors.orange,
  },
  progressValueGray: {
    backgroundColor: Colors.darkGray,
  },
});
