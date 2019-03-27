import { isRemoteDebug } from '../Services/Utils';

export const addRealmCollectionListener = (collection, listener) => {
  collection.addListener((theCollection, changes) => {
    if (isRemoteDebug) {
      setImmediate(listener, theCollection, changes);
    } else {
      listener(theCollection, changes);
    }
  });
};
