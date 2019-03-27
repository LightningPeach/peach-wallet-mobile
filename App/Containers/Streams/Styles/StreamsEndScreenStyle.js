import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    ...ApplicationStyles.screen.centerContainer,
    marginHorizontal: Metrics.doubleBaseMargin,
  },
  image: {
    alignSelf: 'center',
    ...Metrics.icons.success,
    marginBottom: Metrics.oneAndHalfBaseMargin,
  },
  title: {
    textAlign: 'center',
    color: Colors.lightGreen,
    fontSize: Fonts.size.h3,
    fontFamily: Fonts.type.bold,
    marginBottom: Metrics.baseMargin,
  },
  titleError: {
    textAlign: 'center',
    color: Colors.errors,
    fontSize: Fonts.size.h3,
    fontFamily: Fonts.type.bold,
    marginBottom: Metrics.baseMargin,
  },
  description: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.regular,
    marginBottom: Metrics.baseMargin,
    textAlign: 'center',
  },
  processingText: {
    ...Fonts.style.normal,
    fontSize: Fonts.size.h3,
    marginBottom: Metrics.baseMargin,
    color: Colors.orange,
    textAlign: 'center',
  },
  descriptionLast: {
    marginBottom: Metrics.doubleSection,
  },
  button: {
    marginVertical: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
  },
});
