import Types from '../Config/Types';

export const satoshiToBtc = value => value / 100000000;

export const btcToSatoshi = value => value * 100000000;

export const btcToMBtc = value => value * 1000;

export const satoshiToUsd = (value, usdPerBtc) => (satoshiToBtc(value) * usdPerBtc).toFixed(2);

export const btcToUsd = (value, usdPerBtc) => (value * usdPerBtc).toFixed(2);

export const satoshiToBtcFraction = (value, btcFraction) => {
  switch (btcFraction) {
    case Types.mBTC:
      return value / 100000;
    case Types.Satoshi:
      return value;
    case Types.BTC:
    default:
      return value / 100000000;
  }
};

export const btcToCurrentFraction = (value, btcFraction) => {
  switch (btcFraction) {
    case Types.mBTC:
      return btcToMBtc(value);
    case Types.Satoshi:
      return btcToSatoshi(value);
    case Types.BTC:
    default:
      return value;
  }
};

export const btcFractionToUsd = (value, btcFraction, usdPerBtc) => {
  switch (btcFraction) {
    case Types.mBTC:
      return ((value * usdPerBtc) / 1000).toFixed(2);
    case Types.Satoshi:
      return ((value * usdPerBtc) / 100000000).toFixed(2);
    case Types.BTC:
    default:
      return (value * usdPerBtc).toFixed(2);
  }
};

export const convertToSatochiByType = (value, type) => {
  let amount;
  switch (type) {
    case Types.mBTC:
      amount = value * 100000;
      break;
    case Types.BTC:
      amount = value * 100000000;
      break;

    case Types.Satoshi:
    default:
      amount = value;
  }

  return typeof amount === 'number' ? Math.floor(amount) : parseInt(amount, 10);
};
