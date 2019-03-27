import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, ViewPropTypes } from 'react-native';

import Text from '../Components/Text';
import { Metrics } from '../Themes';
import styles from './Styles/WidgetStyle';

export default class Widget extends Component {
  // Prop type warnings
  static propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    iconStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => ({}),
    iconStyle: null,
  };

  render() {
    const {
      name, icon, iconStyle, onPress,
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={Metrics.activeOpacity}
        style={styles.container}
        onPress={onPress}
      >
        <View style={styles.mainSection}>
          <Image source={icon} style={iconStyle} />
        </View>
        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
    );
  }
}
