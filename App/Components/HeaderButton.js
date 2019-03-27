import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';

import styles from './Styles/HeaderButtonStyle';

export default class HeaderButton extends Component {
  // Prop type warnings
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.number.isRequired,
  };

  render() {
    const { icon, onPress } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress()}>
        <Image source={icon} style={styles.img} />
      </TouchableOpacity>
    );
  }
}
