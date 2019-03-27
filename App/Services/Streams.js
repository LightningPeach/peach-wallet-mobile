import { equals, values, reduce, filter, compose, flatten, prop, has, last } from 'ramda';
import Types from '../Config/Types';
import { Colors } from '../Themes';
import { StreamData } from '../Realm';
import { getDefaultPaymentName } from '../Services/Payment';
import { utf8ToB64, b64ToUtf8 } from '../Services/Utils';
import AppConfig from '../Config/AppConfig';

export const streamsToList = data => data.filter(d => !equals(d.status, Types.STREAM_END));

export const getStatusText = (type) => {
  switch (type) {
    case Types.STREAM_ERROR:
      return 'Error';
    case Types.STREAM_PAUSE:
      return 'Paused';
    case Types.STREAM_NEW:
      return 'Not started';
    case Types.STREAM_RUN:
      return 'Running';
    default:
      return '';
  }
};

export const getStatusColor = (type) => {
  switch (type) {
    case Types.STREAM_ERROR:
    case Types.STREAM_PAUSE:
      return { color: Colors.orange };
    case Types.STREAM_NEW:
      return { color: Colors.lightGreen };
    case Types.STREAM_RUN:
      return { color: Colors.errors };
    default:
      return null;
  }
};

export const getInfoButtonsName = (type) => {
  switch (type) {
    case Types.STREAM_ERROR:
    case Types.STREAM_PAUSE:
      return { start: 'CONTINUE STREAM', end: 'STOP STREAM' };
    case Types.STREAM_NEW:
      return { start: 'START STREAM', end: 'DELETE STREAM' };
    case Types.STREAM_RUN:
      return { start: 'PAUSE STREAM', end: 'STOP STREAM' };
    default:
      return { start: '', end: '' };
  }
};

export const getInfoColor = (type) => {
  switch (type) {
    case Types.STREAM_ERROR:
    case Types.STREAM_PAUSE:
      return { color: Colors.orange };
    case Types.STREAM_NEW:
      return { color: Colors.lightGreen };
    case Types.STREAM_RUN:
      return { color: Colors.errors };
    default:
      return null;
  }
};

export const getInfoText = (type, name = '') => {
  switch (type) {
    case Types.STREAM_ERROR:
    case Types.STREAM_PAUSE:
      return `${name} Stream is paused`;
    case Types.STREAM_NEW:
      return 'Start your stream';
    case Types.STREAM_RUN:
      return 'Stream is running';
    default:
      return null;
  }
};

export const getStopText = (type) => {
  if (type === Types.STREAM_NEW) {
    return 'Are you sure want to delete stream?';
  }
  return 'Are you sure want to stop streaming?';
};

const streamMemoRegex = /recurring_payment_(.+)/;
const streamIdRegex = /(.*)_(.+)/;

export const createMemo = (name) => {
  const id = utf8ToB64(`${name || ''}_${Date.now()}`);
  return `recurring_payment_${id}`;
};

const decodeNameFromStreamMemo = (memo) => {
  let name;
  const matches = streamMemoRegex.exec(memo);
  if (matches) {
    const [, encodedId] = matches;
    const idMatches = streamIdRegex.exec(b64ToUtf8(encodedId));
    if (idMatches) {
      [, name] = idMatches;
    }
  }

  return name;
};

const isStreamMemo = memo => memo && streamMemoRegex.test(memo);

export const flattenGroupInvoices = compose(
  flatten,
  values,
);

export const groupInvoices = initialGroups =>
  compose(
    reduce((groups, invoice) => {
      let newInvoice;
      let key;
      if (isStreamMemo(invoice.memo)) {
        key = invoice.memo;
        const amount = ((groups[key] && groups[key].amount) || 0) + parseInt(invoice.value, 10);
        newInvoice = {
          ...(groups[key] || {}),
          id: invoice.memo,
          amount,
          date: invoice.settle_date,
          name: decodeNameFromStreamMemo(invoice.memo) || AppConfig.incomingStreamName,
          status: Types.INCOMING,
          paymentRequest: invoice.payment_request,
          paymentType: Types.LIGHTNING,
          paymentSubType: Types.STREAM,
        };
      } else {
        key = 'others';
        newInvoice = [
          ...(groups[key] || []),
          {
            id: invoice.payment_request,
            amount: invoice.value,
            date: invoice.settle_date,
            name: getDefaultPaymentName(
              invoice.description || invoice.memo || invoice.name,
              Types.LIGHTNING,
              true,
            ),
            status: Types.INCOMING,
            paymentRequest: invoice.payment_request,
            paymentType: Types.LIGHTNING,
            paymentSubType: Types.REGULAR,
          },
        ];
      }

      return {
        ...groups,
        [key]: newInvoice,
      };
    }, initialGroups),
    filter(prop('settled')),
  );

export const groupPayments = compose(
  flatten,
  values,
  reduce((groups, payment) => {
    const stream = StreamData.getByPayment(payment.payment_hash);
    let key;
    let newPayment;
    if (stream) {
      key = stream.id;
      newPayment = {
        ...(groups[key] || {}),
        id: payment.payment_hash,
        amount: ((groups[key] && groups[key].amount) || 0) + parseInt(-payment.value, 10),
        name: stream.name || AppConfig.outgoingStreamName,
        address: has('path')(payment) ? last(payment.path) : '',
        date: payment.creation_date,
        status: Types.SUCCESS,
        paymentType: Types.LIGHTNING,
        paymentSubType: Types.STREAM,
      };
    } else {
      key = 'others';
      newPayment = [
        ...(groups[key] || []),
        {
          id: payment.payment_hash,
          name: getDefaultPaymentName(payment.name, Types.LIGHTNING),
          address: has('path')(payment) ? last(payment.path) : '',
          amount: -payment.value,
          date: payment.creation_date,
          status: Types.SUCCESS,
          paymentType: Types.LIGHTNING,
          paymentSubType: Types.REGULAR,
        },
      ];
    }

    return {
      ...groups,
      [key]: newPayment,
    };
  }, {}),
);
