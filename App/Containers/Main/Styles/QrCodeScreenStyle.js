import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors } from '../../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  camera: {
    height: Metrics.fullSize,
    width: Metrics.fullSize,
  },
  bottomContent: {
    ...Metrics.qr,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Metrics.doubleSection,
    backgroundColor: Colors.orange,
    borderRadius: Metrics.qrRadius,
  },
});
