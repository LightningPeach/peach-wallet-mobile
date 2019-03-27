import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts } from '../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    ...ApplicationStyles.screen.container,
    alignItems: 'center',
  },
  icon: {
    marginTop: 110,
  },
  textSuccess: {
    ...Fonts.style.bold,
    fontSize: 20,
    color: Colors.lightGreen,
    marginTop: 30,
  },
  textError: {
    ...Fonts.style.bold,
    fontSize: 20,
    color: Colors.errors,
    marginTop: 30,
  },
  text: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.regular,
    marginTop: 10,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 50,
    marginLeft: 32,
    marginRight: 32,
  },
});
