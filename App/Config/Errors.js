import { isNil, isEmpty, path, pathOr } from 'ramda';
import { jsonParseSilently } from '../Services/json';

const LND_ROUTE_ERROR_REGEX = /unable to route/;

const CANT_CONNECT_SERVER_REGEX = /Could not connect to the server./;

const LND_DUST_ERROR_REGEX = /output, is dust/;

const LND_ANDROID_CERT_ERROR_REGEX = /(?:java\.security\.cert\.CertificateException)|(?:javax\.net\.ssl\.)/;

const EXCEPTION_WRONG_CERTIFICATE = 'Wrong certificate.';

const GENERAL_ERROR = 'A problem occurred on lnd server. Try again later or contact support.';
const EXCEPTION_AMOUNT_NEGATIVE = 'Amount must contain positive number.';

const EXCEPTION_OPEN_LINK = 'Cannot open link';

// Incorrect lightning address
const EXCEPTION_LIGHTNING_ID_WRONG = 'Not valid Lightning ID.'; // unexpected characters

const EXCEPTION_LIGHTNING_ID_STANDARD =
  'Lightning ID payments not supported in standard mode. You can change Privacy mode in profile.';

const EXCEPTION_FIELD_IS_REQUIRED = 'This field is required.';

const EXCEPTION_NAMED_FIELD_REQUIRED = name => `${name} is required`;

// Incorrect lightningId length
const EXCEPTION_LIGHTNING_ID_WRONG_LENGTH = 'Incorrect length of Lightning ID.';

const EXCEPTION_NAME_WRONG = 'Only letters, numbers and space delimiter.'; // unexpected characters

// Contacts
const EXCEPTION_CONTACT_LIGHTNING_EXISTS =
  'Unable to create contact, this lightning address already exists.';

const EXCEPTION_CONTACT_ONCHAIN_EXISTS =
  'Unable to create contact, this BTC address already exists.';

const EXCEPTION_CONTACT_NAME_EXISTS = 'Unable to create contact. This name already exists.';

const EXCEPTION_PASSWORD_EQUIVALENT = 'New password cannot be the same as old password';

const EXCEPTION_SIGNIN = 'Incorrect password.';

const EXCEPTION_SIGNIN_NO_SIGNUP = 'Please connect to your node first.';

const EXCEPTION_UNLOCK_NO_NODE = 'Please connect to the node first.';

const EXCEPTION_PASSWORD_LENGTH = 'The password must consist of 8 characters.';
const EXCEPTION_PASSWORD_WRONG_FORMAT =
  'Password must contain digit, uppercase and lowercase letter.';
const EXCEPTION_PASSWORD_MISMATCH = 'Password mismatch.';
const EXCEPTION_INVALID_MACAROONS = 'Macaroon is incorrect';

// Host not in https
const EXCEPTION_HTTPS_HOST = 'The host must be https.';

const EXCEPTION_CONNECT_NODE = 'Cannot connect to the node.';

// Channels
const EXCEPTION_CHANNELS_GET_OPENED = 'Cannot receive opened channels.';

const EXCEPTION_CHANNELS_GET_PENDING = 'Cannot receive pending channels.';

const EXCEPTION_CHANNELS_ADD_PEER = 'Cannot add peer.';

const EXCEPTION_CHANNELS_OPEN = 'Cannot open channel.';

const EXCEPTION_CHANNELS_OPEN_ALREADY_OPENING = lightningId =>
  `Channel to ${lightningId} is already opening.`;

const EXCEPTION_CHANNELS_CLOSE = 'Cannot close channel.';

const EXCEPTION_MAX_CHANNEL_SIZE = (channelSize, btcFraction) =>
  `Maximum allowed channel size is ${channelSize} ${btcFraction}`;

// Currencies
const EXCEPTION_CURRENCIES_GET = 'Cannot receive current exchange rate.';

// Lightning
const EXCEPTION_LIGHTNING_GET_FEE = 'Cannot calculate fee.';

const EXCEPTION_LIGHTNING_GET_PUBKEY = 'Cannot receive identity pubkey.';

const EXCEPTION_LIGHTNING_GET_BALANCE = 'Cannot receive channels balance.';

const EXCEPTION_LIGHTNING_PAYMENTS_HISTORY = 'Cannot receive payments history.';

const EXCEPTION_LIGHTNING_INVOICES_HISTORY = 'Cannot receive invoices history.';

const EXCEPTION_LIGHTNING_SEND_PAYMENT = 'Cannot send lightning payment.';

const EXCEPTION_LIGHTNING_DECODE_PAYMENT_REQUEST = 'Cannot decode payment request.';

const EXCEPTION_LIGHTNING_GET_PAYREQ = 'Cannot generate payment request';

const EXCEPTION_LIGHTNING_INCORRECT_PAYREQ = 'Cannot verify payment request';

const EXCEPTION_LND_UNABLE_ROUTE = 'Unable to route payment to destination.';

const EXCEPTION_NOT_SYNCED = 'Lnd is not synced';

const EXCEPTION_QRCODE_SCAN_ERROR = "Can't read qr code. Try again in a couple seconds.";

const EXCEPTION_NFC_DECODE_ERROR = "Can't decode NFC tag data.";

// Onchain
const EXCEPTION_ONCHAIN_GET_ADDRESS = 'Cannot receive BTC Address.';

const EXCEPTION_ONCHAIN_GET_BALANCE = 'Cannot receive on-chain balance.';

const EXCEPTION_ONCHAIN_GET_HISTORY = 'Cannot receive on-chain history.';

const EXCEPTION_ONCHAIN_SEND_COINS = 'Cannot send coins.';

const EXCEPTION_BITCOIN_ADDRESS_WRONG = 'Incorrect BTC Address.';

// amount
// Amount is less than fee for operation
const EXCEPTION_AMOUNT_LESS_THAN_FEE = (currentFee = 0, bitcoinMeasureType = '') =>
  `Your payment must be greater than ${currentFee} ${bitcoinMeasureType} fee.`;

// No funds on onchain balance for this operation
const EXCEPTION_AMOUNT_ONCHAIN_NOT_ENOUGH_FUNDS = 'Insufficient funds on On-chain balance.';
// Field exists but amount is 0 Satoshi
const EXCEPTION_AMOUNT_EQUAL_ZERO = bitcoinMeasureType =>
  `0 ${bitcoinMeasureType} payment is not allowed.`;

// No funds on lightning balance for this operation
const EXCEPTION_AMOUNT_LIGHTNING_NOT_ENOUGH_FUNDS = 'Insufficient funds on Lightning balance.';
// More than max allowed payment
const EXCEPTION_AMOUNT_MORE_MAX = (capacity, bitcoinMeasureType) =>
  `Maximum allowed payment is ${capacity} ${bitcoinMeasureType}.`;
// Less than min allowed channel size
const EXCEPTION_AMOUNT_LESS_MIN_CHANNEL = (channelSize, bitcoinMeasureType) =>
  `Minimum allowed channel size is ${channelSize} ${bitcoinMeasureType}`;

// Less than min allowed channel size
const EXCEPTION_AMOUNT_MORE_MAX_CHANNEL = channelSize =>
  `Maximum allowed channel size is ${channelSize}`;

// Field should contain only numbers
const EXCEPTION_FIELD_DIGITS_ONLY = 'Only digits are allowed.';

const EXCEPTION_NFC_ERROR = "Can't scan NFC tag";

// Incorrect lightningId + host format
const EXCEPTION_LIGHTNING_HOST_WRONG_FORMAT =
  'Incorrect format.\nCorrect is LightningID@HOST_IP:PORT.';

const EXCEPTION_CANT_SEND_EMAIL = "Can't send email.";

const COMMON_LIS_ERROR = 'Lis connection error.';
const EXCEPTION_SAVE_PIN = 'Save PIN error';

const EXCEPTION_INCORRECT_PIN = 'Incorrect PIN';

const EXCEPTION_PIN_NOT_MATCH = "Pins don't match";

export function handleLndError(defaultError, responseError, error) {
  let errorMessage = pathOr(error, ['message'], error);
  if (errorMessage) {
    if (LND_ANDROID_CERT_ERROR_REGEX.test(errorMessage)) {
      errorMessage = EXCEPTION_WRONG_CERTIFICATE;
    } else if (CANT_CONNECT_SERVER_REGEX.test(errorMessage)) {
      errorMessage = EXCEPTION_CONNECT_NODE;
    }
  }

  if (
    (isNil(responseError) || isEmpty(responseError)) &&
    (isNil(errorMessage) || isEmpty(errorMessage))
  ) {
    return defaultError;
  }

  let friendlyError;
  if (responseError) {
    if (LND_ROUTE_ERROR_REGEX.test(responseError)) {
      friendlyError = EXCEPTION_LND_UNABLE_ROUTE;
    } else if (LND_DUST_ERROR_REGEX.test(responseError)) {
      friendlyError = 'Transaction amount is too small to process on-chain payment by LND';
    } else if (CANT_CONNECT_SERVER_REGEX.test(responseError)) {
      friendlyError = EXCEPTION_CONNECT_NODE;
    } else {
      friendlyError = responseError;
    }
  } else {
    friendlyError = errorMessage;
  }

  return friendlyError;
}

export function handleLndResponseError(defaultError, response, error) {
  const responseError = response
    ? path(['error'], jsonParseSilently(response.bodyString))
    : undefined;
  return handleLndError(defaultError, responseError, error);
}

export default {
  GENERAL_ERROR,
  EXCEPTION_AMOUNT_NEGATIVE,
  EXCEPTION_OPEN_LINK,
  EXCEPTION_LIGHTNING_ID_WRONG,
  EXCEPTION_LIGHTNING_ID_STANDARD,
  EXCEPTION_FIELD_IS_REQUIRED,
  EXCEPTION_NAMED_FIELD_REQUIRED,
  EXCEPTION_LIGHTNING_ID_WRONG_LENGTH,
  EXCEPTION_BITCOIN_ADDRESS_WRONG,

  EXCEPTION_INCORRECT_PIN,
  EXCEPTION_PIN_NOT_MATCH,
  EXCEPTION_UNLOCK_NO_NODE,

  EXCEPTION_NAME_WRONG,
  EXCEPTION_CONTACT_LIGHTNING_EXISTS,
  EXCEPTION_CONTACT_ONCHAIN_EXISTS,
  EXCEPTION_CONTACT_NAME_EXISTS,

  EXCEPTION_PASSWORD_EQUIVALENT,
  EXCEPTION_SIGNIN,
  EXCEPTION_SIGNIN_NO_SIGNUP,
  EXCEPTION_PASSWORD_LENGTH,
  EXCEPTION_PASSWORD_WRONG_FORMAT,
  EXCEPTION_PASSWORD_MISMATCH,
  EXCEPTION_INVALID_MACAROONS,
  EXCEPTION_HTTPS_HOST,
  EXCEPTION_CONNECT_NODE,
  EXCEPTION_SAVE_PIN,

  EXCEPTION_CHANNELS_GET_OPENED,
  EXCEPTION_CHANNELS_GET_PENDING,
  EXCEPTION_CHANNELS_ADD_PEER,
  EXCEPTION_CHANNELS_OPEN,
  EXCEPTION_CHANNELS_OPEN_ALREADY_OPENING,
  EXCEPTION_CHANNELS_CLOSE,
  EXCEPTION_MAX_CHANNEL_SIZE,

  EXCEPTION_CURRENCIES_GET,

  EXCEPTION_LIGHTNING_GET_FEE,
  EXCEPTION_LIGHTNING_GET_PUBKEY,
  EXCEPTION_LIGHTNING_GET_BALANCE,
  EXCEPTION_LIGHTNING_PAYMENTS_HISTORY,
  EXCEPTION_LIGHTNING_INVOICES_HISTORY,
  EXCEPTION_LIGHTNING_SEND_PAYMENT,
  EXCEPTION_LIGHTNING_DECODE_PAYMENT_REQUEST,
  EXCEPTION_LIGHTNING_GET_PAYREQ,
  EXCEPTION_LIGHTNING_INCORRECT_PAYREQ,
  EXCEPTION_NOT_SYNCED,

  EXCEPTION_ONCHAIN_GET_ADDRESS,
  EXCEPTION_ONCHAIN_GET_BALANCE,
  EXCEPTION_ONCHAIN_GET_HISTORY,
  EXCEPTION_ONCHAIN_SEND_COINS,

  EXCEPTION_AMOUNT_LESS_THAN_FEE,
  EXCEPTION_AMOUNT_ONCHAIN_NOT_ENOUGH_FUNDS,
  EXCEPTION_AMOUNT_EQUAL_ZERO,
  EXCEPTION_AMOUNT_LIGHTNING_NOT_ENOUGH_FUNDS,
  EXCEPTION_AMOUNT_MORE_MAX,
  EXCEPTION_AMOUNT_LESS_MIN_CHANNEL,
  EXCEPTION_AMOUNT_MORE_MAX_CHANNEL,
  EXCEPTION_FIELD_DIGITS_ONLY,
  EXCEPTION_LIGHTNING_HOST_WRONG_FORMAT,
  EXCEPTION_CANT_SEND_EMAIL,
  EXCEPTION_QRCODE_SCAN_ERROR,
  COMMON_LIS_ERROR,
  EXCEPTION_NFC_ERROR,
  EXCEPTION_NFC_DECODE_ERROR,
  EXCEPTION_LND_UNABLE_ROUTE,
};
