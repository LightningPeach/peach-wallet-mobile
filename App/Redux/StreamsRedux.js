import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  streamsAddRequest: ['name', 'price', 'totalTime', 'destination'],
  streamsAddSuccess: ['id'],
  streamsAddFailure: ['error'],

  updateStatusRequest: ['id', 'status'],
});

export const StreamsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  createStreamId: null,
  createStreamRequest: false,
  createStreamError: null,
});

/* ------------- Reducers ------------- */

export const requestStreamCreate = state =>
  state.merge({ createStreamRequest: true, createStreamId: null, createStreamError: null });
export const successStreamCreate = (state, { id }) =>
  state.merge({ createStreamRequest: false, createStreamId: id });
export const failureStreamCreate = (state, { error }) =>
  state.merge({ createStreamRequest: false, createStreamError: error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STREAMS_ADD_REQUEST]: requestStreamCreate,
  [Types.STREAMS_ADD_SUCCESS]: successStreamCreate,
  [Types.STREAMS_ADD_FAILURE]: failureStreamCreate,
});
