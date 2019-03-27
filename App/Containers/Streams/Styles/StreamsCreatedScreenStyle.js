import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Fonts } from '../../../Themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    ...ApplicationStyles.screen.centerContainer,
    marginHorizontal: Metrics.tripleBaseMargin,
  },
  image: {
    ...Metrics.icons.streamCreated,
    marginBottom: Metrics.baseMargin,
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    marginBottom: Metrics.doubleSection,
  },
  button: {
    margin: 0,
    marginBottom: Metrics.oneAndHalfBaseMargin,
  },
});
