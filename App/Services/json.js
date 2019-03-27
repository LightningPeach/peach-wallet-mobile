export const jsonParseSilently = (data) => {
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    console.log('jsonParseSilently', e);
  }
  return parsed;
};
