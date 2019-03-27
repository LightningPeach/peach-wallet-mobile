import { createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  reset: null,
});

export const CommonTypes = Types;
export default Creators;

