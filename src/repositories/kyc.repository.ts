import { Injectable } from '@nestjs/common';
import { callbackUrl, redirectUrl, token } from 'config/kyc';
import { ApiRepository } from './base';

@Injectable()
export class KycRepository extends ApiRepository {
  public async getVerificationUrl(
    reference: string,
    email?: string
  ): Promise<string> {
    const payload = {
      reference,
      email,
      callback_url: callbackUrl,
      redirect_url: redirectUrl,
      verification_mode: 'any',
      ttl: 10,
      face: {
        proof: ''
      },
      document: {
        proof: '',
        supported_types: ['id_card', 'passport', 'driving_license'],
        verification_instructions: {
          allow_scanned: '1',
          allow_screenshot: '1',
          allow_photocopy: '1'
        },
        additional_proof: '',
        name: '',
        dob: '',
        age: '',
        document_number: '',
        expiry_date: '',
        issue_date: '',
        allow_offline: '1',
        allow_online: '1',
        gender: ''
      }
    };

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
