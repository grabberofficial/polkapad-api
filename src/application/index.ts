import { values } from 'lodash';
// import secureHelmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';
import * as filters from './filters';
import * as pipes from './pipes';

import { AppModule } from 'modules';

export class Application {
  private app: INestApplication;

  private applyFilters() {
    values(filters).forEach((Filter) => {
      this.app.useGlobalFilters(new Filter());
    });
  }

  private applyPipes() {
    values(pipes).forEach((Pipe) => {
      this.app.useGlobalPipes(new Pipe());
    });
  }

  private applyMiddlewares() {
    this.app.use(json({ limit: '2mb' }));

    // if (IS_PRODUCTION) {
    //   this.app.use(secureHelmet());
    // }

    this.app.enableCors({
      credentials: true,
      origin: true
    });
  }

  private setupSwagger(): any {
    const options = new DocumentBuilder()
      .setTitle('Polkapad API')
      .setDescription('Polkapad API')
      // .setVersion(VERSION)
      .addTag('polkapad-api')
      .build();

    const document = SwaggerModule.createDocument(this.app, options);

    SwaggerModule.setup('swagger', this.app, document, {
      customSiteTitle: 'Polkapad API'
    });
  }

  public async bootstrap(): Promise<any> {
    const port = 3000;

    this.app = await NestFactory.create(AppModule);

    this.applyFilters();
    this.applyPipes();
    this.applyMiddlewares();

    // if (!IS_PRODUCTION) {
    this.setupSwagger();
    // }

    await this.app.listen(port);

    // eslint-disable-next-line no-console
    console.log(`Server is running on localhost:${port}`);
  }
}
