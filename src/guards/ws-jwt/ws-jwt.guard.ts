import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { config } from 'src/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const jwtService = new JwtService();
    const client: Socket = context.switchToWs().getClient();

    WsJwtGuard.validateToken(client, jwtService);
    return true;
  }

  static validateToken = async (client: Socket, jwtSvc: JwtService) => {
    try {
      const { authorization } = client.handshake.headers;
      const token: string = authorization.split(' ')[1];
      const payload = await jwtSvc.verifyAsync(token, {
        secret: config.Secret,
      });
      return payload;
    } catch (error) {
      Logger.log(error);
    }
  };
}
