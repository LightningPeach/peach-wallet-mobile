import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BaseFlashMessage from 'react-native-flash-message';
import { Metrics } from '../Themes';
import styles from './Styles/FlashMessageStyle';
import Config from '../Config/AppConfig';
import { NavigationSelectors } from '../Redux/NavigationRedux';

class FlashMessage extends Component {
  static propTypes = {
    ...BaseFlashMessage.propTypes,
    isTabsVisible: PropTypes.bool.isRequired,
  };

  render() {
    let bottom;
    if (this.props.isTabsVisible) {
      bottom = Metrics.tabBarHeight;
    } else {
      bottom = 0;
    }

    return (
      <BaseFlashMessage
        duration={Config.messageBoxDuration}
        style={styles.flashMessage}
        titleStyle={styles.titleStyle}
        position={{
          bottom,
        }}
      />
    );
  }
}

const mapStateToProps = state => ({ isTabsVisible: NavigationSelectors.isTabsVisible(state) });
export default connect(mapStateToProps)(FlashMessage);
