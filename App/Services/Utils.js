import { isNil, isEmpty, either } from 'ramda';
import { Buffer } from 'buffer';
import AppConfig from '../Config/AppConfig';

export function debounce(func, immediate, wait = AppConfig.clickDebounceTimeout) {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function utf8ToB64(str) {
  return Buffer.from(unescape(encodeURIComponent(str))).toString('base64');
}

export function b64ToUtf8(str) {
  return decodeURIComponent(escape(Buffer.from(str, 'base64').toString('utf8')));
}

export const isReallyEmpty = either(isNil, isEmpty);

export const isRemoteDebug = typeof DedicatedWorkerGlobalScope !== 'undefined';
