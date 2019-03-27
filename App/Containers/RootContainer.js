import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, StatusBar, AppState } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

import Config from '../Config/AppConfig';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { showError } from '../Services/InformBox';
import { UiSelectors } from '../Redux/UiRedux';
import AppStateActions from '../Redux/AppStateRedux';
import FlashMessage from '../Components/FlashMessage';

// Styles
import styles from './Styles/RootContainerStyles';
import { Colors } from '../Themes';

class RootContainer extends Component {
  static propTypes = {
    isConnected: PropTypes.bool,
    isShowLoading: PropTypes.bool,
    appForeground: PropTypes.func.isRequired,
    appBackground: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isConnected: false,
    isShowLoading: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      lastTimeShowError: moment(),
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    /*
      Don't display network error:
        - in Active mode;
        - the error is shown before waiting timeout.
    */
    if (
      prevProps.isConnected &&
      !this.props.isConnected &&
      this.state.appState === 'active' &&
      moment().diff(moment(this.state.lastTimeShowError).add(Config.dialogWaitingTimeout, 'ms')) > 0
    ) {
      this.setState({ lastTimeShowError: moment() }, () => {
        showError('Network error');
      });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      this.props.appForeground();
    } else if (this.state.appState.match(/inactive|active/) && nextAppState === 'background') {
      console.log('App has come to the background!');
      this.props.appBackground();
    }

    this.setState({ appState: nextAppState });
  };

  render() {
    const { isShowLoading } = this.props;
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="light-content" />
        <ReduxNavigation />
        <FlashMessage />
        <Spinner visible={isShowLoading} color={Colors.orange} overlayColor={Colors.searchShadow} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  isShowLoading: UiSelectors.isShowLoading(state),
});

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  appForeground: () => dispatch(AppStateActions.appForeground()),
  appBackground: () => dispatch(AppStateActions.appBackground()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RootContainer);
