import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ViewPropTypes } from 'react-native';
import { is } from 'ramda';
import styles from './Styles/ChannelsInfoRowStyle';

export default class ChannelsInfoRow extends Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value: PropTypes.any,
    containerStyle: ViewPropTypes.style,
    labelStyle: Text.propTypes.style,
    valueStyle: Text.propTypes.style,
  };

  static defaultProps = {
    label: null,
    value: null,
    containerStyle: null,
    labelStyle: null,
    valueStyle: null,
  };

  renderLabel = () => {
    const { label, labelStyle } = this.props;
    if (is(String, label)) {
      return <Text style={[styles.textLabel, labelStyle]}>{this.props.label}</Text>;
    }
    return label;
  };

  renderValue = () => {
    const { value, valueStyle } = this.props;
    return <Text style={[styles.textValue, valueStyle]}>{value}</Text>;
  };

  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[styles.rowContainer, containerStyle]}>
        {this.renderLabel()}
        {this.renderValue()}
      </View>
    );
  }
}
