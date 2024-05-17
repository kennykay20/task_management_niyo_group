import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { databaseSourceOptions } from './database/database.source';
import { AuthenticationMiddleware } from './middlewares/auth.middleware';
import { EventGatewayModule } from './gateway/gateway.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseSourceOptions),
    UserModule,
    AuthModule,
    TaskModule,
    EventGatewayModule,
    JwtModule.register({
      global: true,
      secret: config.Secret,
      signOptions: { expiresIn: `${config.jwtexpire}s` },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: '/v1/users/register', method: RequestMethod.POST },
        { path: '/v1/auth/login', method: RequestMethod.POST },
        { path: '/', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
