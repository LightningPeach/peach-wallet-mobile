import { StyleSheet } from 'react-native';
import { Colors, Metrics } from '../../Themes';

export default StyleSheet.create({
  lock: {
    ...Metrics.icons.lock,
    tintColor: Colors.orange,
  },
});
