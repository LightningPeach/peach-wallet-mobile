import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import styles from './Styles/PrivacyModeViewStyle';
import Types from '../Config/Types';
import { AccountSelectors } from '../Redux/AccountRedux';
import { Images } from '../Themes';

class PrivacyModeView extends Component {
  // // Prop type warnings
  static propTypes = {
    mode: Types.MODE_PROPS,
    children: PropTypes.any.isRequired,
    lockStyle: PropTypes.object,
  };

  static defaultProps = {
    lockStyle: null,
    mode: null,
  };

  render() {
    const {
      mode, children, lockStyle, ...rest
    } = this.props;
    return (
      <View {...rest}>
        {children}
        {mode === Types.MODE_STANDARD && (
          <Image source={Images.lock} style={[styles.lock, lockStyle]} />
        )}
      </View>
    );
  }
}

export default connect(
  state => ({
    mode: AccountSelectors.getPrivacyMode(state),
  }),
  null,
)(PrivacyModeView);
