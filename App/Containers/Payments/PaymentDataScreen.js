import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isNil } from 'ramda';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import UiActions from '../../Redux/UiRedux';
import Clipboard from '../../Services/Clipboard';

import Text from '../../Components/Text';

import NavigationActions from '../../Redux/NavigationRedux';

import OnchainActions from '../../Redux/OnchainRedux';
import LightningActions, { LightningSelectors } from '../../Redux/LightningRedux';
import StreamsActions from '../../Redux/StreamsRedux';

import { capitalizeFirstLetter } from '../../Transforms/capitalizeFirstLetter';
import { satoshiToBtcFraction, satoshiToUsd } from '../../Transforms/currencies';

import Types from '../../Config/Types';
import Button from '../../Components/Button';

// Styles
import styles from './Styles/PaymentDataScreenStyle';
import { getTypeDisplayName } from '../../Services/Payment';

class PaymentDataScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Check your data',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    errorSendCoins: PropTypes.string,
    errorSendLightningPayment: PropTypes.string,
    onchainPayment: Types.PAYMENT_PROPS,
    lightningPayment: Types.PAYMENT_PROPS,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    navigation: Types.NAVIGATION_PROPS().isRequired,
    usdPerBtc: Types.FLOAT_NUMBER_PROPS.isRequired,
    sendCoins: PropTypes.func.isRequired,
    sendLightningPayment: PropTypes.func.isRequired,
    addStream: PropTypes.func.isRequired,
    streamId: PropTypes.string,
    fee: Types.FLOAT_NUMBER_PROPS,
    errorFee: PropTypes.string,
    requestFee: PropTypes.func.isRequired,
    showLoading: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errorSendCoins: null,
    errorSendLightningPayment: null,
    onchainPayment: null,
    lightningPayment: null,
    streamId: null,
    fee: null,
    errorFee: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      item: props.navigation.state.params,
    };
  }

  componentDidMount() {
    const { item } = this.state;
    this.props.requestFee(item.type, item.to.address, item.amount);
  }

  componentDidUpdate(prevProp) {
    // Onchain payment response
    // ERROR
    if (!prevProp.errorSendCoins && this.props.errorSendCoins) {
      this.props.showLoading(false);
      this.navigateToPaymentResponse(Types.ERROR, this.props.errorSendCoins);

      return;
    }
    // SUCCESS
    if (!prevProp.onchainPayment && this.props.onchainPayment) {
      this.props.showLoading(false);
      this.navigateToPaymentResponse(Types.SUCCESS);
      return;
    }

    // Lightning payment response
    // ERROR
    if (!prevProp.errorSendLightningPayment && this.props.errorSendLightningPayment) {
      this.props.showLoading(false);
      this.navigateToPaymentResponse(Types.ERROR, this.props.errorSendLightningPayment);
      return;
    }
    // SUCCESS
    if (!prevProp.lightningPayment && this.props.lightningPayment) {
      this.props.showLoading(false);
      this.navigateToPaymentResponse(Types.SUCCESS);
    }

    // Stream payment response
    if (!prevProp.streamId && this.props.streamId) {
      this.props.showLoading(false);
      this.props.navigation.dispatch(NavigationActions.goBackAndPush('PaymentCreate', 'StreamsInfo', {
        streamId: this.props.streamId,
      }));
    }
  }

  getAmount = () => {
    let sum;
    const { item } = this.state;

    if (item.isStream) {
      sum = item.amount * item.totalTime;
    } else {
      sum = item.amount;
    }

    return sum;
  };

  getAmountStr = () => {
    const { btcFraction, usdPerBtc } = this.props;
    const sum = this.getAmount();
    const { item } = this.state;
    let time;

    if (item.isStream) {
      time = `/ ${item.totalTime} SEC `;
    } else {
      time = '';
    }

    return `${satoshiToBtcFraction(sum, btcFraction)} ${btcFraction} ${time}~ $${satoshiToUsd(
      sum,
      usdPerBtc,
    )}`;
  };

  getMethodName = () => {
    const { type, subType } = this.state.item;
    const first = getTypeDisplayName(type);
    const second = 'Payment';
    const third = type === Types.LIGHTNING ? capitalizeFirstLetter(subType) : '';
    return `${first} ${second} ${third}`;
  };

  navigateToPaymentResponse = (status, error) => {
    const { item } = this.state;

    this.props.navigation.navigate('PaymentResponse', {
      status,
      error,
      to: item.to,
      amount: item.amount,
      type: item.type,
    });
  };

  handleConfirm = () => {
    const { item } = this.state;
    const { usdPerBtc, showLoading } = this.props;
    const amountUsd = satoshiToUsd(this.getAmount(), usdPerBtc);

    showLoading(true);

    if (item.type === Types.ONCHAIN) {
      this.props.sendCoins(item.name, item.to.address, item.amount, amountUsd, item.type);
      return;
    }

    if (item.isStream) {
      this.props.addStream(item.name, item.amount, item.totalTime, item.to.address);
      return;
    }

    this.props.sendLightningPayment(
      item.name,
      item.to.address,
      item.amount,
      amountUsd,
      item.type,
      item.paymentData,
    );
  };

  render() {
    const { item } = this.state;
    const { fee, errorFee } = this.props;
    let feeString;
    if (isNil(fee) && isNil(errorFee)) {
      feeString = 'Calculating...';
    } else {
      feeString = isNil(errorFee)
        ? `${fee} ${Types.Satoshi} (${Number(((fee * 100) / item.amount).toFixed(2))} %)`
        : errorFee;
    }

    const toName = item.to.name || item.to.address;
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>To</Text>
            <TouchableOpacity onPress={() => Clipboard.set('To', toName)}>
              <Text style={styles.value}>{toName}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.valueAmount}>{this.getAmountStr()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction fee</Text>
            <Text style={styles.value}>{feeString}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment method</Text>
            <Text style={styles.value}>{this.getMethodName()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{item.name}</Text>
          </View>
        </ScrollView>
        <Button style={styles.button} title="CONFIRM" onPress={this.handleConfirm} inline={false} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
  usdPerBtc: state.currencies.usdPerBtc,
  onchainPayment: state.onchain.payment,
  lightningPayment: state.lightning.payment,
  errorSendCoins: state.onchain.errorSendCoins,
  errorSendLightningPayment: state.lightning.errorSendPayment,
  streamRequestError: state.streams.createStreamError,
  fee: LightningSelectors.getFee(state),
  errorFee: LightningSelectors.getErrorFee(state),
  streamId: state.streams.createStreamId,
});

const mapDispatchToProps = dispatch => ({
  sendLightningPayment: (name, address, amount, amountUsd, type, paymentData) =>
    dispatch(LightningActions.lightningSendPaymentRequest(
      name,
      address,
      amount,
      amountUsd,
      type,
      paymentData,
    )),
  sendCoins: (name, address, amount, amountUsd, type) =>
    dispatch(OnchainActions.onchainSendCoinsRequest(name, address, amount, amountUsd, type)),
  addStream: (name, price, totalTime, destination) =>
    dispatch(StreamsActions.streamsAddRequest(name, price, totalTime, destination)),
  requestFee: (paymentType, id, amount) =>
    dispatch(LightningActions.feeRequest(paymentType, id, amount)),
  showLoading: show => dispatch(UiActions.showLoading(show)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentDataScreen);
