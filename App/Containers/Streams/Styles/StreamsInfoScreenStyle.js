import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  closeIcon: {
    marginLeft: Metrics.oneAndHalfBaseMargin,
  },
  contentContainer: {
    ...ApplicationStyles.screen.centerContainer,
    marginHorizontal: Metrics.baseMargin,
  },
  timeText: {
    fontSize: Fonts.size.streamTime,
    fontFamily: Fonts.type.bold,
    color: Colors.lightGreen,
    marginBottom: Metrics.baseMargin,
    textAlign: 'center',
  },
  statusText: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    color: Colors.lightGreen,
    textAlign: 'center',
    marginBottom: Metrics.doubleSection,
  },
  button: {
    marginVertical: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
  },
  redButton: {
    borderColor: Colors.errors,
  },
  redButtonText: {
    color: Colors.errors,
  },
});
