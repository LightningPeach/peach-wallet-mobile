import { AsyncStorage } from 'react-native';
import { persistStore } from 'redux-persist';

import ReduxPersist from '../Config/ReduxPersist';
import StartupActions from '../Redux/StartupRedux';

const updateReducers = (store) => {
  const { reducerVersion } = ReduxPersist;
  const startup = () => store.dispatch(StartupActions.startup());

  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion')
    .then((localVersion) => {
      if (localVersion !== reducerVersion) {
        console.log('PURGE: Reducer Version Change Detected', {
          'Old Version:': localVersion,
          'New Version:': reducerVersion,
        });
        // Purge store
        persistStore(store, null, startup).purge();
        AsyncStorage.setItem('reducerVersion', reducerVersion);
      } else {
        persistStore(store, null, startup);
      }
    })
    .catch(() => {
      persistStore(store, null, startup);
      AsyncStorage.setItem('reducerVersion', reducerVersion);
    });
};

export default { updateReducers };
