import Errors, { handleLndResponseError } from './Errors';

test('Test error handlers', () => {
  const response = {
    bodyString: JSON.stringify({
      error: `  unable to route payment to destination:
    Temporary channel failure(......)
    `,
    }),
  };
  expect(handleLndResponseError('default error', response, 'error')).toEqual(Errors.EXCEPTION_LND_UNABLE_ROUTE);
});
