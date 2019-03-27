import React, { Component } from 'react';
import { TextInput as RNTextInput, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '../Themes';
import styles from './Styles/TextInputStyle';
import AppConfig from '../Config/AppConfig';

export default class TextInput extends Component {
  static propTypes = {
    // "link" instead "ref" props
    link: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    extraStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    link: null,
    extraStyle: null,
  };

  render() {
    return (
      <RNTextInput
        ref={(ref) => {
          if (this.props.link) this.props.link(ref);
        }}
        allowFontScaling={AppConfig.allowFontScaling}
        style={[styles.textInput, this.props.extraStyle]}
        placeholderTextColor={Colors.darkGray}
        selectionColor={Colors.orange}
        keyboardAppearance="dark"
        {...this.props}
      />
    );
  }
}
