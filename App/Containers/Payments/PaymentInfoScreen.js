import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import { isEmpty, isNil, path } from 'ramda';
import { isArray, isString } from 'lodash';

import {
  getIconByStatus,
  getIconStyleByStatus,
  getTextColorByStatus,
  getTextInfoByStatus,
  getRecepientIdTextByStatus,
  getRecepientTextByStatus,
} from '../../Services/Payment';
import Clipboard from '../../Services/Clipboard';
import { satoshiToBtcFraction } from '../../Transforms/currencies';
import Types from '../../Config/Types';
import LightningActions, { LightningSelectors } from '../../Redux/LightningRedux';
import { ContactData } from '../../Realm';
import Text from '../../Components/Text';
import Button from '../../Components/Button';
import { isReallyEmpty } from '../../Services/Utils';
// Styles
import styles from './Styles/PaymentInfoScreenStyle';

class PaymentInfoScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Payment info',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
    decodePayment: PropTypes.func.isRequired,
    payment: Types.PAYMENT_DECOD,
    isDecodePaymentProcessing: PropTypes.bool,
  };

  static defaultProps = {
    payment: null,
    isDecodePaymentProcessing: false,
  };

  constructor(props) {
    super(props);

    const data = props.navigation.state.params;

    const contacts = ContactData.findByAddress(data.address);
    if (contacts.length > 0) {
      data.recipient = contacts[0].name;
    }

    this.state = {
      data,
    };
  }

  componentDidMount() {
    if (this.state.data.paymentRequest) {
      this.props.decodePayment(this.state.data.paymentRequest);
    }
  }

  componentDidUpdate(prevProp) {
    if (!prevProp.payment && this.props.payment) {
      this.setState({
        data: {
          ...this.props.navigation.state.params,
          id: this.props.payment.payment_hash,
        },
      });
    }
  }

  renderRecipientId(recipientId) {
    if (isArray(recipientId)) {
      return recipientId.map(id => (
        <Text key={id} style={styles.tokenText}>
          {id}
        </Text>
      ));
    }

    if (isString(recipientId)) {
      return <Text style={styles.tokenText}>{recipientId}</Text>;
    }

    return null;
  }

  renderCopy = (recipientIdText, recipientId) => {
    if (isEmpty(recipientId) || isNil(recipientId)) {
      return null;
    }

    return (
      <Button
        style={styles.copyButton}
        title={`COPY ${recipientIdText.toUpperCase()}`}
        onPress={() =>
          Clipboard.set(recipientIdText, isArray(recipientId) ? recipientId[0] : recipientId)
        }
      />
    );
  };

  renderIcon = () => {
    const status = path(['data', 'status'], this.state);
    if (!status || status === Types.INCOMING) {
      return null;
    }
    return (
      <Image source={getIconByStatus(status)} style={[styles.icon, getIconStyleByStatus(status)]} />
    );
  };

  render() {
    const { btcFraction, isDecodePaymentProcessing } = this.props;
    const {
      data: {
        name: description = 'Description',
        amount = 0,
        address: recipientId,
        recipient,
        id,
        date,
        amountUsd,
        status,
        paymentType,
        paymentSubType,
      } = {},
    } = this.state || {};

    const dataId = isDecodePaymentProcessing ? '-' : id;

    const paymentTypeString = `${paymentType === Types.LIGHTNING ? 'Lightning' : 'On-chain'} ${
      paymentSubType === Types.STREAM ? 'stream' : 'regular'
    }`;

    const recipientIdText = getRecepientIdTextByStatus(paymentType, status);
    const recipientText = getRecepientTextByStatus(status);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.section}>
            <View style={styles.row}>
              {this.renderIcon()}
              <Text style={[styles.textInfo, getTextColorByStatus(status)]}>
                {getTextInfoByStatus(status)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.descriptionText, styles.textFloat]}>Type</Text>
              <Text style={styles.textInfo}>{paymentTypeString}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.descriptionText}>{`${description}`}</Text>
              {dataId && (
                <TouchableOpacity onPress={() => Clipboard.set('Transaction Id', dataId)}>
                  <Text style={styles.tokenText}>{dataId}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.row}>
              <Text style={[styles.descriptionText, styles.textFloat]}>Date</Text>
              {date && (
                <Text style={styles.textInfo}>{moment.unix(date).format('DD.MM.YYYY')}</Text>
              )}
            </View>
            <View style={styles.row}>
              <Text style={[styles.descriptionText, styles.textFloat]}>Amount</Text>
              <View>
                <Text style={styles.textInfo}>
                  {`${satoshiToBtcFraction(amount, btcFraction)} ${btcFraction}`}
                </Text>
                {amountUsd && <Text style={styles.textInfo}>{`~ $${amountUsd}`}</Text>}
              </View>
            </View>
            {paymentType !== Types.ONCHAIN && !isReallyEmpty(recipient) && (
              <View style={styles.row}>
                <Text style={[styles.descriptionText, styles.textFloat]}>{recipientText}</Text>
                <Text style={styles.textInfo}>{recipient}</Text>
              </View>
            )}
            {!isReallyEmpty(recipientId) && (
              <View style={[styles.column, styles.rowLast]}>
                <Text style={styles.descriptionText}>{recipientIdText}</Text>
                {this.renderRecipientId(recipientId)}
              </View>
            )}
          </View>
          {this.renderCopy(recipientIdText, recipientId)}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
  payment: LightningSelectors.getDecodedPayment(state),
  isDecodePaymentProcessing: LightningSelectors.getDecodePaymentProcessing(state),
});

const mapDispatchToProps = dispatch => ({
  decodePayment: payreq => dispatch(LightningActions.lightningDecodePaymentRequest(payreq)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentInfoScreen);
