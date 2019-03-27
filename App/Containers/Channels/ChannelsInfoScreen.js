import React, { Component } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';

import Button from '../../Components/Button';
import ChannelsInfoRow from '../../Components/ChannelsInfoRow';
import Types from '../../Config/Types';
import { satoshiToBtcFraction } from '../../Transforms/currencies';

import ChannelsActions from '../../Redux/ChannelsRedux';
import Clipboard from '../../Services/Clipboard';

// Styles
import styles from './Styles/ChannelsInfoScreenStyle';
import { Images } from '../../Themes';

class ChannelsInfoScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Channel info',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(Types.CHANNEL_PROPS.isRequired).isRequired,
    closeChannel: PropTypes.func.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
  };

  constructor(props) {
    super(props);

    const item = this.props.navigation.state.params;
    this.state = {
      item,
      localBalance: item.local_balance,
      remoteBalance: item.remote_balance,
    };
  }

  handleClose = () => {
    const {
      item: { channel_point: channelPoint, name },
    } = this.state;
    const [txid, index] = channelPoint.split(':');
    this.props.closeChannel(name, txid, index);
  };

  renderType = () => {
    let textStyles = null;
    let label = 'Channel not active';
    let icon;
    if (this.state.item.active) {
      textStyles = styles.textValueGreen;
      label = 'Active';
      icon = <Image source={Images.checkMarkGreenIcon} style={styles.image} />;
    }
    return (
      <ChannelsInfoRow
        containerStyle={styles.rowContainerInline}
        label={icon}
        value={label}
        valueStyle={textStyles}
      />
    );
  };

  render() {
    const { item, localBalance, remoteBalance } = this.state;
    const { btcFraction } = this.props;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.container}>
          {this.renderType()}
          <ChannelsInfoRow label="Created" value={moment(item.created).format('DD.MM.YYYY')} />
          <ChannelsInfoRow
            label="My balance"
            value={`${satoshiToBtcFraction(localBalance, btcFraction)} ${btcFraction}`}
          />
          <ChannelsInfoRow
            label="Available to receive"
            value={`${satoshiToBtcFraction(remoteBalance, btcFraction)} ${btcFraction}`}
          />
          <ChannelsInfoRow label="Channel’s name" value={item.name} />
          {item.contact && <ChannelsInfoRow label="Recipient" value={item.contact.name} />}
          <TouchableOpacity onPress={() => Clipboard.set('Recipient ID', item.remote_pubkey)}>
            <ChannelsInfoRow
              label="Recipient ID"
              value={item.remote_pubkey}
              valueStyle={styles.textRecipient}
              containerStyle={styles.rowContainerLast}
            />
          </TouchableOpacity>
          <Button title="CLOSE CHANNEL" onPress={this.handleClose} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
});

const mapDispatchToProps = dispatch => ({
  closeChannel: (name, txid, index) =>
    dispatch(ChannelsActions.channelsDeleteRequest(name, txid, index)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelsInfoScreen);
