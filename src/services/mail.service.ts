import { Injectable } from '@nestjs/common';
import { ServerClient, TemplatedMessage } from 'postmark';

import { UserModel } from 'models';
import { token } from 'config/postmark';

const DEFAULT_FROM = 'hello@polkapad.network';
const PRODUCT_NAME = 'Polkapad';
const DOMAIN = 'app.polkapad.codes';

const MAGIC_LINK_TEMPLATE = 'magic-link';
const PASSWORD_RESET_TEMPLATE = 'password-reset';

@Injectable()
export class MailService {
  client: ServerClient;

  constructor() {
    this.client = new ServerClient(token);
  }

  test(): ServerClient {
    return this.client;
  }

  send(to, templateName: string, templateModel: object) {
    const options: TemplatedMessage = {
      From: DEFAULT_FROM,
      To: to || 'test@email.com',
      TemplateAlias: templateName,
      TemplateModel: templateModel,
      TrackOpens: false
    };

    return this.client.sendEmailWithTemplate(options);
  }

  async sendMagicLinkToUser(user: UserModel, code: string) {
    const actionUrl = `https://${DOMAIN}/auth/magic-link?email=${user.email}&code=${code}`;
    const model = {
      action_url: actionUrl,
      name: user.name,
      product_name: PRODUCT_NAME
    };
    await this.send(user.email, MAGIC_LINK_TEMPLATE, model);
  }

  async sendResetPasswordToUser(user: UserModel, code: string) {
    const actionUrl = `https://${DOMAIN}/auth/password-reset?email=${user.email}&code=${code}`;
    const model = {
      action_url: actionUrl,
      name: user.name,
      product_name: PRODUCT_NAME
    };
    await this.send(user.email, PASSWORD_RESET_TEMPLATE, model);
  }
}
