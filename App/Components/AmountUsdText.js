import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import Text from './Text';
import AppConfig from '../Config/AppConfig';
import { Fonts, Colors } from '../Themes';

const openRestartInstruction = async () => {
  try {
    await Linking.openURL(AppConfig.btcUsdRateUrl);
  } catch (e) {
    console.log("can't open url", e);
  }
};

const styles = StyleSheet.create({
  text: {
    ...Fonts.style.regular,
    fontSize: Fonts.size.input,
    color: Colors.orange,
    marginVertical: 0,
  },
});

const AmountUsdText = props => (
  <Text {...props} style={styles.text} onPress={openRestartInstruction} />
);

export default AmountUsdText;
