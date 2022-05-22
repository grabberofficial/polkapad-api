import { values } from 'lodash';
import secureHelmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';
import { isProduction, port } from 'config/system';
import { AppModule } from 'modules';

import * as filters from './filters';
import * as pipes from './pipes';

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

    if (isProduction) {
      this.app.use(secureHelmet());
    }

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
    this.app = await NestFactory.create(AppModule);

    this.applyFilters();
    this.applyPipes();
    this.applyMiddlewares();

    if (!isProduction) {
      this.setupSwagger();
    }

    await this.app.listen(port);

    // eslint-disable-next-line no-console
    console.log(`Server is running on localhost:${port}`);
  }
}
