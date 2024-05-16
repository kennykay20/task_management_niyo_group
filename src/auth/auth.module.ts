import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: config.Secret,
      signOptions: { expiresIn: `${config.jwtexpire}s` },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
