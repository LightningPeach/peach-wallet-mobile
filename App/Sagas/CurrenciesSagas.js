import { call, put } from 'redux-saga/effects';
import { pathOr } from 'ramda';

import Errors from '../Config/Errors';

import { showError } from '../Services/InformBox';
import CurrenciesActions from '../Redux/CurrenciesRedux';

export function* getCurrentUsdPerBtc(api) {
  const response = yield call(api.currentUsdPerBtcRate);

  if (response.ok) {
    const data = pathOr(0, ['data', 'USD', 'last'], response);
    const usd = data.toFixed(2);

    yield put(CurrenciesActions.usdPerBtcSuccess(usd));
  } else {
    const error = pathOr(Errors.EXCEPTION_CURRENCIES_GET, ['data', 'error'], response);

    showError(error);
    yield put(CurrenciesActions.usdPerBtcFailure(error));
  }
}
