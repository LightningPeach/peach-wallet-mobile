import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

import Text from '../Components/Text';
import {
  getIconByStatus,
  getIconStyleByStatus,
  getTextColorByStatus,
  getTextInfoByStatus,
} from '../Services/Payment';
import { satoshiToBtcFraction } from '../Transforms/currencies';

import Types from '../Config/Types';
import { Metrics } from '../Themes';
import styles from './Styles/PaymentHistoryRowStyle';

export default class PaymentHistoryRow extends PureComponent {
  // Prop type warnings
  static propTypes = {
    item: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
  };

  getTime = (time, status) => {
    if (status === Types.PENDING) {
      return getTextInfoByStatus(status);
    }
    return moment.unix(time).format('HH:mm');
  };

  getAmountColor = (status, amount) => {
    let tempStatus;
    if (status === Types.PENDING) {
      tempStatus = Types.PENDING;
    } else if (amount < 0) {
      tempStatus = Types.ERROR;
    } else {
      tempStatus = Types.SUCCESS;
    }
    return getTextColorByStatus(tempStatus);
  };

  render() {
    const {
      item,
      item: { id },
      navigation,
      btcFraction,
    } = this.props;

    const description = item.name || `Payment id: ${id ? id.substr(0, 10) : 0}...`;
    const amount = satoshiToBtcFraction(item.amount || item.value || 0, btcFraction);

    return (
      <TouchableOpacity
        activeOpacity={Metrics.activeOpacity}
        style={styles.container}
        onPress={() => navigation.navigate('PaymentInfo', { ...item })}
      >
        <Image
          source={getIconByStatus(item.status)}
          style={[styles.icon, getIconStyleByStatus(item.status)]}
        />
        <Text style={styles.descriptionText}>{description}</Text>
        <View>
          <Text style={[styles.btcText, this.getAmountColor(item.status, item.amount)]}>
            {`${amount} ${btcFraction}`}
          </Text>
          <Text style={styles.timeText}>{this.getTime(item.date, item.status)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
