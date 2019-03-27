import { NativeModules, Platform } from 'react-native';
import { isIOS } from '../Themes';

const { RNBackgroundTaskIOS, ForegroundServiceAndroid } = NativeModules;

const BACKGROUND_TASK_NAME_IOS = 'backgroundTask';

export default {
  start: (isEnableBackgroundServiceAndroid, messageAndroid, expirationCallbackIOS) => {
    if (isIOS) {
      RNBackgroundTaskIOS.start(BACKGROUND_TASK_NAME_IOS, expirationCallbackIOS);
    } else if (Platform.OS === 'android' && isEnableBackgroundServiceAndroid) {
      ForegroundServiceAndroid.start(messageAndroid);
    }
  },
  stop: () => {
    if (isIOS) {
      RNBackgroundTaskIOS.stop(BACKGROUND_TASK_NAME_IOS);
    } else {
      ForegroundServiceAndroid.stop();
    }
  },
};
