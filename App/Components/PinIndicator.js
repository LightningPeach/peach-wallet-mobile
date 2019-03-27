import React, { Component } from 'react';
import { times } from 'ramda';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styles from './Styles/PinIndicatorStyle';

export default class PinIndicator extends Component {
  // Prop type warnings
  static propTypes = {
    activeIndicatorNumber: PropTypes.number.isRequired,
    indicatorNumber: PropTypes.number.isRequired,
  };

  render() {
    const {
      activeIndicatorNumber, indicatorNumber, style, ...rest
    } = this.props;

    const indicators = times(
      i => (
        <View
          key={i}
          style={i < activeIndicatorNumber ? styles.activeIndicator : styles.indicator}
        />
      ),
      indicatorNumber,
    );
    return (
      <View style={[styles.container, style]} {...rest}>
        {indicators}
      </View>
    );
  }
}
