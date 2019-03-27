import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  isNfcSupportedRequest: null,
  isNfcSupportedSuccess: ['isNfcSupported'],
  nfcRequest: ['openPaymentScreenOnSuccess'],
  nfcSuccess: ['data'],
  nfcFailure: null,
  nfcCancelRequest: null,
});

export const NfcTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  isNfcSupported: null,
});

/* ------------- Selectors ------------- */

export const NfcSelectors = {
  getData: state => state.nfc.data,
  isError: state => state.nfc.error,
  isNfcSupported: state => state.nfc.isNfcSupported,
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = state => state.merge({ data: null });

// successful api lookup
export const success = (state, { data }) => state.merge({ error: null, data });

// Something went wrong somewhere.
export const failure = state => state.merge({ error: true, data: null });

export const onIsNfcSupportedRequest = state => state.merge({ isNfcSupported: null });

export const onIsNfcSupportedSuccess = (state, { isNfcSupported }) =>
  state.merge({ isNfcSupported });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.NFC_REQUEST]: request,
  [Types.NFC_SUCCESS]: success,
  [Types.NFC_FAILURE]: failure,
  [Types.IS_NFC_SUPPORTED_REQUEST]: onIsNfcSupportedRequest,
  [Types.IS_NFC_SUPPORTED_SUCCESS]: onIsNfcSupportedSuccess,
});
