import React, { Component } from 'react';
import { View, Share, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Text from '../../Components/Text';
import Button from '../../Components/Button';
import Clipboard from '../../Services/Clipboard';

import { AccountSelectors } from '../../Redux/AccountRedux';
import { UiSelectors } from '../../Redux/UiRedux';
import Types from '../../Config/Types';
import { satoshiToBtcFraction } from '../../Transforms/currencies';

// Styles
import styles from './Styles/PaymentRequestInfoScreenStyle';

class PaymentRequestInfoScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Payment request',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    username: PropTypes.string.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: this.props.navigation.state.params.amount,
      payReq: this.props.navigation.state.params.payReq,
    };
  }

  sharePayReq = () => {
    const { amount, payReq } = this.state;
    const { username, btcFraction } = this.props;
    const message = `Payment request for ${satoshiToBtcFraction(
      amount,
      btcFraction,
    )} ${btcFraction}:\n${payReq}`;
    const title = `Payment request from ${username}`;
    Share.share(
      { message, title },
      {
        // iOS
        subject: title,
        // Android
        dialogTitle: title,
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.text, styles.title]}>Copy your payment request</Text>
          <Text style={styles.text}>{this.state.payReq}</Text>
          <View style={styles.buttonsSection}>
            <Button
              style={styles.button}
              title="COPY REQUEST"
              onPress={() => Clipboard.set('Request', this.state.payReq)}
              inline={false}
            />
            <Button style={styles.button} title="SHARE REQUEST" onPress={this.sharePayReq} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  username: AccountSelectors.getUserName(state),
  btcFraction: UiSelectors.getBtcFraction(state),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentRequestInfoScreen);
