import UUID from 'react-native-uuid-generator';
import { Model } from './Realm';

export class ContactData extends Model {
  static schema = {
    name: 'ContactData',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      address: 'string?',
    },
  };

  static async createOrUpdate(data, update = false) {
    let { id } = data;
    if (!id) {
      id = await UUID.getRandomUUID();
    }

    return super.createOrUpdate({ ...data, id }, update);
  }

  static filterByName(name) {
    return this.filterByProp('name', name, false);
  }

  static findByName(name) {
    return this.filterByProp('name', name, true);
  }

  static findByAddress(address) {
    return this.filterByProp('address', address, true);
  }
}
