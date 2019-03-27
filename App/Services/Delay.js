import BackgroundTimer from 'react-native-background-timer';
import Config from '../Config/AppConfig';

export const jsDelay = ms => new Promise(resolve => setTimeout(() => resolve(true), ms));

export const delay = ms =>
  new Promise(resolve => BackgroundTimer.setTimeout(() => resolve(true), ms));

// TODO: Find a solution to fix this "hack"
export const delayForSagasRequest = () => delay(Config.minimumDelay);
