import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';

import { Images } from '../Themes';
import styles from './Styles/HeaderAddStyle';

export default class HeaderAdd extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  render() {
    const { onPress } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress()}>
        <Image source={Images.addIcon} />
      </TouchableOpacity>
    );
  }
}
