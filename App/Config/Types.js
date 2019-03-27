import PropTypes from 'prop-types';

const FLOAT_NUMBER_PROPS = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

// Crypto
const LIGHTNING = 'lightning';
const ONCHAIN = 'onchain';

// Contacts
const CONTACTS_PROPS = PropTypes.shape({
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
});

// Navigation
const NAVIGATION_PROPS = (params = PropTypes.shape({})) =>
  PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    isFocused: PropTypes.func.isRequired,
    state: PropTypes.shape({ params }).isRequired,
    setParams: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  });

// Payment status
const SUCCESS = 'success';
const ERROR = 'error';
const INCOMING = 'incoming';
const PENDING = 'pending';

// Payment
const PAYMENT_PROPS = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  amountUsd: FLOAT_NUMBER_PROPS,
  status: PropTypes.oneOf([SUCCESS, ERROR, INCOMING, PENDING]),
});

// Payment decode
const PAYMENT_DECOD = PropTypes.shape({
  destination: PropTypes.string.isRequired,
  payment_hash: PropTypes.string.isRequired,
  num_satoshis: PropTypes.string.isRequired,
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  expiry: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  description: PropTypes.string,
  description_hash: PropTypes.string,
  fallback_addr: PropTypes.string,
  cltv_expiry: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  route_hints: PropTypes.array,
});

// Channels
const CHANNEL_PROPS = PropTypes.shape({
  active: PropTypes.bool,
  name: PropTypes.string.isRequired,
  contact: CONTACTS_PROPS,
  capacity: PropTypes.number.isRequired,
  local_balance: PropTypes.number.isRequired,
  remote_pubkey: PropTypes.string.isRequired,
  channel_point: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  created: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
    .isRequired,
});

const CHANNEL_OPEN = 'OPEN';
const CHANNEL_CONNECTING = 'CONNECTION';
const CHANNEL_PENDING = 'PENDING';

// Stream
const STREAM_PROPS = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  created: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
    .isRequired,
  secPaid: PropTypes.number.isRequired,
  totalTime: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  memo: PropTypes.string.isRequired,
  payments: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.string.isRequired)]),
});

const STREAM_ERROR = 'error';
const STREAM_PAUSE = 'pause';
const STREAM_NEW = 'new';
const STREAM_RUN = 'run';
const STREAM_END = 'end';

// Payment subtype
const REGULAR = 'regular';
const STREAM = 'stream';

const DATE_GROUP_FORMAT = 'DD.MM.YYYY';

const BTC = 'BTC';
const mBTC = 'mBTC';
const Satoshi = 'Satoshi';

const BTC_FRACTION_VALUES = [BTC, mBTC, Satoshi];
const BTC_FRACTION_PROPS = PropTypes.oneOf([BTC, mBTC, Satoshi]);

// Privacy mode
const MODE_EXTENDED = 'extended';
const MODE_STANDARD = 'standard';
const MODE_PROPS = PropTypes.oneOf([MODE_EXTENDED, MODE_STANDARD]);

// Local invoice types
const ADD_INVOICE_REMOTE_REQUEST = 'ADD_INVOICE_REMOTE_REQUEST';
const SOCKET_SIGN_MESSAGE_REQUEST = 'SIGN_MESSAGE_REQUEST';
const SOCKET_SIGN_MESSAGE_RESPONSE = 'SIGN_MESSAGE_RESPONSE';
const SOCKET_TYPE = 'LOCAL_INVOICE_SERVER';
const SOCKET_CONNECT_REQUEST = 'CONNECT_REQUEST';
const SOCKET_ERROR = 'ERROR';
const SOCKET_UNAUTHORIZED_CONNECTION = 'UNAUTHORIZED_CONNECTION';
const SOCKET_SIGN_MESSAGE_SUCCESS = 'SIGN_MESSAGE_SUCCESS';
const SOCKET_ADD_INVOICE_REMOTE_RESPONSE = 'ADD_INVOICE_REMOTE_RESPONSE';
const SOCKET_ADD_INVOICE_REMOTE_REQUEST = 'ADD_INVOICE_REMOTE_REQUEST';
const SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_RESPONSE = 'ADD_INVOICE_ENCRYPTED_REMOTE_RESPONSE';
const SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_REQUEST = 'ADD_INVOICE_ENCRYPTED_REMOTE_REQUEST';
const SOCKET_PUBKEY_REQUEST = 'PUBKEY_REQUEST';
const SOCKET_PUBKEY_RESPONSE = 'PUBKEY_RESPONSE';

const LIS_DEFAULT_ERROR = `Seems like a payee is offline or uses non-LightningPeach wallet.
Try to pay using a payment request.`;
const ERROR_MALFORMED_INVOICE = 'Invoice returned with wrong data';

const PAYMENT_SCREEN_TO_FIELD_PROPS = PropTypes.shape({
  value: PropTypes.string,
  type: PropTypes.oneOf([LIGHTNING, ONCHAIN]),
  processing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  decodedPaymentRequest: PropTypes.shape({
    destination: PropTypes.string.isRequired,
    num_satoshis: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
});

const NFC_SCAN_SUCCESS_PROPS = PropTypes.shape({
  type: PropTypes.oneOf([LIGHTNING, ONCHAIN]),
  data: PropTypes.string.isRequired,
  amount: PropTypes.number,
  name: PropTypes.string,
});

export default {
  NAVIGATION_PROPS,
  PAYMENT_PROPS,
  PAYMENT_DECOD,
  CHANNEL_PROPS,
  CHANNEL_OPEN,
  CHANNEL_PENDING,
  CHANNEL_CONNECTING,
  STREAM_PROPS,
  STREAM_PAUSE,
  STREAM_NEW,
  STREAM_RUN,
  STREAM_END,
  STREAM_ERROR,
  FLOAT_NUMBER_PROPS,
  LIGHTNING,
  ONCHAIN,
  SUCCESS,
  ERROR,
  INCOMING,
  PENDING,
  REGULAR,
  STREAM,
  DATE_GROUP_FORMAT,
  BTC,
  CONTACTS_PROPS,
  mBTC,
  Satoshi,
  BTC_FRACTION_VALUES,
  BTC_FRACTION_PROPS,
  ADD_INVOICE_REMOTE_REQUEST,
  SOCKET_SIGN_MESSAGE_REQUEST,
  SOCKET_SIGN_MESSAGE_RESPONSE,
  SOCKET_TYPE,
  SOCKET_CONNECT_REQUEST,
  SOCKET_ERROR,
  SOCKET_UNAUTHORIZED_CONNECTION,
  SOCKET_SIGN_MESSAGE_SUCCESS,
  SOCKET_ADD_INVOICE_REMOTE_RESPONSE,
  SOCKET_ADD_INVOICE_REMOTE_REQUEST,
  SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_RESPONSE,
  SOCKET_ADD_INVOICE_ENCRYPTED_REMOTE_REQUEST,
  SOCKET_PUBKEY_REQUEST,
  SOCKET_PUBKEY_RESPONSE,
  LIS_DEFAULT_ERROR,
  ERROR_MALFORMED_INVOICE,
  PAYMENT_SCREEN_TO_FIELD_PROPS,
  NFC_SCAN_SUCCESS_PROPS,
  MODE_EXTENDED,
  MODE_STANDARD,
  MODE_PROPS,
};
