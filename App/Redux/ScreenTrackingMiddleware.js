import { NavigationActions, StackActions } from 'react-navigation';
import { NavigationTypes } from '../Redux/NavigationRedux';
import { SessionTypes } from '../Redux/SessionRedux';

import { logNavigation, getCurrentRouteName } from '../Services/Analytics';

const ScreenTrackingMiddleware = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK &&
    action.type !== StackActions.POP &&
    action.type !== StackActions.POP_TO_TOP &&
    action.type !== StackActions.PUSH &&
    action.type !== StackActions.RESET &&
    action.type !== StackActions.REPLACE &&
    action.type !== NavigationTypes.GO_BACK_AND_PUSH &&
    action.type !== SessionTypes.SESSION_START &&
    action.type !== SessionTypes.SESSION_STOP
  ) {
    return next(action);
  }

  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);
  if (nextScreen !== currentScreen) {
    try {
      logNavigation(currentScreen, nextScreen);
    } catch (e) {
      console.log(e);
    }
  }
  return result;
};

export default ScreenTrackingMiddleware;
