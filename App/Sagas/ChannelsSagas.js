import { map, pathOr, find, propEq, filter, isNil, isEmpty } from 'ramda';
import { call, put, select, all, takeLatest } from 'redux-saga/effects';
import { NavigationActions } from 'react-navigation';
import Errors, { handleLndResponseError } from '../Config/Errors';
import Types from '../Config/Types';
import ChannelsActions, { ChannelsSelectors, ChannelsTypes } from '../Redux/ChannelsRedux';
import { ChannelData, StreamData } from '../Realm';
import { showError } from '../Services/InformBox';
import { getContactByAddress, getBy } from '../Services/Search';
import { sortByProp } from '../Transforms/array';
import { showConfirmAsync, showConfirmOkAsync } from '../Services/Alert';
import UiActions from '../Redux/UiRedux';
import { Events, logEvent } from '../Services/Analytics';
import { delayForSagasRequest } from '../Services/Delay';
import { AccountSelectors } from '../Redux/AccountRedux';
import { isReallyEmpty } from '../Services/Utils';

const CHANNELS_OPEN_TIMEOUT = 180000;

export function* addPeer(api, { lightningId, host }) {
  let { response, error } = yield call(api.getPeers);
  if (!response || response.status !== 200) {
    return { response, error };
  }
  const payload = pathOr([], ['peers'], JSON.parse(response.bodyString));
  const peer = getBy(lightningId, 'pub_key', payload);
  if (peer) {
    return { response: { status: 200 } };
  }
  ({ response, error } = yield call(api.connectPeer, {
    addr: {
      pubkey: lightningId,
      host,
    },
  }));
  return { response, error };
}

export function* getChannels(api) {
  let namelessChannelsNum = 0;

  const localPendingOpenChannels = yield select(ChannelsSelectors.getPendingOpenChannels);

  const justOpenedChannels = [];

  console.log('Channel getChannels pendingChannels', localPendingOpenChannels);

  const mapChannel = (ch) => {
    const txid = ch.channel_point.split(':')[0];
    let dbChannel = ChannelData.getOne(txid);
    if (isNil(dbChannel)) {
      const localCh = find(it => it.remote_pubkey === ch.remote_node_pub, localPendingOpenChannels);
      if (localCh) {
        justOpenedChannels.push(localCh);

        dbChannel = {
          txid,
          name: localCh.name,
          created: localCh.created,
        };
        ChannelData.createOrUpdate(dbChannel);
      }
    }

    const name = dbChannel && dbChannel.name;
    if (!isNil(name) && !isEmpty(name)) {
      const matches = name.match(/^CHANNEL ([0-9]+)$/);
      if (matches != null && matches.length === 2) {
        namelessChannelsNum =
          matches[1] > namelessChannelsNum ? parseInt(matches[1], 10) : namelessChannelsNum;
      }
    }
    const created = (dbChannel && dbChannel.created) || Date.now();

    return {
      txid,
      name,
      created,
      channel_point: ch.channel_point,
      remote_pubkey: ch.remote_pubkey,
      active: ch.active || false,
      chan_id: ch.chan_id,
      capacity: parseInt(ch.capacity, 10),
      local_balance: parseInt(ch.local_balance || 0, 10),
      remote_balance: parseInt(ch.remote_balance || 0, 10),
    };
  };

  let { response, error } = yield call(api.getChannels);

  if (!response || response.status !== 200) {
    const err = handleLndResponseError(Errors.EXCEPTION_CHANNELS_GET_OPENED, response, error);
    showError(err);
    yield put(ChannelsActions.channelsFailure(err));
    return;
  }

  let payload = pathOr([], ['channels'], JSON.parse(response.bodyString));
  payload = map((p) => {
    const mappedChannel = mapChannel(p);
    const contact = getContactByAddress(p.remote_pubkey);
    return {
      ...mappedChannel,
      contact,
      type: Types.CHANNEL_OPEN,
    };
  }, payload);

  /*
   * chan_id - The first 3 bytes are the block height,
   * the next 3 the index within the block,
   * and the last 2 bytes are the output index for the channel.
   */
  let data = sortByProp('chan_id')(payload);

  ({ response, error } = yield call(api.getPendingChannels));
  if (!response || response.status !== 200) {
    const err = handleLndResponseError(Errors.EXCEPTION_CHANNELS_GET_PENDING, response, error);
    showError(err);
    yield put(ChannelsActions.channelsFailure(err));
    return;
  }

  payload = pathOr([], ['pending_open_channels'], JSON.parse(response.bodyString));

  payload = map((p) => {
    const mappedChannel = mapChannel(p.channel);
    const contact = getContactByAddress(p.channel.remote_node_pub);
    return {
      ...mappedChannel,
      contact,
      remote_pubkey: p.channel.remote_node_pub,
      type: Types.CHANNEL_PENDING,
    };
  }, payload);

  // filter expired pending channels
  const now = Date.now();
  const expiredPendingChannels = filter(
    ch => now - ch.created >= CHANNELS_OPEN_TIMEOUT,
    localPendingOpenChannels,
  );

  console.log('Channel getChannels openedPendingChannel', justOpenedChannels);
  console.log('Channel getChannels expiredPendingChannels', expiredPendingChannels);

  if (!isEmpty(expiredPendingChannels)) {
    showError(Errors.EXCEPTION_CHANNELS_OPEN);
  }

  data = map(
    (ch) => {
      const name = ch.name || `CHANNEL ${(namelessChannelsNum += 1)}`;
      return {
        ...ch,
        name,
      };
    },
    [...data, ...payload],
  );

  yield call([ChannelData, ChannelData.replaceAll], data);
  yield put(ChannelsActions.channelsSuccess(
    data,
    [...justOpenedChannels, ...expiredPendingChannels],
    namelessChannelsNum,
  ));
}

export function* createChannel(api, {
  name, amount, isCustom, lightningHost,
}) {
  yield delayForSagasRequest();

  const isSynced = yield select(AccountSelectors.isSynced);
  if (!isSynced) {
    yield put(ChannelsActions.channelsCreateFailure(Errors.EXCEPTION_NOT_SYNCED));
    return;
  }

  const serverLightningPeerAddress = yield select(AccountSelectors.getServerLightningPeerAddress);
  const [lightningId, host] = isCustom
    ? lightningHost.split('@')
    : serverLightningPeerAddress.split('@');

  const pendingOpenChannel = yield select(ChannelsSelectors.getPendingOpenChannel, lightningId);
  if (pendingOpenChannel) {
    const error = Errors.EXCEPTION_CHANNELS_OPEN_ALREADY_OPENING(lightningId);
    yield put(ChannelsActions.channelsCreateFailure(error));
    return;
  }

  let theName;
  if (!isReallyEmpty(name)) {
    theName = name;
  } else {
    const namelessChannelsNum = yield select(ChannelsSelectors.getNamelessChannelsNum);
    theName = `CHANNEL ${namelessChannelsNum + 1}`;
  }

  const channelData = {
    txid: lightningId,
    name: theName,
    created: Date.now(),
    channel_point: `${lightningId}:0`,
    capacity: amount,
    local_balance: amount,
    remote_balance: 0,
    contact: getContactByAddress(lightningId),
    active: false,
    remote_pubkey: lightningId,
    type: Types.CHANNEL_CONNECTING,
  };
  yield put(ChannelsActions.channelsCreateSuccess(channelData));
  console.log('Channel newPendingChannel', channelData);

  const { response, error } = yield call(addPeer, api, { lightningId, host });
  if (!response || response.status !== 200) {
    const err = handleLndResponseError(Errors.EXCEPTION_CHANNELS_ADD_PEER, response, error);
    showError(err);
    yield put(ChannelsActions.channelsRemovePending(channelData.channel_point));
    return;
  }

  yield call(api.createChannel, {
    node_pubkey_string: lightningId,
    local_funding_amount: amount,
  });
}

function* closeChannelAndCheck(api, txid, index, force) {
  let { response, error } = yield call(api.closeChannel, txid, index, force);
  if (response && response.status === 200) {
    response = JSON.parse(response.bodyString);
    ({ error } = response);
  }

  if (error) {
    // check whether channel exists
    ({ response, error } = yield call(api.getChannels));
    if (response && response.status === 200) {
      const openedChannels = pathOr([], ['channels'], JSON.parse(response.bodyString));
      const foundChannel = find(propEq('channel_point', `${txid}:${index}`), openedChannels);
      if (foundChannel) {
        return false;
      }
    }
  }

  return true;
}

export function* closeChannel(api, { name, txid, index }) {
  const runningStreams = yield call([StreamData, StreamData.getRunningOnly]);
  if (runningStreams.length > 0) {
    yield call(
      showConfirmOkAsync,
      `The stream payment ${
        runningStreams[0].name
      } is running. To close the channel please pause or stop the running stream.`,
    );
    return;
  }

  let { cancel } = yield call(
    showConfirmAsync,
    `Are you sure you want to close channel “${name}”?`,
  );

  if (cancel) {
    return;
  }

  yield put(UiActions.showLoading(true));
  const cooperativeCloseSuccess = yield call(closeChannelAndCheck, api, txid, index, false);
  yield put(UiActions.showLoading(false));

  if (!cooperativeCloseSuccess) {
    ({ cancel } = yield call(
      showConfirmAsync,
      `Cooperative close of "${name}" is failed. You can close channel
not cooperatively and receive your funds in 24 hours.`,
    ));

    if (cancel) {
      return;
    }

    logEvent(Events.ChannelCloseCooperatively);

    yield put(UiActions.showLoading(true));
    const nonCooperativeCloseSuccess = yield call(closeChannelAndCheck, api, txid, index, true);
    yield put(UiActions.showLoading(false));

    if (!nonCooperativeCloseSuccess) {
      const err = Errors.EXCEPTION_CHANNELS_CLOSE;
      showError(err);
      yield put(ChannelsActions.channelsDeleteFailure(err));
      return;
    }

    logEvent(Events.ChannelCloseNonCooperatively);
  } else {
    logEvent(Events.ChannelCloseCooperatively);
  }

  yield call([ChannelData, ChannelData.deleteOne], txid);
  yield put(ChannelsActions.channelsDeleteSuccess(txid));

  yield put(NavigationActions.navigate({
    routeName: 'Tabs',
  }));
}

export default function* saga(api) {
  yield all([
    takeLatest(ChannelsTypes.CHANNELS_REQUEST, getChannels, api),
    takeLatest(ChannelsTypes.CHANNELS_DELETE_REQUEST, closeChannel, api),
    takeLatest(ChannelsTypes.CHANNELS_CREATE_REQUEST, createChannel, api),
  ]);
}
