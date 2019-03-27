import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Types from '../../Config/Types';
import { transformSignupQrCode } from '../../Services/Auth';
import QrCodeScreen from './QrCodeScreen';
import styles from './Styles/QrCodeScreenStyle';
import Errors from '../../Config/Errors';

class SignupQrCodeScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Scan QR code',
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitle: null,
  };

  static propTypes = {
    navigation: Types.NAVIGATION_PROPS(PropTypes.shape({
      onScan: PropTypes.func.isRequired,
    }).isRequired).isRequired,
  };

  handleOnScan = (qrData) => {
    const authData = transformSignupQrCode(qrData);
    if (!authData) {
      this.qrCodeScreen.handleScanError(Errors.EXCEPTION_QRCODE_SCAN_ERROR);
      return;
    }
    this.props.navigation.state.params.onScan(authData);
    this.props.navigation.dispatch(StackActions.pop());
  };

  render() {
    return (
      <QrCodeScreen
        ref={(it) => {
          this.qrCodeScreen = it;
        }}
        navigation={this.props.navigation}
        onScan={this.handleOnScan}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupQrCodeScreen);
