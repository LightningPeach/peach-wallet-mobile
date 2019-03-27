import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { reducer as network } from 'react-native-offline';
import { resettableReducer } from 'reduxsauce';

import configureStore from './CreateStore';
import rootSaga from '../Sagas';
import ReduxPersist from '../Config/ReduxPersist';
import { CommonTypes } from './CommonRedux';

// listen for the action type of 'RESET', you can change this.
const resettable = resettableReducer(CommonTypes.RESET);

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  account: require('./AccountRedux').reducer,
  channels: resettable(require('./ChannelsRedux').reducer),
  currencies: resettable(require('./CurrenciesRedux').reducer),
  lightning: resettable(require('./LightningRedux').reducer),
  onchain: resettable(require('./OnchainRedux').reducer),
  ui: require('./UiRedux').reducer,
  streams: resettable(require('./StreamsRedux').reducer),
  network,
  paymentCreateScreen: resettable(require('./PaymentCreateScreenRedux').reducer),
  nfc: require('./NfcRedux').reducer,
  session: require('./SessionRedux').reducer,
});

export default () => {
  let finalReducers = reducers;
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig;
    finalReducers = persistReducer(persistConfig, reducers);
  }

  // eslint-disable-next-line
  let { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('.').reducers;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('../Sagas').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return store;
};
