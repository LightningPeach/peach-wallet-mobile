import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import merge from 'deepmerge';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  resetToField: null,
  handleToFieldValueChange: ['value', 'paymentType', 'paymentSubType'],
  handleToFieldValueChangeSuccess: ['decodedPaymentRequest'],
  handleToFieldValueChangeError: ['error'],
});

export const PaymentCreateScreenTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  toField: undefined,
});

/* ------------- Selectors ------------- */

export const PaymentCreateScreenSelectors = {
  getToField: state => state.paymentCreateScreen.toField,
};

/* ------------- Reducers ------------- */
export const onHandleToFieldValueChangeSuccess = (state, { decodedPaymentRequest }) =>
  merge(state, { toField: { decodedPaymentRequest, processing: false } });

export const onHandleToFieldValueChangeError = (state, { error }) =>
  merge(state, { toField: { error, processing: false } });

export const onHandleToFieldValueChange = (state, { value, paymentType }) =>
  merge(state, {
    toField: {
      paymentType,
      value,
      decodedPaymentRequest: undefined,
      error: undefined,
      processing: true,
    },
  });

export const onResetToField = state => merge(state, { toField: undefined });
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESET_TO_FIELD]: onResetToField,
  [Types.HANDLE_TO_FIELD_VALUE_CHANGE_SUCCESS]: onHandleToFieldValueChangeSuccess,
  [Types.HANDLE_TO_FIELD_VALUE_CHANGE_ERROR]: onHandleToFieldValueChangeError,
  [Types.HANDLE_TO_FIELD_VALUE_CHANGE]: onHandleToFieldValueChange,
});
