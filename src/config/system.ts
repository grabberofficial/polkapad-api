import * as dotenv from 'dotenv'
dotenv.config();

const {
  NODE_ENV,
  PORT,
  SERVICE_URL,
  FRONTEND_URL,
  BINANCE_RPC_PROVIDER,
  POLKADOT_RPC_PROVIDER,
  POLKADOT_BNB_CONTRACT_ADDRESS
} = process.env;

export const isProduction = NODE_ENV === 'production';
export const port = PORT || 3000;
export const serviceUrl = SERVICE_URL;
export const frontendUrl = FRONTEND_URL;

export const binanceProvider = BINANCE_RPC_PROVIDER;
export const polkadotProvider = POLKADOT_RPC_PROVIDER;

export const polkadotBnbContract = POLKADOT_BNB_CONTRACT_ADDRESS;
