import { createReducer, createActions } from 'reduxsauce';
import { filter, find, reject, contains, __, isEmpty } from 'ramda';
import Immutable from 'seamless-immutable';
import AppTypes from '../Config/Types';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  channelsRequest: null,
  channelsSuccess: ['channels', 'invalidPendingChannels', 'namelessChannelsNum'],
  channelsFailure: null,

  channelsDeleteRequest: ['name', 'txid', 'index'],
  channelsDeleteSuccess: ['txid'],
  channelsDeleteFailure: ['errorChannelsDelete'],

  channelsCreateRequest: ['name', 'amount', 'isCustom', 'lightningHost'],
  channelsCreateSuccess: ['channelData'],
  channelsCreateFailure: ['createChannelError'],
  channelsRemovePending: ['channelPoint'],
});

export const ChannelsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  channels: [],
  pendingOpenChannels: [],
  errorChannels: null,

  errorChannelsDelete: null,

  createChannelRequest: false,
  createChannelError: null,
  namelessChannelsNum: 0,
});

/* ------------- Selectors ------------- */

export const ChannelsSelectors = {
  getChannels: state => state.channels.channels,
  getChannelDeleteError: state => state.channels.errorChannelsDelete,
  getPendingOpenChannels: state => state.channels.pendingOpenChannels,
  isPendingChannelsNotEmpty: state => !isEmpty(state.channels.pendingOpenChannels),
  getPendingOpenChannel: (state, remoteId) =>
    find(ch => ch.remote_pubkey === remoteId, state.channels.pendingOpenChannels),
  getNamelessChannelsNum: state => state.channels.namelessChannelsNum,
};

/* ------------- Reducers ------------- */

export const requestChannels = state => state.merge({ errorChannels: null });

export const successChannels = (
  state,
  { channels, invalidPendingChannels, namelessChannelsNum },
) => {
  const pendingOpenChannels = reject(
    contains(__, invalidPendingChannels),
    state.pendingOpenChannels,
  );
  return state.merge({
    channels: [...channels, ...pendingOpenChannels],
    pendingOpenChannels,
    namelessChannelsNum,
  });
};

export const failureChannels = (state, { errorChannels }) => state.merge({ errorChannels });

export const requestChannelsDelete = state => state.merge({ errorChannelsDelete: null });

export const successChannelsDelete = (state, { txid }) =>
  state.merge({
    channels: filter(ch => !ch.channel_point.includes(txid), state.channels),
  });
export const failureChannelsDelete = (state, { errorChannelsDelete }) =>
  state.merge({
    errorChannelsDelete,
  });

export const requestChannelsCreate = state =>
  state.merge({ createChannelRequest: true, createChannelError: null });

export const successChannelsCreate = (state, { channelData }) =>
  state.merge({
    createChannelRequest: false,
    pendingOpenChannels: [...state.pendingOpenChannels, channelData],
    channels: [...state.channels, channelData],
  });
export const failureChannelsCreate = (state, { createChannelError }) =>
  state.merge({ createChannelRequest: false, createChannelError });

export const onChannelRemovePending = (state, { channelPoint }) => {
  const pendingOpenChannels = reject(
    ch => ch.channel_point === channelPoint && ch.type === AppTypes.CHANNEL_CONNECTING,
    state.pendingOpenChannels,
  );
  const channels = reject(
    ch => ch.channel_point === channelPoint && ch.type === AppTypes.CHANNEL_CONNECTING,
    state.channels,
  );
  return state.merge({
    pendingOpenChannels,
    channels,
  });
};
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANNELS_REQUEST]: requestChannels,
  [Types.CHANNELS_SUCCESS]: successChannels,
  [Types.CHANNELS_FAILURE]: failureChannels,

  [Types.CHANNELS_DELETE_REQUEST]: requestChannelsDelete,

  [Types.CHANNELS_DELETE_SUCCESS]: successChannelsDelete,
  [Types.CHANNELS_DELETE_FAILURE]: failureChannelsDelete,

  [Types.CHANNELS_CREATE_REQUEST]: requestChannelsCreate,
  [Types.CHANNELS_CREATE_SUCCESS]: successChannelsCreate,
  [Types.CHANNELS_CREATE_FAILURE]: failureChannelsCreate,
  [Types.CHANNELS_REMOVE_PENDING]: onChannelRemovePending,
});
