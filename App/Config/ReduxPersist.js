import { AsyncStorage } from 'react-native';
import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform';

export const nestedBlackList = [
  'signedIn',
  'errorSignIn',
  'errorSignUp',
  'errorChannels',
  'errorChannelsDelete',
  'createChannelError',
  'contactsAddFailure',
  'contactsRemoveFailure',
  'contactsUpdateFailure',
  'errorUsdPerBtc',
  'errorPubkeyId',
  'errorBalance',
  'errorHistory',
  'errorSendPayment',
  'errorAddress',
  'errorBalance',
  'errorHistory',
  'errorSendCoins',
  'isShowLoading',
];

// More info here: https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const ReduxPersist = {
  active: true,
  reducerVersion: '1.5',
  storeConfig: {
    key: 'primary',
    storage: AsyncStorage,
    // Reducer keys that you do NOT want stored to persistence here.
    whitelist: ['ui', 'account', 'channels'],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    // whitelist: [],
    transforms: [immutablePersistenceTransform],
  },
};

export default ReduxPersist;
