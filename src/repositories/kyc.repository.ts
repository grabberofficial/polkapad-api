import { Injectable } from '@nestjs/common';
import { callbackUrl, redirectUrl, token } from 'config/kyc';
import { ApiRepository } from './base';

@Injectable()
export class KycRepository extends ApiRepository {
  public async getVerificationUrl(kycId: string): Promise<string> {
    const payload = {
      reference: kycId,
      callback_url: callbackUrl,
      redirect_url: redirectUrl,
      verification_mode: 'any',
      ttl: 60,
      face: {
        proof: ''
      },
      document: {
        proof: '',
        additional_proof: '',
        name: '',
        dob: '',
        age: '',
        document_number: '',
        expiry_date: '',
        issue_date: '',
        allow_offline: '1',
        allow_online: '1',
        supported_types: ['id_card', 'passport'],
        gender: ''
      }
    };

    console.log('KycRepository-getVerificationUrl-callbackUrl', callbackUrl);
    console.log('KycRepository-getVerificationUrl-redirectUrl', redirectUrl);
    console.log('KycRepository-getVerificationUrl-payload');
    console.log(payload);

    const kycResponse = await this.postRequest(
      'https://api.shuftipro.com/',
      payload,
      {
        Authorization: `Basic ${Buffer.from(token).toString('base64')}`
      }
    );

    return kycResponse?.verification_url;
  }
}
