import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  usdPerBtcRequest: null,
  usdPerBtcSuccess: ['usdPerBtc'],
  usdPerBtcFailure: ['errorUsdPerBtc'],
});

export const CurrenciesTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  usdPerBtc: '0',
  errorUsdPerBtc: null,
});

/* ------------- Selectors ------------- */

export const CurrenciesSelectors = {
  getData: state => state.data,
};

/* ------------- Reducers ------------- */

// request the data from an api
export const requestUsdPerBtc = state => state.merge({ errorUsdPerBtc: null });

// successful api lookup
export const successUsdPerBtc = (state, { usdPerBtc }) => state.merge({ usdPerBtc });

// Something went wrong somewhere.
export const failureUsdPerBtc = (state, { errorUsdPerBtc }) => state.merge({ errorUsdPerBtc });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USD_PER_BTC_REQUEST]: requestUsdPerBtc,
  [Types.USD_PER_BTC_SUCCESS]: successUsdPerBtc,
  [Types.USD_PER_BTC_FAILURE]: failureUsdPerBtc,
});
