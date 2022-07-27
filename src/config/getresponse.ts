import { AnalyticsEventTypeEnum } from 'abstractions/enums';

const { GETRESPONSE_TOKEN } = process.env;

export const token = GETRESPONSE_TOKEN;

export const campaignId = 'LWXOd';

export const tagsIds = {
  [AnalyticsEventTypeEnum.Registration]: 'VRm5I',
  [AnalyticsEventTypeEnum.RegistrationWait]: 'VR2Dt',
  [AnalyticsEventTypeEnum.StartedConnectionBinance]: 'VRmZW',
  [AnalyticsEventTypeEnum.StartedConnectionPolkadot]: 'VRmiS',
  [AnalyticsEventTypeEnum.WalletAdded]: 'VRmff',
  [AnalyticsEventTypeEnum.StartKyc]: 'VRmuc',
  [AnalyticsEventTypeEnum.KycSuccess]: 'VRmOl'
};
