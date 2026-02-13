
import * as OTPAuth from 'otpauth';
import { OTPAccount, OTPCode } from '../types';

export const generateCode = (account: OTPAccount): OTPCode => {
  const totp = new OTPAuth.TOTP({
    issuer: account.issuer,
    label: account.account,
    algorithm: account.algorithm,
    digits: account.digits,
    period: account.period,
    secret: account.secret,
  });

  const code = totp.generate();
  
  // Calculate remaining time in the current window
  const epoch = Math.floor(Date.now() / 1000);
  const remainingTime = account.period - (epoch % account.period);

  return {
    accountId: account.id,
    code,
    remainingTime,
  };
};

export const parseOtpAuthUri = (uri: string): Partial<OTPAccount> | null => {
  try {
    const totp = OTPAuth.URI.parse(uri);
    if (!(totp instanceof OTPAuth.TOTP)) return null;

    return {
      issuer: totp.issuer || 'Unknown',
      account: totp.label || 'Unknown',
      secret: totp.secret.base32,
      algorithm: (totp.algorithm as any) || 'SHA1',
      digits: totp.digits || 6,
      period: totp.period || 30,
    };
  } catch (e) {
    console.error('Failed to parse OTP URI', e);
    return null;
  }
};
