import { pathOr, toLower, isEmpty, trim, isNil, replace, isValidNumber } from 'ramda';

import AppConfig from '../Config/AppConfig';

import Clipboard from './Clipboard';
import Types from '../Config/Types';
import { Images, Metrics, Colors } from '../Themes';
import { btcToSatoshi } from '../Transforms/currencies';

const uriRegeExp = /^(lightning|bitcoin):(.+?)(?:\?(.*))?$/i;
const amountRegeExp = /amount=([\d.]+)/;
const messageRegeExp = /message=([^&]+)/;

export const getIconByStatus = (status) => {
  switch (status) {
    case Types.INCOMING:
    case Types.SUCCESS:
      return Images.successPayment;

    case Types.ERROR:
      return Images.errorPayment;

    case Types.PENDING:
      return Images.pendingPayment;

    default:
      return null;
  }
};

export const getIconStyleByStatus = (status) => {
  switch (status) {
    case Types.INCOMING:
    case Types.SUCCESS:
      return Metrics.icons.paymentHistoryIcon.success;

    case Types.ERROR:
      return Metrics.icons.paymentHistoryIcon.error;

    case Types.PENDING:
      return Metrics.icons.paymentHistoryIcon.pending;

    default:
      return null;
  }
};

export const getTextColorByStatus = (status) => {
  switch (status) {
    case Types.INCOMING:
      return {
        color: Colors.orange,
      };

    case Types.SUCCESS:
      return {
        color: Colors.lightGreen,
      };

    case Types.ERROR:
      return {
        color: Colors.errors,
      };

    case Types.PENDING:
      return {
        color: Colors.darkGray,
      };

    default:
      return null;
  }
};

export const getTextInfoByStatus = (status, text = '') => {
  switch (status) {
    case Types.INCOMING:
      return 'Incoming payment';

    case Types.SUCCESS:
      return 'Success transaction';

    case Types.ERROR:
      return `Transaction error: ${text}`;

    case Types.PENDING:
      return 'Payment in processing';

    default:
      return null;
  }
};

export const getRecepientIdTextByStatus = (type, status) => {
  if (type === Types.ONCHAIN) {
    return 'BTC Address';
  }

  if (status === Types.INCOMING) {
    return 'Sender ID';
  }

  return 'Recipient ID';
};

export const getRecepientTextByStatus = (status) => {
  if (status === Types.INCOMING) {
    return 'Sender';
  }

  return 'Recipient';
};

export const getHistoryRightAction = (type, navigation, id) => {
  switch (type) {
    case Types.LIGHTNING:
      return () => navigation.navigate('StreamsList');
    case Types.ONCHAIN:
    default:
      return () => Clipboard.set('BTC Address', id);
  }
};

export const getPaymentType = (params = {}) => pathOr(Types.LIGHTNING, ['type'], params);

export const getPaymentSubtype = (params = {}) => {
  const type = pathOr(Types.ONCHAIN, ['type'], params);
  const subType = pathOr(Types.REGULAR, ['subType'], params);
  switch (type) {
    case Types.LIGHTNING:
      return subType;
    case Types.ONCHAIN:
    default:
      return Types.REGULAR;
  }
};

export const isStreamPayment = (type, subType) =>
  type === Types.LIGHTNING && subType === Types.STREAM;

export const decodePaymentData = (val, defaultError) => {
  console.log(`decodePaymentData: ${val}`);

  let type;
  let amount;
  let data;
  let name;
  let error;

  if (val.toLowerCase().startsWith('lntb') || val.toLowerCase().startsWith('lnbc')) {
    // non uri lightning data
    type = Types.LIGHTNING;
    data = val;
  } else if (val.toLowerCase().startsWith('tb1') || val.toLowerCase().startsWith('bc1')) {
    // non uri bitcoin data
    type = Types.ONCHAIN;
    data = val;
  } else {
    let matched = uriRegeExp.exec(val);
    let query;
    if (matched) {
      [, type, data, query] = matched;
      type = toLower(type) === Types.LIGHTNING ? Types.LIGHTNING : Types.ONCHAIN;
      if (query) {
        matched = amountRegeExp.exec(query);
        if (matched) {
          [, amount] = matched;
        }

        matched = messageRegeExp.exec(query);
        if (matched) {
          [, name] = matched;
        }
      }
    } else {
      error = defaultError;
    }
  }

  if (type === Types.ONCHAIN && !isNil(amount) && !isEmpty(amount)) {
    amount = replace(',', '.', amount);
    amount = isValidNumber(amount) ? btcToSatoshi(amount) : '';
  }

  return {
    type,
    data,
    amount,
    name,
    error,
  };
};

export const getDefaultPaymentName = (name, type, isIncoming = false) => {
  if (name && !isEmpty(trim(name))) return name;
  if (type === Types.ONCHAIN) return AppConfig.onchainPaymentName;
  if (isIncoming) return AppConfig.lightningInvoiceName;

  return AppConfig.lightningPaymentName;
};

export const parseNameFromDescription = (description) => {
  let name;
  try {
    const parsedDescription = JSON.parse(description);
    name = parsedDescription.name ? parsedDescription.name : '';
  } catch (e) {
    name = description;
  }

  return name;
};

export const getPaymentName = (params = {}) => pathOr('', ['name'], params);
export const getPaymentToName = (params = {}) => pathOr('', ['toName'], params);
export const getPaymentAddress = (params = {}) => pathOr('', ['address'], params);
export const getPaymentAmount = (params = {}) => pathOr('', ['amount'], params);
export const getPaymentData = (params = {}) => pathOr(null, ['paymentData'], params);

export const getTypeDisplayName = (type) => {
  if (type === Types.LIGHTNING) {
    return 'Lightning';
  }

  return 'On-chain';
};
