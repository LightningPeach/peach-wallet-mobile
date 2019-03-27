import { equals, isEmpty, isNil, startsWith } from 'ramda';
import OnchainValidator from '../Lib/wallet-address-validator/wallet-address-validator';

import Errors from '../Config/Errors';
import Config from '../Config/AppConfig';
import Types from '../Config/Types';

import { convertToSatochiByType, satoshiToBtcFraction } from '../Transforms/currencies';
import Security from './Security';

export const isHttps = text => /\b(https)/.test(text);

export const ONLY_LETTERS_AND_NUMBERS = /^[a-z0-9]+$/i;
export const ONLY_UNICODE_LETTERS_SPACE_AND_NUMBERS = /^[\p{L}\d]+(?: +[\p{L}\d]+)*$/iu;
export const LETTERS_AND_NUMBERS = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export const ONLY_NUMBERS = /^\d*\.?\d*$/;
export const ONLY_GIGITS = /^\d*$/;
export const IP_OR_HOST = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]+)?$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9-]*[A-Za-z0-9])(:[0-9]+)?$/;
export const LIGHTNING_ID_LENGTH = 66;
export const HEX_CHARS = /^[0-9a-fA-F]+$/;

export const Net = {
  MAIN: 'main',
  TESTNET: 'testnet',
  SIMNET: 'simnet',
};

export const validateOnchainAddress = (addr, network = Net.MAIN) => {
  try {
    if (isNil(addr) || isEmpty(addr)) {
      return Errors.EXCEPTION_BITCOIN_ADDRESS_WRONG;
    }

    if (
      (network === Net.SIMNET && !startsWith('sb', addr)) ||
      (network !== Net.SIMNET &&
        !OnchainValidator.validate(
          addr,
          Config.onchainCurrency,
          network === Net.MAIN ? 'prod' : 'testnet',
        ))
    ) {
      return Errors.EXCEPTION_BITCOIN_ADDRESS_WRONG;
    }
  } catch (e) {
    return Errors.EXCEPTION_BITCOIN_ADDRESS_WRONG;
  }

  return null;
};

export const validateLightningId = (id, name = 'ID') => {
  if (!id) {
    return Errors.EXCEPTION_NAMED_FIELD_REQUIRED(name);
  } else if (id.length !== LIGHTNING_ID_LENGTH) {
    return Errors.EXCEPTION_LIGHTNING_ID_WRONG_LENGTH;
  } else if (!ONLY_LETTERS_AND_NUMBERS.test(id)) {
    return Errors.EXCEPTION_LIGHTNING_ID_WRONG;
  }
  return null;
};

export const validateContactName = (id) => {
  if (!id) {
    return Errors.EXCEPTION_FIELD_IS_REQUIRED;
  } else if (!ONLY_UNICODE_LETTERS_SPACE_AND_NUMBERS.test(id)) {
    return Errors.EXCEPTION_NAME_WRONG;
  }
  return null;
};

export const validatePassword = (password, prefix = null) => {
  const newPrefix = prefix ? `${prefix} ` : '';
  if (!password) return Errors.EXCEPTION_NAMED_FIELD_REQUIRED(`${newPrefix} Password`);
  if (password.length < 8) return Errors.EXCEPTION_PASSWORD_LENGTH;
  if (!LETTERS_AND_NUMBERS.test(password)) return Errors.EXCEPTION_PASSWORD_WRONG_FORMAT;

  return null;
};

export const validatePassMismatch = (password, confirmPassword, prefix = '') => {
  const newPrefix = prefix ? `${prefix} ` : '';
  if (!password) {
    return Errors.EXCEPTION_NAMED_FIELD_REQUIRED(`${newPrefix}Password`);
  } else if (!equals(password, confirmPassword)) {
    return `${newPrefix}${Errors.EXCEPTION_PASSWORD_MISMATCH}`;
  }
  return null;
};

export const validateMacaroons = (macaroons) => {
  if (!macaroons) {
    return Errors.EXCEPTION_NAMED_FIELD_REQUIRED('Macaroons');
  } else if (macaroons.length % 2 !== 0) {
    return Errors.EXCEPTION_INVALID_MACAROONS;
  } else if (!HEX_CHARS.test(macaroons)) {
    return Errors.EXCEPTION_INVALID_MACAROONS;
  }
  return null;
};

export const validateChannelName = (name) => {
  if (name && !ONLY_UNICODE_LETTERS_SPACE_AND_NUMBERS.test(name)) {
    return Errors.EXCEPTION_NAME_WRONG;
  }
  return null;
};

export const isValidNumber = number => typeof number === 'number' || ONLY_NUMBERS.test(number);

export const validateChannelSize = (amount, btcFraction, bitcoinBalance, fieldName) => {
  if (isNil(amount) || isEmpty(amount) || amount === 0) {
    return Errors.EXCEPTION_NAMED_FIELD_REQUIRED(fieldName);
  } else if (!isValidNumber(amount)) {
    return Errors.EXCEPTION_FIELD_DIGITS_ONLY;
  }

  const size = convertToSatochiByType(amount, btcFraction);

  if (size < Config.minChannelSize) {
    const minSize = satoshiToBtcFraction(Config.minChannelSize, btcFraction);
    return Errors.EXCEPTION_AMOUNT_LESS_MIN_CHANNEL(minSize, btcFraction);
  } else if (size > bitcoinBalance) {
    return Errors.EXCEPTION_AMOUNT_ONCHAIN_NOT_ENOUGH_FUNDS;
  } else if (size >= Config.maxChannelSize) {
    const maxSize = satoshiToBtcFraction(Config.maxChannelSize - 1, btcFraction);
    return Errors.EXCEPTION_MAX_CHANNEL_SIZE(maxSize, btcFraction);
  }

  return null;
};

export const checkTimeField = (value, fieldName) => {
  if (isNil(value) || isEmpty(value) || value === 0) {
    return Errors.EXCEPTION_NAMED_FIELD_REQUIRED(fieldName);
  } else if (!ONLY_GIGITS.test(value)) {
    return Errors.EXCEPTION_FIELD_DIGITS_ONLY;
  }

  return null;
};

/**
 *
 * @param amount
 * @param {String} [type=Types.LIGHTNING|Types.ONCHAIN]
 * @return {String|null}
 */
export const checkAmount = (
  amount,
  btcFraction,
  allowZero,
  lightningBalance,
  bitcoinBalance,
  maximumPayment,
  type,
  fieldName = 'Amount',
) => {
  const validateBitcoin = (am) => {
    if (am > bitcoinBalance) {
      return Errors.EXCEPTION_AMOUNT_ONCHAIN_NOT_ENOUGH_FUNDS;
    }
    return null;
  };

  if (isNil(amount) || isEmpty(amount) || (!allowZero && amount === 0)) {
    return Errors.EXCEPTION_NAMED_FIELD_REQUIRED(fieldName);
  } else if (!isValidNumber(amount)) {
    return Errors.EXCEPTION_FIELD_DIGITS_ONLY;
  }

  const satoshiAmount = convertToSatochiByType(amount, btcFraction);
  if (!allowZero && !satoshiAmount) {
    return Errors.EXCEPTION_AMOUNT_EQUAL_ZERO(btcFraction);
  } else if (satoshiAmount < 0) {
    return Errors.EXCEPTION_AMOUNT_NEGATIVE;
  }
  if (type === Types.ONCHAIN) {
    return validateBitcoin(satoshiAmount);
  }

  if (satoshiAmount > lightningBalance) {
    return Errors.EXCEPTION_AMOUNT_LIGHTNING_NOT_ENOUGH_FUNDS;
  } else if (satoshiAmount > maximumPayment || satoshiAmount > Config.maxPaymentRequest) {
    const capa =
      satoshiAmount > Config.maxPaymentRequest ? Config.maxPaymentRequest : maximumPayment;
    const capacity = satoshiToBtcFraction(capa, btcFraction);
    return Errors.EXCEPTION_AMOUNT_MORE_MAX(capacity, btcFraction);
  }
  return null;
};

export const validatePeerAddress = (peerAddress) => {
  if (!peerAddress) {
    return Errors.EXCEPTION_FIELD_IS_REQUIRED;
  }

  const [lightningId, host] = peerAddress.split('@');
  if (!lightningId || !host || !IP_OR_HOST.test(host)) {
    return Errors.EXCEPTION_LIGHTNING_HOST_WRONG_FORMAT;
  }

  return validateLightningId(lightningId);
};

export const validatePin = async (pin) => {
  let currentPin;
  try {
    currentPin = await Security.getPin();
  } catch (e) {
    return Errors.EXCEPTION_INCORRECT_PIN;
  }

  if (!equals(currentPin, pin)) {
    return Errors.EXCEPTION_INCORRECT_PIN;
  }

  return null;
};
