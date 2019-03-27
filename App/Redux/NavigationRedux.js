import { NavigationActions, StackActions } from 'react-navigation';
import { find } from 'ramda';

import { createActions } from 'reduxsauce';
import AppNavigation from '../Navigation/AppNavigation';
import { SessionTypes } from '../Redux/SessionRedux';
import { isRouteActive } from '../Navigation/Utils';
import { AccountTypes } from './AccountRedux';

const { Types, Creators } = createActions({
  goBackAndPush: ['backRouteName', 'pushRouteName', 'pushRouteParams'],
});

export const NavigationTypes = Types;
export default Creators;

/* ------------- Selectors ------------- */

export const NavigationSelectors = {
  isTabsVisible: state => isRouteActive('Tabs', state.nav),
};

const goToTabs = state =>
  AppNavigation.router.getStateForAction(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
      key: null,
    }),
    state,
  );

const onSessionStop = state =>
  AppNavigation.router.getStateForAction(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'UnlockPinScreen' })],
      key: null,
    }),
    state,
  );

const onGoBackAndPush = (state, { backRouteName, pushRouteName, pushRouteParams }) => {
  let newState = state;

  const foundBackRoute = find(route => route.routeName === backRouteName, state.routes);
  if (foundBackRoute) {
    newState = AppNavigation.router.getStateForAction(
      NavigationActions.back({
        key: foundBackRoute.key,
      }),
      newState,
    );
  }

  if (pushRouteName) {
    newState = AppNavigation.router.getStateForAction(
      StackActions.push({
        routeName: pushRouteName,
        params: pushRouteParams,
      }),
      newState,
    );
  }

  return newState;
};

export const reducer = (state, action) => {
  switch (action.type) {
    case AccountTypes.CONNECT_NODE_SUCCESS:
    case AccountTypes.UNLOCK_SUCCESS:
      return goToTabs(state);
    case SessionTypes.SESSION_STOP:
      return onSessionStop(state);
    case Types.GO_BACK_AND_PUSH:
      return onGoBackAndPush(state, action);
    default: {
      const newState = AppNavigation.router.getStateForAction(action, state);
      return newState || state;
    }
  }
};
