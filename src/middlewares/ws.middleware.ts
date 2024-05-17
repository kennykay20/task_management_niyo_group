import { Socket } from 'socket.io';
import { WsJwtGuard } from 'src/guards/ws-jwt/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
  const jwtService = new JwtService();
  console.log('jwtService ', jwtService);
  return (client, next) => {
    try {
      WsJwtGuard.validateToken(client, jwtService);
      next();
    } catch (error) {
      next(error);
    }
  };
};
