import { Model } from './Realm';

export class ChannelData extends Model {
  static schema = {
    name: 'ChannelData',
    primaryKey: 'txid',
    properties: {
      txid: 'string',
      name: 'string',
      created: 'int',
    },
  };

  static filterByName(name) {
    return this.filterByProp('name', name);
  }
}
