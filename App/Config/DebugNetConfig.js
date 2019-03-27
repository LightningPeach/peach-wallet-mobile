import { Platform } from 'react-native';

// eslint-disable-next-line no-unused-vars
const DebugNetConfig = {
  onchainNetwork: 'testnet', // prod, testnet, simnet
  username: '',
  password: '',
  confirmPassword: '',
  ...Platform.select({
    android: {
      host: '',
      tlcCert: '',
      macaroons: '',
    },
    ios: {
      host: '',
      tlcCert: '',
      macaroons: '',
    },
  }),
};

export default DebugNetConfig;
