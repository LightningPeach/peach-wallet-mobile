import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import styles from './Styles/EmptyListPlaceholderStyle';

import Text from '../Components/Text';

export default class EmptyListPlaceholder extends Component {
  static propTypes = {
    imageSource: PropTypes.number.isRequired,
    imageStyle: Image.propTypes.style,
    infoText: PropTypes.string.isRequired,
  };

  static defaultProps = {
    imageStyle: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={this.props.imageSource} style={[styles.image, this.props.imageStyle]} />
        <Text style={styles.infoText}>{this.props.infoText}</Text>
      </View>
    );
  }
}
