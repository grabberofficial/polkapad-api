import { Injectable } from '@nestjs/common';
import { ServerClient, TemplatedMessage } from 'postmark';

import { token, from } from 'config/postmark';

const PRODUCT_NAME = 'Polkapad';
const MAGIC_CODE_TEMPLATE = 'magic-code';

@Injectable()
export class PostmarkService {
  client: ServerClient;

  constructor() {
    this.client = new ServerClient(token);
  }

  private sendMail(to: string, templateName: string, templateModel: object) {
    const options: TemplatedMessage = {
      From: from,
      To: to,
      TemplateAlias: templateName,
      TemplateModel: templateModel,
      TrackOpens: false
    };

    return this.client.sendEmailWithTemplate(options);
  }

  public sendMagicCode(email: string, code: string) {
    const model = {
      product_name: PRODUCT_NAME,
      code
    };

    return this.sendMail(email, MAGIC_CODE_TEMPLATE, model);
  }
}
