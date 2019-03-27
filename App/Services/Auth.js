const SIGNUP_REGEX = /(.+?)\n(.+?)\s*\n((?:.|[\n])+----)/;
export function transformSignupQrCode(data) {
  const matched = SIGNUP_REGEX.exec(data);
  if (!matched || matched.length !== 4) {
    return null;
  }

  const [, host, macaroons, tlcCert] = matched;
  return { host, macaroons, tlcCert };
}
