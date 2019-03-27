import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { concat } from 'ramda';
import { groupInvoices, groupPayments, flattenGroupInvoices } from '../Services/Streams';
import { transformLightningDataForPaymentsHistory } from '../Transforms/array';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  feeRequest: ['paymentType', 'idOrAddress', 'amount'],
  feeSuccess: ['fee'],
  feeFailure: ['errorFee'],

  pubkeyIdRequest: null,
  pubkeyIdSuccess: ['pubkeyId'],
  pubkeyIdFailure: ['errorPubkeyId'],

  lightningBalanceRequest: null,
  lightningBalanceSuccess: ['balance'],
  lightningBalanceFailure: ['errorBalance'],

  lightningLoadMoreHistoryRequest: ['lastVisibleDate'],
  lightningHistoryRequest: null,
  lightningHistorySuccess: null,
  lightningHistoryFailure: ['errorHistory'],

  lightningHistoryPaymentsUpdate: ['payments'],
  lightningHistoryInvoicesUpdate: ['invoices', 'invoicesOffset'],

  lightningSendPaymentRequest: [
    'name',
    'address',
    'amount',
    'amountUsd',
    'paymentType',
    'paymentData',
  ],
  lightningSendPaymentSuccess: ['payment'],
  lightningSendPaymentFailure: ['errorSendPayment'],

  lightningDecodePaymentRequest: ['payreq'],
  lightningDecodePaymentSuccess: ['decodedPayment'],
  lightningDecodePaymentFailure: ['errorDecodePayment'],

  lightningPaymentRequestRequest: ['amount'],
  lightningPaymentRequestSuccess: ['paymentRequest'],
  lightningPaymentRequestFailure: ['errorPaymentRequest'],

  setMaxPaymentSize: ['maxPaymentSize'],
});

export const LightningTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fee: null,
  errorFee: null,

  pubkeyId: null,
  errorPubkeyId: null,

  balance: 0,
  errorBalance: null,

  history: [],
  loadingMoreHistory: false,
  groupedRawInvoices: [],
  rawPayments: [],
  loadingHistory: false,
  invoicesOffset: 0,
  errorHistory: null,

  payment: null,
  errorSendPayment: null,

  decodePaymentProcessing: false,
  decodedPayment: null,
  errorDecodePayment: null,

  paymentRequest: null,
  errorPaymentRequest: null,

  maxPaymentSize: Number.MAX_SAFE_INTEGER,
});

/* ------------- Selectors ------------- */

export const LightningSelectors = {
  getHistory: state => state.lightning.history,
  getGroupedRawInvoices: state => state.lightning.groupedRawInvoices,
  getRawPayments: state => state.lightning.rawPayments,
  getFee: state => state.lightning.fee,
  getErrorFee: state => state.lightning.errorFee,
  getPubkeyId: state => state.lightning.pubkeyId,
  getMaxPaymentSize: state => state.lightning.maxPaymentSize,
  getDecodedPayment: state => state.lightning.decodedPayment,
  getDecodePaymentFailure: state => state.lightning.errorDecodePayment,
  getDecodePaymentProcessing: state => state.lightning.decodePaymentProcessing,
  getInvoicesOffset: state => state.lightning.invoicesOffset,
  isLoadingMoreHistory: state => state.lightning.loadingMoreHistory,
  canLoadMoreHistory: state => state.lightning.invoicesOffset > 1,
};

/* ------------- Reducers ------------- */
export const requestFee = state => state.merge({ fee: null, errorFee: null });
export const requestFeeSuccess = (state, { fee }) => state.merge({ fee });
export const requestFeeFailure = (state, { errorFee }) => state.merge({ fee: null, errorFee });

export const requestPubkeyId = state => state.merge({ errorPubkeyId: null });
export const successPubkeyId = (state, { pubkeyId }) => state.merge({ pubkeyId });
export const failurePubkeyId = (state, { errorPubkeyId }) => state.merge({ errorPubkeyId });

export const requestBalance = state => state.merge({ errorBalance: null });
export const successBalance = (state, { balance }) => state.merge({ balance });
export const failureBalance = (state, { errorBalance }) => state.merge({ errorBalance });

export const requestLoadMoreHistory = state => state.merge({ loadingMoreHistory: true });

export const requestHistory = state =>
  state.merge({
    errorHistory: null,
    loadingHistory: true,
    groupedRawInvoices: [],
    rawPayments: [],
  });
export const successHistory = (state) => {
  const rawInvoices = flattenGroupInvoices(state.groupedRawInvoices);
  const mergedRawData = concat(rawInvoices, state.rawPayments);
  const history = transformLightningDataForPaymentsHistory('date')(mergedRawData);
  return state.merge({
    history,
    loadingMoreHistory: false,
  });
};

export const onHistoryPaymentsUpdate = (state, { payments }) =>
  state.merge({
    rawPayments: groupPayments(payments),
  });

export const onHistoryInvoicesUpdate = (state, { invoices, invoicesOffset }) =>
  state.merge({
    groupedRawInvoices: groupInvoices(state.groupedRawInvoices)(invoices),
    invoicesOffset,
  });

export const failureHistory = (state, { errorHistory }) =>
  state.merge({ errorHistory, loadingMoreHistory: false });

export const requestSendPayment = state => state.merge({ errorSendPayment: null, payment: null });
export const successSendPayment = (state, { payment }) => state.merge({ payment });
export const failureSendPayment = (state, { errorSendPayment }) =>
  state.merge({ errorSendPayment });

export const requestDecodePayment = state =>
  state.merge({ decodePaymentProcessing: true, errorDecodePayment: null, decodedPayment: null });
export const successDecodePayment = (state, { decodedPayment }) =>
  state.merge({ decodePaymentProcessing: false, decodedPayment });
export const failureDecodePayment = (state, { errorDecodePayment }) =>
  state.merge({ decodePaymentProcessing: false, errorDecodePayment });

export const requestPaymentRequest = state =>
  state.merge({ paymentRequest: null, errorPaymentRequest: null });
export const successPaymentRequest = (state, { paymentRequest }) => state.merge({ paymentRequest });
export const failurePaymentRequest = (state, { errorPaymentRequest }) =>
  state.merge({ errorPaymentRequest });

export const onSetMaxPaymentSize = (state, { maxPaymentSize }) => state.merge({ maxPaymentSize });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEE_REQUEST]: requestFee,
  [Types.FEE_SUCCESS]: requestFeeSuccess,
  [Types.FEE_FAILURE]: requestFeeFailure,

  [Types.PUBKEY_ID_REQUEST]: requestPubkeyId,
  [Types.PUBKEY_ID_SUCCESS]: successPubkeyId,
  [Types.PUBKEY_ID_FAILURE]: failurePubkeyId,

  [Types.LIGHTNING_BALANCE_REQUEST]: requestBalance,
  [Types.LIGHTNING_BALANCE_SUCCESS]: successBalance,
  [Types.LIGHTNING_BALANCE_FAILURE]: failureBalance,

  [Types.LIGHTNING_LOAD_MORE_HISTORY_REQUEST]: requestLoadMoreHistory,
  [Types.LIGHTNING_HISTORY_REQUEST]: requestHistory,
  [Types.LIGHTNING_HISTORY_SUCCESS]: successHistory,
  [Types.LIGHTNING_HISTORY_FAILURE]: failureHistory,
  [Types.LIGHTNING_HISTORY_PAYMENTS_UPDATE]: onHistoryPaymentsUpdate,
  [Types.LIGHTNING_HISTORY_INVOICES_UPDATE]: onHistoryInvoicesUpdate,

  [Types.LIGHTNING_SEND_PAYMENT_REQUEST]: requestSendPayment,
  [Types.LIGHTNING_SEND_PAYMENT_SUCCESS]: successSendPayment,
  [Types.LIGHTNING_SEND_PAYMENT_FAILURE]: failureSendPayment,

  [Types.LIGHTNING_DECODE_PAYMENT_REQUEST]: requestDecodePayment,
  [Types.LIGHTNING_DECODE_PAYMENT_SUCCESS]: successDecodePayment,
  [Types.LIGHTNING_DECODE_PAYMENT_FAILURE]: failureDecodePayment,

  [Types.LIGHTNING_PAYMENT_REQUEST_REQUEST]: requestPaymentRequest,
  [Types.LIGHTNING_PAYMENT_REQUEST_SUCCESS]: successPaymentRequest,
  [Types.LIGHTNING_PAYMENT_REQUEST_FAILURE]: failurePaymentRequest,

  [Types.SET_MAX_PAYMENT_SIZE]: onSetMaxPaymentSize,
});
