import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ViewPropTypes, Image, StyleSheet } from 'react-native';

import { Metrics, isIOS } from '../Themes';
import Text from './Text';
import styles from './Styles/ButtonStyle';

export default class Button extends Component {
  // Prop type warnings
  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    disabled: PropTypes.bool,
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    inline: PropTypes.bool,
    image: Image.propTypes.source,
  };

  // Defaults for props
  static defaultProps = {
    style: {},
    textStyle: {},
    disabled: false,
    inline: !isIOS,
    image: undefined,
  };

  getContainerClass = () => {
    const { inline, disabled, style } = this.props;
    const classes = [];
    if (!inline) {
      classes.push(styles.container, disabled ? styles.disabled : {}, style);
    } else {
      classes.push(styles.containerInline, style);
    }
    return classes;
  };

  getTextClass = () => {
    const { inline, disabled, textStyle } = this.props;
    const classes = [];
    if (!inline) {
      classes.push(styles.titleText, disabled ? styles.disabledText : {}, textStyle);
    } else {
      classes.push(styles.titleTextInline, disabled ? styles.disabledTextInline : {}, textStyle);
    }
    return classes;
  };

  render() {
    const {
      title, onPress, disabled, image,
    } = this.props;

    const textClass = this.getTextClass();
    const tintColor = StyleSheet.flatten(textClass).color;

    return (
      <TouchableOpacity
        disabled={disabled}
        style={this.getContainerClass()}
        activeOpacity={Metrics.activeOpacity}
        onPress={() => onPress()}
      >
        {image && <Image source={image} style={[styles.image, { tintColor }]} />}
        <Text style={this.getTextClass()}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
