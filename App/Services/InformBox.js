import { showMessage } from 'react-native-flash-message';

import Config from '../Config/AppConfig';
import Errors from '../Config/Errors';

import { isIOS, Colors } from '../Themes';

export const showError = (text, icon) => {
  let message = text;

  if (message.length > Config.maxErrorLength) {
    message = Errors.GENERAL_ERROR;
  }

  showMessage({
    message,
    icon,
    backgroundColor: Colors.errors,
  });
};

export const showInfo = message =>
  showMessage({
    message,
    backgroundColor: isIOS ? Colors.orange : Colors.informBox,
  });
