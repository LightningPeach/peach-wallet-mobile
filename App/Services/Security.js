import RNSecureKeyStore from 'react-native-secure-key-store';
import { NativeModules } from 'react-native';
import { toByteArray } from 'base64-js';
import { isReallyEmpty } from './Utils';

const { RNSecureRandom } = NativeModules;

const PASSWORD_KEY = 'password';
const DB_KEY = 'db';
const PIN_KEY = 'pin';

function toHexString(byteArray) {
  return byteArray.reduce((output, elem) => output + `0${elem.toString(16)}`.slice(-2), '');
}

const generateAndSaveDbKey = async () => {
  const dbKey = await RNSecureRandom.generateSecureRandomAsBase64(64);
  await RNSecureKeyStore.set(DB_KEY, dbKey);
  const bytes = toByteArray(dbKey);
  console.log(`dbkey ${toHexString(bytes)}`);
  return bytes;
};
const getDbKey = async () => {
  try {
    const dbKey = await RNSecureKeyStore.get(DB_KEY);
    const bytes = toByteArray(dbKey);
    console.log(`dbkey ${toHexString(bytes)}`);
    return bytes;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const savePassword = passsword => RNSecureKeyStore.set(PASSWORD_KEY, passsword);
const getPassword = async () => {
  try {
    return RNSecureKeyStore.get(PASSWORD_KEY);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const savePin = pin => RNSecureKeyStore.set(PIN_KEY, pin);
const getPin = async () => {
  try {
    return await RNSecureKeyStore.get(PIN_KEY);
  } catch (e) {
    console.log(e);
    return null;
  }
};
const hasPin = async () => {
  const pin = await getPin();
  return !isReallyEmpty(pin);
};

export default {
  generateAndSaveDbKey,
  getDbKey,
  savePassword,
  getPassword,
  savePin,
  getPin,
  hasPin,
};
