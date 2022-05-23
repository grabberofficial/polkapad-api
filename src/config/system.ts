const { NODE_ENV, PORT, SERVICE_URL } = process.env;

export const isProduction = NODE_ENV === 'production';
export const port = PORT || 3000;
export const serviceUrl = SERVICE_URL;
