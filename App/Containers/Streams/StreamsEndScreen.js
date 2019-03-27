import React, { Component } from 'react';
import { path } from 'ramda';
import { ScrollView, Image, View } from 'react-native';
import { StackActions, SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Types from '../../Config/Types';
import Text from '../../Components/Text';
import Button from '../../Components/Button';
import { satoshiToBtcFraction, satoshiToUsd } from '../../Transforms/currencies';

import { StreamData, ContactData } from '../../Realm';
import { addRealmCollectionListener } from '../../Realm/Utils';

// Styles
import { Images } from '../../Themes';
import styles from './Styles/StreamsEndScreenStyle';

class StreamsEndScreen extends Component {
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
    this.streamSingleList = StreamData.getSingleList(streamId);
    const stream = this.streamSingleList[0];

    const contacts = ContactData.findByAddress(stream.destination);
    const destination = contacts.length > 0 ? contacts[0].name : stream.destination;

    this.state = {
      stream,
      destination,
    };
  }

  componentDidMount() {
    addRealmCollectionListener(this.streamSingleList, () => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.streamSingleList.removeAllListeners();
  }

  handleOk = () => {
    const { navigation } = this.props;
    navigation.dispatch(StackActions.popToTop());
    navigation.navigate('StreamsList');
  };

  handleNew = () => {
    const { navigation } = this.props;
    navigation.dispatch(StackActions.popToTop());
    navigation.navigate('PaymentCreate', {
      type: Types.LIGHTNING,
      subType: Types.STREAM,
    });
  };

  render() {
    const { usdPerBtc, btcFraction } = this.props;
    const { stream, destination } = this.state;
    const amount = stream.secPaid * stream.price;

    const waitingForResponses = stream.ongoingPaymentsNumber > 0;

    let image;
    let title;
    let titleStyle;
    let description;
    if (stream.secPaid === stream.totalTime) {
      // stream succeeded
      image = Images.success;
      title = 'SUCCESS';
      titleStyle = styles.title;
      description = 'Your stream payment was sent';
    } else if (stream.secPaid > 0) {
      // partially failed
      image = Images.channelsError;
      title = 'ERROR';
      titleStyle = styles.titleError;
      description = 'Your stream payment was sent partially';
    } else {
      // total fail
      image = Images.channelsError;
      title = 'ERROR';
      titleStyle = styles.titleError;
      description = 'Your stream payment was not sent';
    }

    return (
      <SafeAreaView style={styles.container}>
        {waitingForResponses && (
          <View style={styles.centerContainer}>
            <Text style={styles.processingText}>
              Processing stream payment {stream.ongoingPaymentsNumber}
            </Text>
          </View>
        )}
        {!waitingForResponses && (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Image source={image} style={styles.image} />
            <Text style={titleStyle}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.description}>to {destination}</Text>
            <Text style={[styles.description, styles.descriptionLast]}>
              {satoshiToBtcFraction(amount, btcFraction)} {btcFraction} /{stream.secPaid} sec ~ $
              {satoshiToUsd(amount, usdPerBtc)}
            </Text>
            <Button style={styles.button} title="GOT IT" onPress={this.handleOk} inline={false} />
            <Button style={styles.button} title="CREATE NEW PAYMENT" onPress={this.handleNew} />
          </ScrollView>
        )}
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
)(StreamsEndScreen);
