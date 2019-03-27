import { StyleSheet } from 'react-native';
import { Colors } from '../../Themes';

const indicator = {
  width: 20,
  height: 20,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: Colors.orange,
  marginLeft: 10,
  marginRight: 10,
};

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    ...indicator,
  },
  activeIndicator: {
    ...indicator,
    backgroundColor: Colors.orange,
  },
});
