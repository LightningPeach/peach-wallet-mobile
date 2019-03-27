import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import AccountActions from '../Redux/AccountRedux';

// Styles
import styles from './Styles/CreatePinScreenStyle';
import PinPad from '../Components/PinPad';
import { isReallyEmpty } from '../Services/Utils';
import { jsDelay } from '../Services/Delay';

const initialState = {
  title: 'Enter your PIN',
  firstPin: null,
};

class CreatePinScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    createPinRequest: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = initialState;
  }

  onPinCreated = (pin) => {
    this.props.createPinRequest(pin);
  };

  onPinEntered = (pin) => {
    const { firstPin } = this.state;
    if (isReallyEmpty(firstPin)) {
      this.setState({ firstPin: pin, title: 'Repeat your PIN' }, async () => {
        await jsDelay(100);
        this.pinPad.reset();
      });
    } else if (!equals(firstPin, pin)) {
      this.setState(initialState, () => this.pinPad.showError('Incorrect PIN'));
    } else {
      this.onPinCreated(pin);
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
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  createPinRequest: pin => dispatch(AccountActions.createPinRequest(pin)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePinScreen);
