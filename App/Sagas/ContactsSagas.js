import { call, put, all, takeLatest } from 'redux-saga/effects';

import { showInfo, showError } from '../Services/InformBox';
import ContactsActions, { ContactsTypes } from '../Redux/ContactsRedux';

import Errors from '../Config/Errors';
import { ContactData } from '../Realm';

export function* addContacts({ name, address }) {
  const byNameResults = yield call([ContactData, ContactData.findByName], name);
  const byAddressResults = yield call([ContactData, ContactData.findByAddress], address);

  if (byAddressResults.length > 0) {
    showError(Errors.EXCEPTION_CONTACT_LIGHTNING_EXISTS);
    yield put(ContactsActions.contactsAddFailure(Errors.EXCEPTION_CONTACT_LIGHTNING_EXISTS));
  } else if (byNameResults.length > 0) {
    showError(Errors.EXCEPTION_CONTACT_NAME_EXISTS);
    yield put(ContactsActions.contactsAddFailure(Errors.EXCEPTION_CONTACT_NAME_EXISTS));
  } else {
    yield call([ContactData, ContactData.createOrUpdate], { name, address });
    showInfo(`Contact "${name}" added`);
    yield put(ContactsActions.contactsAddSuccess());
  }
}

export function* removeContacts({ id }) {
  yield call([ContactData, ContactData.deleteOne], id);
  yield put(ContactsActions.contactsRemoveSuccess());
}

export function* updateContacts(updatedContact) {
  yield call([ContactData, ContactData.createOrUpdate], updatedContact, true);
  yield put(ContactsActions.contactsUpdateSuccess());
}

export default function* saga() {
  yield all([
    takeLatest(ContactsTypes.CONTACTS_ADD_REQUEST, addContacts),
    takeLatest(ContactsTypes.CONTACTS_REMOVE_REQUEST, removeContacts),
    takeLatest(ContactsTypes.CONTACTS_UPDATE_REQUEST, updateContacts),
  ]);
}
