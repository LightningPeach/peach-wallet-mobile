import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import Types from '../../Config/Types';
import LightningActions, { LightningSelectors } from '../../Redux/LightningRedux';
import { decodePaymentData } from '../../Services/Payment';
import QrCodeScreen from './QrCodeScreen';
import Errors from '../../Config/Errors';

// Styles
import styles from './Styles/QrCodeScreenStyle';

class PaymentQrCodeScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Scan QR code',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    payment: Types.PAYMENT_DECOD,
    navigation: PropTypes.object.isRequired,
    decodePaymentRequest: PropTypes.func.isRequired,
    decodePaymentError: PropTypes.string,
  };

  static defaultProps = {
    payment: null,
    decodePaymentError: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidUpdate(prevProp) {
    if (!prevProp.payment && this.props.payment) {
      const data = {
        name: this.props.payment.description,
        address: this.props.payment.destination,
        amount: parseInt(this.props.payment.num_satoshis, 10),
        paymentData: this.state.data,
      };

      this.complete(data, Types.LIGHTNING);
    }

    if (!prevProp.decodePaymentError && this.props.decodePaymentError) {
      this.qrCodeScreen.handleScanError();
    }
  }

  onScan = (qrData) => {
    const {
      type, data, amount, name, error,
    } = decodePaymentData(
      qrData,
      Errors.EXCEPTION_QRCODE_SCAN_ERROR,
    );

    if (error) {
      this.qrCodeScreen.handleScanError(error);
      return;
    }

    if (type === Types.LIGHTNING) {
      this.setState({ data }, () => this.props.decodePaymentRequest(data));
    } else if (type === Types.ONCHAIN) {
      this.complete(
        {
          name,
          address: data,
          amount,
        },
        Types.ONCHAIN,
      );
    }
  };

  complete = (data, type) => {
    const onScann = path(['state', 'params', 'onScann'], this.props.navigation);

    if (onScann) {
      onScann(data, type);
      this.props.navigation.goBack();
    } else {
      this.props.navigation.replace('PaymentCreate', {
        ...data,
        type,
      });
    }
  };

  render() {
    return (
      <QrCodeScreen
        ref={(r) => {
          this.qrCodeScreen = r;
        }}
        navigation={this.props.navigation}
        onScan={this.onScan}
      />
    );
  }
}

const mapStateToProps = state => ({
  payment: LightningSelectors.getDecodedPayment(state),
  decodePaymentError: LightningSelectors.getDecodePaymentFailure(state),
});

const mapDispatchToProps = dispatch => ({
  decodePaymentRequest: payreq => dispatch(LightningActions.lightningDecodePaymentRequest(payreq)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentQrCodeScreen);
