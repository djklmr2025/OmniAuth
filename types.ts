
export interface OTPAccount {
  id: string;
  issuer: string;
  account: string;
  secret: string;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  digits: number;
  period: number;
  createdAt: number;
}

export interface OTPCode {
  accountId: string;
  code: string;
  remainingTime: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ADD_MANUAL = 'ADD_MANUAL',
  ADD_QR = 'ADD_QR',
  SETTINGS = 'SETTINGS',
  AI_HELP = 'AI_HELP',
  LOCK = 'LOCK'
}
