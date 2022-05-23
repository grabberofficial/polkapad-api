const { KYC_REDIRECT_URL, KYC_CLIENT_ID, KYC_SECRET_KEY } = process.env;

export const redirectUrl = KYC_REDIRECT_URL;
export const token = `${KYC_CLIENT_ID}:${KYC_SECRET_KEY}`;
