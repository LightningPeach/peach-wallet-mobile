import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addressRequest: null,
  newAddressRequest: null,
  addressSuccess: ['address'],
  addressFailure: ['errorAddress'],

  onchainBalanceRequest: null,
  onchainBalanceSuccess: ['balance', 'unconfirmedBalance'],
  onchainBalanceFailure: ['errorBalance'],

  onchainHistoryRequest: null,
  onchainHistorySuccess: ['history'],
  onchainHistoryFailure: ['errorHistory'],

  onchainSendCoinsRequest: ['name', 'address', 'amount', 'amountUsd', 'paymentType'],
  onchainSendCoinsSuccess: ['payment'],
  onchainSendCoinsFailure: ['errorSendCoins'],
});

export const OnchainTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  address: null,
  errorAddress: null,

  balance: 0,
  unconfirmedBalance: 0,
  errorBalance: null,

  history: [],
  errorHistory: null,

  payment: null,
  errorSendCoins: null,
});

/* ------------- Selectors ------------- */

export const OnchainSelectors = {
  getHistory: state => state.onchain.history,
  getAddress: state => state.onchain.address,
};

/* ------------- Reducers ------------- */

export const requestAddress = state => state.merge({ errorAddress: null });
export const successAddress = (state, { address }) => state.merge({ address });
export const failureAddress = (state, { errorAddress }) => state.merge({ errorAddress });

export const requestBalance = state => state.merge({ errorBalance: null });
export const successBalance = (state, { balance, unconfirmedBalance }) =>
  state.merge({ balance, unconfirmedBalance });
export const failureBalance = (state, { errorBalance }) => state.merge({ errorBalance });

export const requestHistory = state => state.merge({ errorHistory: null });
export const successHistory = (state, { history }) => state.merge({ history });
export const failureHistory = (state, { errorHistory }) => state.merge({ errorHistory });

export const requestSendCoins = state => state.merge({ errorSendCoins: null, payment: null });
export const successSendCoins = (state, { payment }) => state.merge({ payment });
export const failureSendCoins = (state, { errorSendCoins }) => state.merge({ errorSendCoins });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADDRESS_REQUEST]: requestAddress,
  [Types.NEW_ADDRESS_REQUEST]: requestAddress,
  [Types.ADDRESS_SUCCESS]: successAddress,
  [Types.ADDRESS_FAILURE]: failureAddress,

  [Types.ONCHAIN_BALANCE_REQUEST]: requestBalance,
  [Types.ONCHAIN_BALANCE_SUCCESS]: successBalance,
  [Types.ONCHAIN_BALANCE_FAILURE]: failureBalance,

  [Types.ONCHAIN_HISTORY_REQUEST]: requestHistory,
  [Types.ONCHAIN_HISTORY_SUCCESS]: successHistory,
  [Types.ONCHAIN_HISTORY_FAILURE]: failureHistory,

  [Types.ONCHAIN_SEND_COINS_REQUEST]: requestSendCoins,
  [Types.ONCHAIN_SEND_COINS_SUCCESS]: successSendCoins,
  [Types.ONCHAIN_SEND_COINS_FAILURE]: failureSendCoins,
});
