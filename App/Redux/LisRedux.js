import { createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openConnection: null,
  closeConnection: null,
  send: ['data'],
  receive: ['data'],
  authError: ['error'],
});

export const LisTypes = Types;
export default Creators;
