import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, ApplicationStyles } from '../Themes';

export const TOP = 'top';
export const BOTTOM = 'bottom';

class ShadowComponent extends Component {
  static propTypes = {
    type: PropTypes.oneOf([TOP, BOTTOM]),
  };

  static defaultProps = {
    type: BOTTOM,
  };

  render() {
    let startObj;
    let endObj;
    if (this.props.type === BOTTOM) {
      startObj = { x: 0.5, y: 1 };
      endObj = { x: 0.5, y: 0 };
    } else {
      startObj = { x: 0.5, y: 0 };
      endObj = { x: 0.5, y: 1 };
    }
    return (
      <LinearGradient
        start={startObj}
        end={endObj}
        colors={[Colors.white12, Colors.transparent]}
        style={ApplicationStyles.screen.bottomShadowDivider}
      />
    );
  }
}

export default ShadowComponent;
