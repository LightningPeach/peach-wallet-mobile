import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Keyboard, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import UiActions from '../../Redux/UiRedux';

import Text from '../../Components/Text';
import AmountInput from '../../Components/AmountInput';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import { Colors } from '../../Themes';

import ChannelsActions, { ChannelsSelectors } from '../../Redux/ChannelsRedux';
import {
  validateChannelName,
  validateChannelSize,
  validatePeerAddress,
} from '../../Services/Check';
import { convertToSatochiByType } from '../../Transforms/currencies';

// Styles
import styles from './Styles/ChannelsNewScreenStyle';
import Types from '../../Config/Types';
import AppConfig from '../../Config/AppConfig';

class ChannelsNewScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Create channel',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    error: PropTypes.string,
    request: PropTypes.bool,
    navigation: PropTypes.object.isRequired,
    createChannel: PropTypes.func.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    bitcoinBalance: Types.FLOAT_NUMBER_PROPS,
    showLoading: PropTypes.func.isRequired,
    isPendingChannelsNotEmpty: PropTypes.bool,
  };

  static defaultProps = {
    error: null,
    request: false,
    bitcoinBalance: '0',
    isPendingChannelsNotEmpty: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      amount: '',
      peerAddress: '',
      custom: false,
      canShowNameError: false,
      canShowAmountError: false,
      canShowPeerAddressError: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { error, request, showLoading } = this.props;
    if (prevProps.request && !request) {
      showLoading(false);
      if (error) {
        this.props.navigation.navigate('ChannelsError', { error });
      } else {
        this.props.navigation.navigate('Channels');
      }
    }
  }

  handleCreateChannels = () => {
    Keyboard.dismiss();
    const {
      name, amount, custom, peerAddress,
    } = this.state;
    const {
      btcFraction, bitcoinBalance, showLoading, createChannel,
    } = this.props;

    const nameError = validateChannelName(name);
    const amountError = validateChannelSize(amount, btcFraction, bitcoinBalance, 'Amount');
    const peerAddressError = custom && validatePeerAddress(peerAddress);
    if (nameError || amountError || peerAddressError) {
      this.setState({
        canShowNameError: true,
        canShowAmountError: true,
        canShowPeerAddressError: true,
      });
      return;
    }

    showLoading(true);
    createChannel(
      name,
      convertToSatochiByType(amount, this.props.btcFraction),
      custom,
      peerAddress,
    );
  };

  renderInfoText = () => (
    <Text style={styles.infoText}>
      By default, new channels are opened with the{' '}
      <Text
        style={styles.linkText}
        onPress={async () => {
          try {
            await Linking.openURL(AppConfig.peachPublicNode1mlUrl);
          } catch (e) {
            console.log("can't open url", e);
          }
        }}
      >
        Lightning Peach public node
      </Text>
      . You can open a custom channel by manually specifying a peer address.
    </Text>
  );

  render() {
    const { btcFraction, bitcoinBalance, isPendingChannelsNotEmpty } = this.props;

    const {
      amount,
      custom,
      peerAddress,
      canShowNameError,
      name,
      canShowAmountError,
      canShowPeerAddressError,
    } = this.state;
    const nameError = validateChannelName(name);
    const amountError = validateChannelSize(amount, btcFraction, bitcoinBalance, 'Amount');
    const peerAddressError = custom && validatePeerAddress(peerAddress);
    const showNameError = canShowNameError && nameError;
    const showChannelError = canShowAmountError && amountError;
    const showPeerAddressError = canShowPeerAddressError && peerAddressError;
    const disabled =
      !!showNameError || !!showChannelError || !!showPeerAddressError || isPendingChannelsNotEmpty;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <TextInput
              onChangeText={value => this.setState({ name: value })}
              onSubmitEditing={() => this.amountInput.focus()}
              value={name}
              placeholder="Channel name (Optional)"
              autoCorrect={false}
              returnKeyType="next"
              onBlur={() => this.setState({ canShowNameError: true })}
            />
            {showNameError && <Text style={styles.errorText}>{nameError}</Text>}
            <AmountInput
              link={(ref) => {
                this.amountInput = ref;
              }}
              onChangeText={value => this.setState({ amount: value })}
              onBlur={() => this.setState({ canShowAmountError: true })}
              onSubmitEditing={() => {
                if (custom) {
                  this.peerAddressInput.focus();
                }
              }}
              blurOnSubmit
              returnKeyType={custom ? 'next' : 'done'}
              btcFraction={this.props.btcFraction}
            />
            {showChannelError && <Text style={styles.errorText}>{amountError}</Text>}
            {custom && (
              <TextInput
                link={(ref) => {
                  this.peerAddressInput = ref;
                }}
                onChangeText={thePeerAddress => this.setState({ peerAddress: thePeerAddress })}
                onBlur={() => this.setState({ canShowPeerAddressError: true })}
                value={this.state.peerAddress}
                placeholder="Peer Address"
                autoCorrect={false}
                blurOnSubmit
                returnKeyType="done"
              />
            )}
            {custom && showPeerAddressError && (
              <Text style={styles.errorText}>{peerAddressError}</Text>
            )}
          </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Open custom channel</Text>
            <Switch
              onValueChange={() => this.setState({ custom: !custom })}
              trackColor={Colors.orange}
              _thumbColor={Colors.white}
              value={custom}
            />
          </View>
          <View style={styles.section}>
            <Button
              style={styles.button}
              disabled={disabled}
              title={isPendingChannelsNotEmpty ? 'CHANNEL CREATING...' : 'CREATE CHANNEL'}
              onPress={this.handleCreateChannels}
              inline={false}
            />
            {this.renderInfoText()}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  error: state.channels.createChannelError,
  request: state.channels.createChannelRequest,
  btcFraction: state.ui.btcFraction,
  bitcoinBalance: state.onchain.balance,
  isPendingChannelsNotEmpty: ChannelsSelectors.isPendingChannelsNotEmpty(state),
});

const mapDispatchToProps = dispatch => ({
  createChannel: (name, amount, isCustom, lightningHost) =>
    dispatch(ChannelsActions.channelsCreateRequest(name, amount, isCustom, lightningHost)),
  showLoading: show => dispatch(UiActions.showLoading(show)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelsNewScreen);
