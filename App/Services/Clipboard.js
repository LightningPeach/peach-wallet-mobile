import { Clipboard } from 'react-native';

import { showInfo } from './InformBox';

const set = (text, val) => {
  Clipboard.setString(val || '');

  showInfo(`${text} copied`);
};

export default { set };
