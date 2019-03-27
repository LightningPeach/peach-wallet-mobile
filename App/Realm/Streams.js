import { Model } from './Realm';
import Types from '../Config/Types';

export class StreamData extends Model {
  static schema = {
    name: 'StreamData',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      created: 'int',
      secPaid: { type: 'int', default: 0 },
      secToPay: 'int',
      totalTime: 'int',
      price: 'int',
      status: 'string',
      destination: 'string',
      memo: 'string',
      error: 'string?',
      payments: 'string[]',
      ongoingPaymentsNumber: { type: 'int', default: 0 },
    },
  };

  static getByPayment(payment) {
    return this.getAll().find(stream => stream.payments.indexOf(payment) !== -1);
  }

  static getActiveOnly() {
    return this.getAll().filtered(`status != "${Types.STREAM_END}"`);
  }

  static getRunningOnly() {
    return this.getAll().filtered(`status == "${Types.STREAM_RUN}"`);
  }

  static update(id, transformations) {
    this.write(() => {
      const stream = this.getOne(id);
      if (stream) {
        Object.keys(transformations).forEach((p) => {
          if (transformations[p] instanceof Function) {
            stream[p] = transformations[p](stream[p]);
          } else {
            stream[p] = transformations[p];
          }
        });
      }
    });
  }
}
