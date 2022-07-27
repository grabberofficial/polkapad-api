import { stringify as qsStringify } from 'qs';
import { Injectable } from '@nestjs/common';
import { token } from 'config/getresponse';
import { ApiRepository } from './base';
import { uniqBy } from 'lodash';

@Injectable()
export class GetresponseRepository extends ApiRepository {
  private readonly baseUrl: string = 'https://api.getresponse.com/v3';

  public getContactsList(
    query: any = {},
    page = 1,
    perPage = 100
  ): Promise<any[]> {
    const payload = {
      ...query,
      page,
      perPage
    };

    return this.getRequest(
      `${this.baseUrl}/contacts?${qsStringify(payload)}`,
      undefined,
      {
        'X-Auth-Token': `api-key ${token}`
      }
    );
  }

  public createContact(
    campaignId: string,
    email: string,
    tagId?: string
  ): Promise<void> {
    const payload = {
      campaign: {
        campaignId
      },
      email,
      ...(tagId
        ? {
            tags: [
              {
                tagId
              }
            ]
          }
        : {})
    };

    return this.postRequest(`${this.baseUrl}/contacts`, payload, {
      'X-Auth-Token': `api-key ${token}`
    });
  }

  public getContactById(contactId: string) {
    return this.getRequest(`${this.baseUrl}/contacts/${contactId}`, undefined, {
      'X-Auth-Token': `api-key ${token}`
    });
  }

  public async upsertContactTag(
    campaignId: string,
    email: string,
    tagId: string
  ): Promise<void> {
    const [foundContact] = await this.getContactsList(
      {
        'query[email]': email,
        'query[campaignId]': campaignId
      },
      1,
      1
    );

    if (!foundContact || foundContact.email !== email) {
      await this.createContact(campaignId, email, tagId);
    } else {
      const contact = await this.getContactById(foundContact.contactId);
      const tags = uniqBy(
        [...(contact.tags || []).map((c) => ({ tagId: c.tagId })), { tagId }],
        'tagId'
      );

      await this.postRequest(
        `${this.baseUrl}/contacts/${contact.contactId}/tags`,
        {
          tags
        },
        {
          'X-Auth-Token': `api-key ${token}`
        }
      );
    }
  }
}
