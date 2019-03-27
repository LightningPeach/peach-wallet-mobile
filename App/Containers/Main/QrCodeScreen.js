import React, { Component } from 'react';
import { View, Image } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import Config from '../../Config/AppConfig';
import Types from '../../Config/Types';
import { showError } from '../../Services/InformBox';
import { jsDelay } from '../../Services/Delay';

// Styles
import { Images, Metrics } from '../../Themes';
import styles from './Styles/QrCodeScreenStyle';

export default class QrCodeScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Scan QR code',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS().isRequired,
    onScan: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener('didFocus', () =>
      this.reactivateScanner());
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  onSuccess = (e) => {
    const qrData = path(['data'], e);
    console.log('onSuccess', qrData);
    this.props.onScan(qrData);
  };

  reactivateScanner() {
    console.log('qrscanner reactivate');
    this.scanner.reactivate();
  }

  async handleScanError(error) {
    if (error) {
      showError(error);
    }
    await jsDelay(Config.reactivateTimeout);
    this.reactivateScanner();
  }

  componentDidFocus() {
    this.scanner.reactivate();
  }

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          ref={(node) => {
            this.scanner = node;
          }}
          showMarker
          reactivate={false}
          reactivateTimeout={Config.reactivateTimeout}
          onRead={this.onSuccess}
          cameraStyle={styles.camera}
          customMarker={<Image source={Images.qrMarker} style={Metrics.icons.qrMarker} />}
        />
      </View>
    );
  }
}
