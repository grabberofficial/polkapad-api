import { stringify as qsStringify } from 'qs';
import { Injectable } from '@nestjs/common';
import { ServerClient, TemplatedMessage } from 'postmark';

import { UserModel } from 'models';
import { token, from } from 'config/postmark';
import { frontendUrl } from 'config/system';

const PRODUCT_NAME = 'Polkapad';

const MAGIC_LINK_TEMPLATE = 'magic-link';
const PASSWORD_RESET_TEMPLATE = 'password-reset';

@Injectable()
export class MailService {
  client: ServerClient;

  constructor() {
    this.client = new ServerClient(token);
  }

  send(to: string, templateName: string, templateModel: object) {
    const options: TemplatedMessage = {
      From: from,
      To: to,
      TemplateAlias: templateName,
      TemplateModel: templateModel,
      TrackOpens: false
    };

    return this.client.sendEmailWithTemplate(options);
  }

  async sendMagicLinkToUser(user: UserModel, code: string) {
    const query = qsStringify({ email: user.email, code });

    const actionUrl = `https://${frontendUrl}/auth/magic-link?${query}`;

    const model = {
      action_url: actionUrl,
      name: user.name,
      product_name: PRODUCT_NAME
    };

    await this.send(user.email, MAGIC_LINK_TEMPLATE, model);
  }

  async sendResetPasswordToUser(user: UserModel, code: string) {
    const query = qsStringify({ email: user.email, code });

    const actionUrl = `https://${frontendUrl}/auth/password-reset?${query}`;

    const model = {
      action_url: actionUrl,
      name: user.name,
      product_name: PRODUCT_NAME
    };

    await this.send(user.email, PASSWORD_RESET_TEMPLATE, model);
  }
}
