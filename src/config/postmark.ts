const { POSTMARK_TOKEN, POSTMARK_FROM } = process.env;

export const token = POSTMARK_TOKEN;
export const from = POSTMARK_FROM || 'hello@polkapad.network';
