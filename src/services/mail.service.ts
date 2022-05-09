import {
  Injectable,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { ServerClient, TemplatedMessage } from 'postmark';

import { UserModel } from 'models';

const DEFAULT_FROM = 'hello@polkapad.network';
const PRODUCT_NAME = 'Polkapad';
const DOMAIN = 'app.polkapad.codes';

const MAGIC_LINK_TEMPLATE = 'magic-link';
const PASSWORD_RESET_TEMPLATE = 'password-reset';

@Injectable()
export class MailService {
  private readonly logger = new Logger('Mailervice');

  client: ServerClient;

  constructor() {
    // TODO: move api key to configs
    // console.log('postmark', postmark)
    this.client = new ServerClient('e30ca405-d34c-49e2-b9fa-aec0c80e1f71');
  }

  test(): ServerClient {
    return this.client;
  }

  async send(to, templateName: string, templateModel: object) {
    // try {
    const from = DEFAULT_FROM;

    const options: TemplatedMessage = {
      From: from,
      To: to || 'test@email.com',
      TemplateAlias: templateName,
      TemplateModel: templateModel,
      TrackOpens: false
    };

    // console.log('sending:', options)
    const response = await this.client.sendEmailWithTemplate(options);
    return response;
    // } catch (e) {
    //   console.log('e', e);
    //   throw new InternalServerErrorException(`Can't send email to ${to}`);
    // }
  }

  async sendMagicLinkToUser(user: UserModel, code: string) {
    const actionUrl = `https://${DOMAIN}/auth/magic-link?emal=${user.email}&code=${code}`;
    const model = {
      action_url: actionUrl,
      name: user.name,
      product_name: PRODUCT_NAME
    };
    await this.send(user.email, MAGIC_LINK_TEMPLATE, model);
  }

  async sendResetPasswordToUser(user: UserModel, code: string) {
    const actionUrl = `https://${DOMAIN}/auth/password-reset?emal=${user.email}&code=${code}`;
    const model = {
      action_url: actionUrl,
      name: user.name,
      product_name: PRODUCT_NAME
    };
    await this.send(user.email, PASSWORD_RESET_TEMPLATE, model);
  }
}
