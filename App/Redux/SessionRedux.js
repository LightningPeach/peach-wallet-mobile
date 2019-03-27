import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  sessionStart: null,
  sessionStop: null,
});

export const SessionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  sessionActive: false,
});

/* ------------- Selectors ------------- */

export const SessionSelectors = {
  isSessionActive: state => state.session.sessionActive,
};

/* ------------- Reducers ------------- */

export const onSessionStart = state => state.merge({ sessionActive: true });

export const onSessionStop = state => state.merge({ sessionActive: false });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SESSION_START]: onSessionStart,
  [Types.SESSION_STOP]: onSessionStop,
});
