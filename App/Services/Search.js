import { filter, toLower, find } from 'ramda';
import { ContactData } from '../Realm';

export const getContactByAddress = (address) => {
  const results = ContactData.findByAddress(address);
  if (results.length <= 0) {
    return null;
  }

  return results[0];
};

export const findChannelByName = (name, data) =>
  filter(c => toLower(c.name).includes(toLower(name)), data);

export const getBy = (value, prop, data) => find(c => toLower(c[prop]) === toLower(value))(data);
