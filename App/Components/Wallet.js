import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, ViewPropTypes } from 'react-native';
import { isNil } from 'ramda';

import Text from '../Components/Text';
import { Metrics } from '../Themes';
import styles from './Styles/WalletStyle';
import Types from '../Config/Types';
import { satoshiToBtcFraction, satoshiToUsd } from '../Transforms/currencies';

export default class Wallet extends Component {
  // Prop type warnings
  static propTypes = {
    style: ViewPropTypes.style,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    balanceSatoshi: Types.FLOAT_NUMBER_PROPS.isRequired,
    usdPerBtc: Types.FLOAT_NUMBER_PROPS.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    unconfirmedBalanceSatoshi: Types.FLOAT_NUMBER_PROPS,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    style: {},
    id: '',
    unconfirmedBalanceSatoshi: null,
    onPress: undefined,
  };

  render() {
    const {
      name,
      icon,
      id,
      balanceSatoshi,
      usdPerBtc,
      btcFraction,
      unconfirmedBalanceSatoshi,
      onPress,
      style,
    } = this.props;

    const showUnconfirmedBalance =
      !isNil(unconfirmedBalanceSatoshi) && unconfirmedBalanceSatoshi > 0;

    return (
      <TouchableOpacity
        activeOpacity={Metrics.activeOpacity}
        style={[styles.container, style]}
        onPress={onPress}
      >
        <View style={styles.mainSection}>
          <View style={styles.titleSection}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.titleText}>{name}</Text>
          </View>
          <Text style={styles.tokenText}>{id}</Text>
        </View>
        <View style={styles.balanceSection}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceText}>Balance:</Text>
            <View style={styles.balanceMainText}>
              <Text style={styles.balanceText}>
                {`${satoshiToBtcFraction(
                  balanceSatoshi,
                  btcFraction,
                )} ${btcFraction} ~ $${satoshiToUsd(balanceSatoshi, usdPerBtc)}`}
              </Text>
            </View>
          </View>
          {showUnconfirmedBalance && (
            <View style={styles.balanceSecondRow}>
              <Text style={styles.unconfirmedBalanceText}>Unconfirmed:</Text>
              <View style={styles.balanceMainText}>
                <Text style={styles.unconfirmedBalanceText}>
                  {`${satoshiToBtcFraction(
                    unconfirmedBalanceSatoshi,
                    btcFraction,
                  )} ${btcFraction} ~ $${satoshiToUsd(unconfirmedBalanceSatoshi, usdPerBtc)}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
