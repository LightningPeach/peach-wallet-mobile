import { Buffer } from 'buffer';

export const pemToDem = (publickKey) => {
  const tlcCert = publickKey.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n)/g, '');
  return Buffer.from(tlcCert, 'base64').toString('hex');
};
