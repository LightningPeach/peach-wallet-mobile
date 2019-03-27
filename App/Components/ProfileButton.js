import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';

import Text from '../Components/Text';

import { Metrics } from '../Themes';
import styles from './Styles/ProfileButtonStyle';

export default class ProfileButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    const { onPress, icon, text } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={Metrics.activeOpacity}
        onPress={onPress}
        style={styles.container}
      >
        <Image source={icon} style={styles.image} />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  }
}
