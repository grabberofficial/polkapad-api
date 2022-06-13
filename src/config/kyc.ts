import { serviceUrl } from 'config/system';

const { KYC_REDIRECT_URL, KYC_CLIENT_ID, KYC_SECRET_KEY } = process.env;

export const secretKey = KYC_SECRET_KEY;
export const redirectUrl = KYC_REDIRECT_URL;
export const callbackUrl = `https://${serviceUrl}/kyc/callback`;
export const token = `${KYC_CLIENT_ID}:${KYC_SECRET_KEY}`;
