import React, { Component } from 'react';
import { equals } from 'ramda';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import AccountActions from '../Redux/AccountRedux';

// Styles
import styles from './Styles/ChangePinScreenStyle';
import PinPad from '../Components/PinPad';
import { isReallyEmpty } from '../Services/Utils';
import { jsDelay } from '../Services/Delay';
import { validatePin } from '../Services/Check';
import Errors from '../Config/Errors';

const initialState = {
  title: 'Your old PIN',
  oldPinVerified: false,
  firstPin: null,
};

class ChangePinScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Change PIN',
    headerTitleStyle: styles.headerTitleStyle,
  };

  static propTypes = {
    changePinRequest: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = initialState;
  }

  onCancelTapped = () => {
    this.setState(initialState, () => this.pinPad.reset());
  };

  onPinChanged = (pin) => {
    this.props.changePinRequest(pin);
  };

  onPinEntered = async (pin) => {
    const { oldPinVerified, firstPin } = this.state;
    if (!oldPinVerified) {
      const error = await validatePin(pin);
      if (error) {
        this.setState(initialState, () => this.pinPad.showError(error));
      } else {
        this.setState({ oldPinVerified: true, title: 'Enter new PIN' }, async () => {
          await jsDelay(100);
          this.pinPad.reset();
        });
      }
    } else if (isReallyEmpty(firstPin)) {
      this.setState({ firstPin: pin, title: 'Repeat new PIN' }, async () => {
        await jsDelay(100);
        this.pinPad.reset();
      });
    } else if (!equals(firstPin, pin)) {
      this.setState(initialState, () => this.pinPad.showError(Errors.EXCEPTION_PIN_NOT_MATCH));
    } else {
      this.onPinChanged(pin);
    }
  };

  render() {
    const { title } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <PinPad
          ref={(ref) => {
            this.pinPad = ref;
          }}
          title={title}
          onPinEntered={this.onPinEntered}
          style={styles.container}
          onCancelTapped={this.onCancelTapped}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  changePinRequest: pin => dispatch(AccountActions.changePinRequest(pin)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePinScreen);
