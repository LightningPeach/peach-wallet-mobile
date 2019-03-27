import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { isEmpty, isNil, replace } from 'ramda';

import LightningActions from '../../Redux/LightningRedux';

import { convertToSatochiByType, btcFractionToUsd } from '../../Transforms/currencies';

import Text from '../../Components/Text';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';

import Types from '../../Config/Types';
import { checkAmount } from '../../Services/Check';
// Styles
import styles from './Styles/PaymentRequestScreenStyle';
import AmountUsdText from '../../Components/AmountUsdText';

class PaymentRequestScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Payment request',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    getPaymentRequest: PropTypes.func.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    navigation: PropTypes.object.isRequired,
    paymentRequest: PropTypes.string,
    usdPerBtc: Types.FLOAT_NUMBER_PROPS.isRequired,
  };

  static defaultProps = {
    paymentRequest: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      amountUsd: (0).toFixed(2),
      amountInputValue: '',
      canShowError: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { paymentRequest } = this.props;
    if (!prevProps.paymentRequest && paymentRequest) {
      this.props.navigation.navigate('PaymentRequestInfo', {
        amount: this.state.amount,
        payReq: paymentRequest,
      });
    }
  }

  handleChangeAmount = (val) => {
    const { btcFraction, usdPerBtc } = this.props;
    const amountInputValue = replace(',', '.', val);
    const error = checkAmount(amountInputValue, btcFraction, true);
    const amount = error ? '' : convertToSatochiByType(amountInputValue, btcFraction);
    const amountUsd = btcFractionToUsd(
      Number.isNaN(Number(amountInputValue)) ? 0 : amountInputValue,
      btcFraction,
      usdPerBtc,
    );

    this.setState({
      amountInputValue,
      amount,
      amountUsd,
      error,
    });
  };

  handleRequest = () => {
    const { getPaymentRequest } = this.props;
    const { error, amount } = this.state;

    Keyboard.dismiss();
    if (!isNil(error)) {
      return;
    }

    getPaymentRequest(amount);
  };

  render() {
    const { btcFraction } = this.props;
    const {
      amountInputValue, amountUsd, error, canShowError,
    } = this.state;
    const showError = !isNil(error) && canShowError;
    const disabled = isEmpty(amountInputValue);

    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Create your payment request</Text>
          <View style={styles.row}>
            <TextInput
              link={(ref) => {
                this.amountInput = ref;
              }}
              style={styles.textInput}
              onChangeText={this.handleChangeAmount}
              value={amountInputValue}
              onSubmitEditing={() => {
                if (!disabled) {
                  this.handleRequest();
                }
              }}
              onBlur={() => this.setState({ canShowError: true })}
              placeholder={`Amount in ${btcFraction}`}
              autoCorrect={false}
              keyboardType="numeric"
              returnKeyType="done"
            />
            <AmountUsdText>{`$ ${amountUsd}`}</AmountUsdText>
          </View>
          {showError && <Text style={styles.errorText}>{error}</Text>}
        </View>
        <Button
          disabled={disabled}
          style={styles.button}
          title="GENERATE REQUEST"
          onPress={this.handleRequest}
          inline={false}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
  paymentRequest: state.lightning.paymentRequest,
  usdPerBtc: state.currencies.usdPerBtc,
});

const mapDispatchToProps = dispatch => ({
  getPaymentRequest: amount => dispatch(LightningActions.lightningPaymentRequestRequest(amount)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentRequestScreen);
