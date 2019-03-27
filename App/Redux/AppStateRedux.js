import { createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  appForeground: null,
  appBackground: null,
});

export const AppStateTypes = Types;
export default Creators;
