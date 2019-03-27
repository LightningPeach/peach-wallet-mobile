import React, { Component } from 'react';
import { Text as BaseText } from 'react-native';
import AppConfig from '../Config/AppConfig';

class Text extends Component {
  static propTypes = {
    ...BaseText.propTypes,
  }

  render() {
    return (
      <BaseText allowFontScaling={AppConfig.allowFontScaling} {...this.props} />
    );
  }
}

export default Text;
