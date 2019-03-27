import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';

import AccountActions, { AccountSelectors } from '../Redux/AccountRedux';

// Styles
import styles from './Styles/UnlockPinScreenStyle';
import PinPad from '../Components/PinPad';
import { Metrics } from '../Themes';

class UnlockPinScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    unlockRequest: PropTypes.func.isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: null,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.error && this.props.error) {
      this.pinPad.showError(this.props.error);
    }
  }

  onConnectNodeTapped = () => {
    this.props.navigation.navigate('SignUp');
  };

  onPinEntered = (pin) => {
    this.props.unlockRequest(pin);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <PinPad
          ref={(ref) => {
            this.pinPad = ref;
          }}
          title="Unlock with your PIN"
          onPinEntered={this.onPinEntered}
          style={styles.container}
        />
        <TouchableOpacity
          activeOpacity={Metrics.activeOpacity}
          onPress={() => this.onConnectNodeTapped()}
          style={styles.connectNodeContainer}
        >
          <Text style={styles.connectNodeText}>CONNECT TO ANOTHER NODE</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  error: AccountSelectors.getUnlockError(state),
});

const mapDispatchToProps = dispatch => ({
  unlockRequest: pin => dispatch(AccountActions.unlockRequest(pin)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnlockPinScreen);
