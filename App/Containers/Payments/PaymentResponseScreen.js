import React, { Component } from 'react';
import { Image, ScrollView, Linking } from 'react-native';
import { StackActions, SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Images } from '../../Themes';
import Types from '../../Config/Types';

import Text from '../../Components/Text';
import Button from '../../Components/Button';
import CustomNavigationActions from '../../Redux/NavigationRedux';

import { satoshiToBtcFraction, satoshiToUsd } from '../../Transforms/currencies';
import { isReallyEmpty } from '../../Services/Utils';
import AppConfig from '../../Config/AppConfig';
// Styles
import styles from './Styles/PaymentResponseScreenStyle';
import BackAwareComponent from '../../Components/BackAwareComponent';

class PaymentResponseScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    ...BackAwareComponent.navigationOptions({ navigation }),
  });

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(PropTypes.shape({
      error: PropTypes.string,
    })).isRequired,
    usdPerBtc: Types.FLOAT_NUMBER_PROPS.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      item: props.navigation.state.params,
    };
  }

  getStatusTextStyle = () => {
    const style = [styles.textTitle];

    if (this.state.item.status === Types.SUCCESS) style.push(styles.textSuccess);
    else style.push(styles.textError);

    return style;
  };

  handleCreateNewPayment = () => {
    this.props.navigation.dispatch(CustomNavigationActions.goBackAndPush('PaymentCreate', 'PaymentCreate', {
      type: this.state.item.type,
    }));
  };

  openRestartInstruction = async () => {
    try {
      await Linking.openURL(AppConfig.lndRestartUrl);
    } catch (e) {
      console.log("can't open url", e);
    }
  };

  goBack = () => {
    this.props.navigation.dispatch(CustomNavigationActions.goBackAndPush('PaymentCreate'));
  };

  render() {
    const { item } = this.state;
    const { btcFraction, usdPerBtc, navigation } = this.props;

    const error = this.props.navigation.getParam('error');

    let errorMessage;
    if (item.status !== Types.SUCCESS) {
      if (isReallyEmpty(error)) {
        errorMessage = Types.LIS_DEFAULT_ERROR;
      } else {
        errorMessage = error;
      }
    }

    const showInstructions =
      item.type === Types.LIGHTNING &&
      !isReallyEmpty(errorMessage) &&
      errorMessage !== Types.LIS_DEFAULT_ERROR;

    return (
      <BackAwareComponent showCrossIcon goBack={this.goBack}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
            <Image
              style={styles.image}
              source={item.status === Types.SUCCESS ? Images.success : Images.channelsError}
            />
            <Text style={this.getStatusTextStyle()}>
              {item.status === Types.SUCCESS ? 'SUCCESS' : 'ERROR'}
            </Text>
            <Text style={styles.textSubTitle}>
              Your payment was {item.status === Types.ERROR && 'not '}
              sent
            </Text>
            <Text style={styles.textSubTitle}>to {item.to.name}</Text>
            <Text style={styles.textSubTitle}>
              {`${satoshiToBtcFraction(item.amount, btcFraction)} ${btcFraction} ~ $${satoshiToUsd(
                item.amount,
                usdPerBtc,
              )}`}
            </Text>
            {!isReallyEmpty(errorMessage) && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            {showInstructions && (
              <Text style={styles.errorInstructionsMessage}>
                {`Please try the following actions:    
    - Open the direct channel with the recipient 
    - Send the onchain payment
    - Restart the LND node. Check `}
                <Text style={styles.linkText} onPress={this.openRestartInstruction}>
                  the instruction for Google cloud
                </Text>
                {`
    - Wait for some time and try again later.`}
              </Text>
            )}
          </ScrollView>
          <Button
            style={styles.okButton}
            title={item.status === Types.SUCCESS ? 'OK' : 'CHECK YOUR DATA'}
            onPress={() => {
              if (item.status === Types.SUCCESS) {
                this.goBack();
              } else {
                navigation.dispatch(StackActions.pop({ n: 2 }));
              }
            }}
            inline={false}
          />
          <Button
            style={styles.createNewPaymentButton}
            title="CREATE NEW PAYMENT"
            onPress={() =>
              navigation.dispatch(CustomNavigationActions.goBackAndPush('PaymentCreate', 'PaymentCreate', {
                  type: this.state.item.type,
                }))
            }
          />
        </SafeAreaView>
      </BackAwareComponent>
    );
  }
}

const mapStateToProps = state => ({
  btcFraction: state.ui.btcFraction,
  usdPerBtc: state.currencies.usdPerBtc,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentResponseScreen);
