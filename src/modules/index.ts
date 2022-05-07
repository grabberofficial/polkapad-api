import { values, omit } from 'lodash';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import * as services from 'services';
import * as workers from 'workers';

import * as controllers from 'controllers';

import JwtModule from './jwt.module';
import ScheduleModule from './schedule.module';

@Module({
  imports: [PassportModule, JwtModule, ScheduleModule],
  controllers: values(controllers),
  providers: [...values(omit(services, 'JwtService')), ...values(workers)]
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(consumer: MiddlewareConsumer): void {
    // values(middlewares).forEach(middleware => {
    //   consumer.apply(middleware).forRoutes('/');
    // });
  }
}
