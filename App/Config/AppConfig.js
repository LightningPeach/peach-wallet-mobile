import DebugNetConfig from './DebugNetConfig';
import { isIOS } from '../Themes';
// eslint-disable-next-line no-unused-vars
const networkProd = {
  isSimnet: false,
  host: '',
  tlcCert: '',
  macaroons: '',
};

const AppConfig = {
  network: __DEV__ ? DebugNetConfig : networkProd,
  // font scaling override - RN default is on
  allowTextFontScaling: false,
  messageBoxDuration: 5 * 1000, // 5 sec
  reactivateTimeout: 2 * 1000, // 2 sec
  requestInterval: 30 * 1000, // 30 sec
  lisTLS: true,
  lisInvoiceCheckRetries: 40,
  lisInvoiceCheckInterval: 250,
  checkInternetTimeout: 10 * 1000, // 10 sec
  minimumDelay: 250,
  onchainCurrency: 'bitcoin',
  // from desktop app
  minChannelSize: 2e4,
  // See {@link https://github.com/lightningnetwork/lightning-rfc/blob/master/02-peer-protocol.md#requirements|Github LND BOLT-2}
  // eslint-disable-next-line no-restricted-properties
  maxChannelSize: Math.pow(2, 24), // maximum channel size must be less than 2^24 satoshi
  lightningPaymentName: 'Outgoing payment',
  lightningInvoiceName: 'Incoming payment',
  outgoingStreamName: 'Outgoing stream payment',
  incomingStreamName: 'Incoming stream payment',
  onchainPaymentName: 'Regular payment',
  // See {@link https://github.com/lightningnetwork/lnd/blob/21841c9f6b065a625e5dcb68c18dfbf3ee25326b/rpcserver.go#L43|Github LND}
  // eslint-disable-next-line no-mixed-operators
  maxPaymentRequest: Math.round(2 ** 32),
  // grabbed from desktop app
  onchainFee: 11468,
  defaultApiTimeout: 30 * 1000, // 10 sec
  dialogWaitingTimeout: 30 * 1000, // 30 sec
  clickDebounceTimeout: 200, // ms
  paymentRequestLength: 124,
  maxErrorLength: 100,
  pinLength: 6,
  supportEmail: 'hello@lightningpeach.com',
  peachPublicNode1mlUrl:
    'https://1ml.com/node/02a0bc43557fae6af7be8e3a29fdebda819e439bea9c0f8eb8ed6a0201f3471ca9',
  desctopWalletUrl: 'https://lightningpeach.com/peach-wallet',
  btcUsdRateUrl: 'https://www.blockchain.com/prices',
  btcUsdRateApiUrl: 'https://blockchain.info/ru/ticker',
  guideUrl: 'https://github.com/LightningPeach/lnd-gc-deploy',
  lndRestartUrl:
    'https://github.com/LightningPeach/lnd-gc-deploy/blob/master/README.md#how-to-restart-lnd',
  licenseTexts: [
    {
      title: 'Privacy Policy',
      html: isIOS
        ? require('../Html/PrivacyPolicy.html')
        : { uri: 'file:///android_asset/html/PrivacyPolicy.html' },
    },
    {
      title: 'Terms and Conditions',
      html: isIOS ? require('../Html/toc.html') : { uri: 'file:///android_asset/html/toc.html' },
    },
  ],
  openChannelTargetConf: 3,
  sendBitcoinsTargetConf: 3,
  policyVersion: 2,
  policyDate: '25.03.2019',
  lndSyncInterval: 10000,
  lisReconnectTimeout: 3000,
};

export const getServerLightningPeerAddress = (isTestNet) => {
  if (isTestNet || AppConfig.network.isSimnet) {
    return '0389a4d10d30e6176ea7cd0a7060344108061fc9ca88b02fa52dacea4b0114b316@testnetwallet.lightningpeach.com:9735';
  }
  return '02a0bc43557fae6af7be8e3a29fdebda819e439bea9c0f8eb8ed6a0201f3471ca9@hub.lightningpeach.com:29735';
};

export const getLisServer = (isTestNet) => {
  if (isTestNet || AppConfig.network.isSimnet) {
    return 'testnetwallet.lightningpeach.com';
  }
  return 'proxy.lightningpeach.com:7000';
};

export const getHeightUri = (isTestNet) => {
  if (isTestNet) {
    return 'https://testnetwallet.lightningpeach.com/height';
  }

  return 'https://proxy.lightningpeach.com:7000/height';
};

export default AppConfig;
