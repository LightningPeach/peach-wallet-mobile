import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AppNavigation from './AppNavigation';
import { isIOS } from '../Themes';

class ReduxNavigation extends Component {
  static propTypes = {
    dispatch: PropTypes.any.isRequired,
    nav: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.ReduxAppNavigation = reduxifyNavigator(AppNavigation, 'root');
  }

  componentDidMount() {
    if (isIOS) return;

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props;
      // change to whatever is your first screen, otherwise unpredictable results may occur
      if (nav.routes.length === 1 && nav.routes[0].routeName === 'Main') {
        return false;
      }

      const { params } = AppNavigation.router.getPathAndParamsForState(nav);
      if (params && params.goBack) {
        params.goBack();
      } else {
        // if (shouldCloseApp(nav)) return false
        dispatch(NavigationActions.back());
      }

      return true;
    });
  }

  componentWillUnmount() {
    if (isIOS) return;

    this.backHandler.remove();
  }

  render() {
    const { dispatch, nav } = this.props;
    return <this.ReduxAppNavigation dispatch={dispatch} state={nav} />;
  }
}

const mapStateToProps = state => ({ nav: state.nav });
export default connect(mapStateToProps)(ReduxNavigation);
