// a library to wrap and simplify api calls
import apisauce from 'apisauce';
import { cloneDeep } from 'lodash';
import pinch from '../Lib/react-native-pinch';
import AppConfig, { getHeightUri } from '../Config/AppConfig';

const prefix = 'v1';

// our "constructor"
const create = (baseURL = 'https://') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
    },
    // 10 second timeout...
    timeout: AppConfig.defaultApiTimeout,
  });

  const apiPinch = {
    host: baseURL,
    config: {
      // base method
      method: 'get',
      // here are some default headers
      headers: {
        'Grpc-Metadata-macaroon': null,
      },
      // 10 second timeout...
      timeoutInterval: AppConfig.defaultApiTimeout,
      // TLS
      sslPinning: {
        cert: null,
      },
    },
  };

  const getLnd = url =>
    pinch
      .fetch(`${apiPinch.host}${prefix}/${url}`, cloneDeep(apiPinch.config))
      .then(response => ({ response }))
      .catch(error => ({ error }));

  const deleteLnd = (url, data = {}, timeout = AppConfig.defaultApiTimeout) => {
    const deleteConfig = cloneDeep({
      ...apiPinch.config,
      timeoutInterval: timeout,
      method: 'delete',
      body: JSON.stringify(data),
    });

    return pinch
      .fetch(`${apiPinch.host}${prefix}/${url}`, deleteConfig)
      .then(response => ({ response }))
      .catch(error => ({ error }));
  };

  const postLnd = (url, data = {}, timeout = AppConfig.defaultApiTimeout) => {
    const postConfig = cloneDeep({
      ...apiPinch.config,
      timeoutInterval: timeout,
      method: 'post',
      body: JSON.stringify(data),
    });

    return pinch
      .fetch(`${apiPinch.host}${prefix}/${url}`, postConfig)
      .then(response => ({ response }))
      .catch(error => ({ error }));
  };

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //

  const setHeaders = (macaroon) => {
    apiPinch.config.headers['Grpc-Metadata-macaroon'] = macaroon;
  };

  const setBaseUrl = (url) => {
    let host = url;

    if (url.substr(-1) !== '/') host += '/';

    apiPinch.host = host;
  };

  const setTLS = (cert) => {
    apiPinch.config.sslPinning.cert = cert;
  };

  const currentUsdPerBtcRate = () => api.get(AppConfig.btcUsdRateApiUrl);

  const getBlockchainHeight = isTestnet => api.get(getHeightUri(isTestnet));

  // GET
  const newBitcoinAddress = () => getLnd('newaddress?type=1');
  const getInfo = () => getLnd('getinfo');
  const getChannelsBalance = () => getLnd('balance/channels');
  const getBlockchainBalance = () => getLnd('balance/blockchain');
  const getTransactions = () => getLnd('transactions');
  const getInvoices = indexOffset =>
    getLnd(`invoices?reversed=true${indexOffset ? `&index_offset=${indexOffset}` : ''}`);
  const getPayments = () => getLnd('payments');
  const decodePayment = val => getLnd(`payreq/${val}`);
  const getChannels = () => getLnd('channels');
  const getPendingChannels = () => getLnd('channels/pending');
  const getPeers = () => getLnd('peers');
  const getRoutes = (id, amount) => getLnd(`graph/routes/${id}/${amount}/10`);

  // POST
  const sendCoins = (addr, amount) => postLnd('transactions', { addr, amount });
  const sendLightningPayment = paymentRequest =>
    postLnd('channels/transactions', { payment_request: paymentRequest });
  const sendLightningPaymentAmt = (paymentRequest, amt) =>
    postLnd('channels/transactions', {
      payment_request: paymentRequest,
      amt,
    });
  const createChannel = body => postLnd('channels', body, 0);
  const connectPeer = body => postLnd('peers', body);
  const addInvoice = body => postLnd('invoices', body);
  const signMessage = body => postLnd('signmessage', body);
  const verifyMessage = body => postLnd('verifymessage', body);
  const getFeeRate = (addr, amount, targetConf) =>
    postLnd('transactions/fee', {
      AddrToAmount: { [addr]: amount },
      target_conf: targetConf,
    });

  // DELETE
  const closeChannel = (txid, index, force = false) =>
    deleteLnd(`channels/${txid}/${index}/${force}`);

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //

  return {
    // a list of the API functions from step 2
    setHeaders,
    setBaseUrl,
    setTLS,

    // GET
    currentUsdPerBtcRate,
    getBlockchainHeight,
    newBitcoinAddress,
    getInfo,
    getChannelsBalance,
    getBlockchainBalance,
    getTransactions,
    getInvoices,
    getPayments,
    decodePayment,
    getChannels,
    getPendingChannels,
    getPeers,
    getRoutes,

    // POST
    sendCoins,
    sendLightningPayment,
    sendLightningPaymentAmt,
    connectPeer,
    createChannel,
    addInvoice,
    signMessage,
    verifyMessage,
    getFeeRate,

    // DELETE
    closeChannel,
  };
};

// let's return back our create method as the default.
export default {
  create,
};
