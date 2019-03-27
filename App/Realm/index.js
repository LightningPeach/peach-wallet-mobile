import { AuthData } from './Auth';
import { ContactData } from './Contacts';
import { ChannelData } from './Channels';
import { PaymentData } from './Payments';
import { StreamData } from './Streams';
import { ensureInit, reinit } from './Realm';

const databaseOptions = {
  schema: [AuthData, ContactData, ChannelData, PaymentData, StreamData],
  schemaVersion: 2,
  // We have to change it to false or __DEV__ after first app release,
  // and provide migrations if db scheme will be changing
  deleteRealmIfMigrationNeeded: false,
};

const ensureRealmIntilialized = encryptionKey => ensureInit(databaseOptions, encryptionKey);

const reinitRealm = encryptionKey => reinit(databaseOptions, encryptionKey);

export {
  ensureRealmIntilialized,
  reinitRealm,
  AuthData,
  ContactData,
  ChannelData,
  PaymentData,
  StreamData,
};
