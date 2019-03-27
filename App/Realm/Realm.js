import Realm from 'realm';

let realm;

export const ensureInit = async (options, encryptionKey) => {
  if (!realm || !realm.isClosed) {
    realm = await Realm.open({ ...options, encryptionKey });
  }
  return realm;
};

export const reinit = async (options, encryptionKey) => {
  if (realm && !realm.isClosed) {
    realm.close();
  }

  realm = null;

  try {
    Realm.deleteFile(options);
  } catch (ex) {
    console.log("can't delete realm", ex);
  }

  return ensureInit(options, encryptionKey);
};

export class Model extends Realm.Object {
  static write(fn) {
    realm.write(fn);
  }

  static createOrUpdate(data, update = false) {
    if (data instanceof Array) {
      realm.write(() => {
        data.forEach((item) => {
          realm.create(this.schema.name, item, update);
        });
      });
    } else {
      realm.write(() => realm.create(this.schema.name, data, update));
    }
  }

  static replaceAll(data) {
    realm.write(() => {
      realm.delete(this.getAll());
      data.forEach((item) => {
        realm.create(this.schema.name, item);
      });
    });
  }

  static updateAll(filter, update) {
    realm.write(() => {
      let rows = this.getAll();
      if (filter) {
        rows = rows.filtered(filter);
      }
      rows.forEach((item) => {
        Object.assign(item, update);
      });
    });
  }
  static getOne(pk) {
    return realm.objectForPrimaryKey(this.schema.name, pk);
  }

  static getAll() {
    return realm.objects(this.schema.name);
  }

  static getSingleList(pk) {
    return this.getAll().filtered(`${this.schema.primaryKey} == '${pk}'`);
  }

  static deleteOne(pk) {
    const model = this.getOne(pk);
    if (model) {
      model.delete();
    }
  }

  static deleteAll() {
    realm.write(() => {
      realm.deleteModel(this.schema.name);
    });
  }

  delete() {
    realm.write(() => {
      realm.delete(this);
    });
  }

  setProp(prop, value) {
    realm.write(() => {
      this[prop] = value;
    });
  }

  static filterByProp(prop, value, strictMatch = false) {
    return this.getAll().filtered(`${prop} ${strictMatch ? '==' : 'CONTAINS[c]'} "${value}"`);
  }
}
