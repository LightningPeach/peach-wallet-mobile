import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import Types from '../Config/Types';
import { Metrics } from '../Themes';
import styles from './Styles/ChannelsRowStyle';
import Text from '../Components/Text';
import { satoshiToBtcFraction } from '../Transforms/currencies';

export default class ChannelsRow extends Component {
  static propTypes = {
    item: Types.CHANNEL_PROPS.isRequired,
    navigation: PropTypes.object.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
  };

  getRightText = () => {
    const { item, btcFraction } = this.props;
    const style = [styles.statusText];
    let text;
    if (item.type === Types.CHANNEL_CONNECTING) {
      text = 'Connecting to peer';
      style.push(styles.statusPending);
    } else if (item.type === Types.CHANNEL_PENDING) {
      text = 'Channel opening';
      style.push(styles.statusPending);
    } else if (!item.active) {
      text = 'Not active';
      style.push(styles.statusGray);
    } else {
      text = `${satoshiToBtcFraction(item.capacity, btcFraction)} ${btcFraction}`;
    }
    return <Text style={style}>{text}</Text>;
  };

  handlePress = () => {
    const { item, navigation } = this.props;
    if (item.type !== Types.CHANNEL_PENDING && item.type !== Types.CHANNEL_CONNECTING) {
      navigation.navigate('ChannelsInfo', { ...item });
    }
  };

  renderProgress = () => {
    const { item } = this.props;
    const style = [styles.progressValue];
    if (item.type === Types.CHANNEL_PENDING) {
      style.push(styles.progressValueOrange);
    } else if (!item.active) {
      style.push(styles.progressValueGray);
    } else {
      const width = (item.local_balance * 100) / (item.remote_balance + item.local_balance);
      console.log('Channel progress', width, item);
      style.push({ width: `${width}%` });
    }
    return (
      <View style={styles.progressContainer}>
        <View style={style} />
      </View>
    );
  };

  render() {
    const { item } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={Metrics.activeOpacity}
        style={styles.container}
        onPress={this.handlePress}
      >
        <View style={styles.header}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.leftBraceText}>(</Text>
          <Text style={styles.peerText} numberOfLines={1}>
            {item.contact ? item.contact.name : item.remote_pubkey}
          </Text>
          <Text style={styles.rightBraceText}>)</Text>
          {this.getRightText()}
        </View>
        {this.renderProgress()}
      </TouchableOpacity>
    );
  }
}
