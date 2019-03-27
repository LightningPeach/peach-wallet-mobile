import { Model } from './Realm';

const PRIMARY_KEY = 1;
export class AuthData extends Model {
  static schema = {
    name: 'AuthData',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', default: PRIMARY_KEY },
      host: 'string?',
      tlcCert: 'string?',
      macaroons: 'string?',
    },
  };

  static save(data) {
    this.createOrUpdate({ ...data, id: PRIMARY_KEY }, true);
  }

  static get() {
    return this.getOne(PRIMARY_KEY);
  }
}
