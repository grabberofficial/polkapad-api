const { NODE_ENV, PORT, DOMAIN } = process.env;

export const isProduction = NODE_ENV === 'production';
export const port = PORT || 3000;
export const domain = DOMAIN;
