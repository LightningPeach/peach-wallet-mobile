import React, { Component } from 'react';
import { ScrollView, Image, Linking } from 'react-native';
import { connect } from 'react-redux';
import { path } from 'ramda';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';

import Types from '../../Config/Types';
import Text from '../../Components/Text';
import Button from '../../Components/Button';
import { isReallyEmpty } from '../../Services/Utils';
import AppConfig from '../../Config/AppConfig';

import { satoshiToBtcFraction, satoshiToUsd } from '../../Transforms/currencies';

import { StreamData, ContactData } from '../../Realm';

// Styles
import { Images, Metrics } from '../../Themes';
// Styles
import styles from './Styles/StreamsErrorScreenStyle';

class StreamsErrorScreen extends Component {
  static navigationOptions = {
    headerTitle: null,
    headerBackTitle: null,
    headerLeft: null,
  };

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(PropTypes.shape({ streamId: PropTypes.string.isRequired }))
      .isRequired,
    usdPerBtc: Types.FLOAT_NUMBER_PROPS.isRequired,
    btcFraction: Types.BTC_FRACTION_PROPS.isRequired,
  };

  constructor(props) {
    super(props);

    const streamId = path(['navigation', 'state', 'params', 'streamId'], props);
    const stream = StreamData.getOne(streamId);
    const contacts = ContactData.findByAddress(stream.destination);
    const destination = contacts.length > 0 ? contacts[0].name : stream.destination;

    this.state = {
      stream,
      destination,
    };
  }

  handleOk = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  openRestartInstruction = async () => {
    try {
      await Linking.openURL(AppConfig.lndRestartUrl);
    } catch (e) {
      console.log("can't open url", e);
    }
  };

  render() {
    const { usdPerBtc, btcFraction } = this.props;
    const { stream, destination } = this.state;
    const amount = stream.secPaid * stream.price;

    let errorMessage;
    if (isReallyEmpty(stream.error)) {
      errorMessage = Types.LIS_DEFAULT_ERROR;
    } else {
      errorMessage = stream.error;
    }

    const showInstructions = errorMessage !== Types.LIS_DEFAULT_ERROR;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ marginBottom: Metrics.doubleBaseMargin }}
          contentContainerStyle={styles.contentContainer}
        >
          <Image source={Images.channelsError} style={styles.icon} />
          <Text style={styles.title}>ERROR</Text>
          <Text style={styles.description}>
            Your stream payment {stream.name || ''} to {destination} has been paused
          </Text>
          <Text style={styles.description}>
            {satoshiToBtcFraction(amount, btcFraction)} {btcFraction} /{stream.secPaid} sec ~ $
            {satoshiToUsd(amount, usdPerBtc)}
          </Text>
          <Text style={styles.description}>{errorMessage}</Text>
          {showInstructions && (
            <Text style={[styles.errorInstructionsMessage, { marginTop: Metrics.baseMargin }]}>
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
        <Button style={styles.button} title="GOT IT" onPress={this.handleOk} inline={false} />
      </SafeAreaView>
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
)(StreamsErrorScreen);
