import {
  addIndex,
  isNil,
  isEmpty,
  groupBy,
  sortBy,
  sortWith,
  prop,
  toPairs,
  compose,
  toLower,
  descend,
  map,
  mergeAll,
  concat,
  values,
  ifElse,
  always,
  either,
} from 'ramda';
import moment from 'moment';

import { getDefaultPaymentName } from '../Services/Payment';
import Types from '../Config/Types';
import { PaymentData } from '../Realm';

export const sortByFirstItem = sortBy(prop(0));

export const sortByProp = key => sortWith([descend(prop(key))]);

export const sortByNameCaseInsensitive = sortBy(compose(
  toLower,
  prop('name'),
));

export const contactsToSectionList = ifElse(
  either(isNil, isEmpty),
  always([]),
  compose(
    map(pair => ({ title: pair[0], data: pair[1] })),
    toPairs,
    groupBy(item => item.name[0].toUpperCase()),
    sortByNameCaseInsensitive,
  ),
);

export const transformOnchainDataForPaymentsHistory = dateKey =>
  ifElse(
    isEmpty,
    always([]),
    compose(
      map(pair => ({ title: pair[0], data: pair[1] })),
      toPairs,
      groupBy(item => moment.unix(item[dateKey]).format(Types.DATE_GROUP_FORMAT)),
      sortByProp(dateKey),
      map((paymentsList) => {
        const mergedPayment = mergeAll(paymentsList);
        mergedPayment.name = getDefaultPaymentName(mergedPayment.name, Types.ONCHAIN);
        return mergedPayment;
      }),
      values,
      groupBy(prop('id')),
      concat(PaymentData.getByType(Types.ONCHAIN).slice()),
    ),
  );

export const transformLightningDataForPaymentsHistory = dateKey =>
  ifElse(
    isEmpty,
    always([]),
    compose(
      map(pair => ({ title: pair[0], data: pair[1] })),
      toPairs,
      groupBy(item => moment.unix(item[dateKey]).format(Types.DATE_GROUP_FORMAT)),
      sortByProp(dateKey),
      map((d) => {
        const copy = { ...d };
        const payment = PaymentData.getOne(d.id);

        if (payment) {
          return mergeAll([payment, copy, { name: payment.name || copy.name }]);
        }

        return copy;
      }),
    ),
  );

export const mapIndexed = addIndex(map);
