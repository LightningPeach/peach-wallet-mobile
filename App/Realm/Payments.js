import { Model } from './Realm';

export class PaymentData extends Model {
  static schema = {
    name: 'PaymentData',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      address: 'string',
      amount: 'int',
      amountUsd: 'string',
      paymentType: 'string', // PropTypes.oneOf([LIGHTNING, ONCHAIN]),
      date: 'int',
      status: 'string', // PropTypes.oneOf([SUCCESS, ERROR, INCOMING, PENDING])
    },
  };

  static getByType(type) {
    return this.getAll().filtered(`paymentType == '${type}'`);
  }
}
