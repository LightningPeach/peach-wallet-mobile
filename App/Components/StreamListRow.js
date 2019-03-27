import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { getStatusColor, getStatusText } from '../Services/Streams';
import { satoshiToBtcFraction } from '../Transforms/currencies';
import Types from '../Config/Types';
import { Metrics } from '../Themes';
import styles from './Styles/StreamListRowStyle';
import Text from '../Components/Text';
import AppConfig from '../Config/AppConfig';
import { isReallyEmpty } from '../Services/Utils';

export default class StreamListRow extends React.PureComponent {
  static propTypes = {
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
      .isRequired,
    secPaid: PropTypes.number.isRequired,
    totalTime: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  };

  render() {
    const {
      secPaid, price, totalTime, status, created, onPress, btcFraction,
    } = this.props;
    const seconds = secPaid || 0;
    const thePrice = satoshiToBtcFraction(price * seconds, btcFraction);
    let totalPrice = price * totalTime;
    totalPrice = satoshiToBtcFraction(totalPrice, btcFraction);
    const name = isReallyEmpty(this.props.name) ? AppConfig.outgoingStreamName : this.props.name;

    return (
      <TouchableOpacity activeOpacity={Metrics.activeOpacity} style={styles.row} onPress={onPress}>
        <View style={styles.textRow}>
          <Text style={styles.textInfo}>{name}</Text>
          <Text style={[styles.textInfo, getStatusColor(status)]}>{getStatusText(status)}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textDate}>
            {thePrice} {btcFraction} / {seconds} seconds
          </Text>
          <Text style={styles.textDate}>
            Total payment {totalPrice} {btcFraction}
          </Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textDate}>{moment(created).format('DD.MM.YYYY')}</Text>
          <Text style={styles.textDate}>{moment(created).format('HH:mm')}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
