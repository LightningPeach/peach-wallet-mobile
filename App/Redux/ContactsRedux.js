import { createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  contactsAddRequest: ['name', 'address'],
  contactsAddSuccess: null,
  contactsAddFailure: ['error'],

  contactsRemoveRequest: ['id'],
  contactsRemoveSuccess: null,
  contactsRemoveFailure: ['error'],

  contactsUpdateRequest: ['id', 'name', 'address'],
  contactsUpdateSuccess: null,
  contactsUpdateFailure: ['error'],
});

export const ContactsTypes = Types;
export default Creators;
