import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { config } from '../config';
import { error } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthenticationMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);
  constructor(
    @Inject(UserService)
    private userSvc: UserService,
    @Inject(AuthService)
    private authSvc: AuthService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(AuthenticationMiddleware.name);
    const secret = config.Secret;
    let token = '';
    console.log('originUrl', req.originalUrl);
    // TODO: Authenticate the request
    const headers = req.headers;
    if (headers['authorization'] === undefined) {
      return error(
        res,
        401,
        'no authorization header',
        'authorization header is required for this route',
      );
    }

    token = headers['authorization'].split(' ')[1];
    if (token === undefined) {
      return error(
        res,
        401,
        'no authorization token',
        'authorization token is required, token for this route in the format: <Bearer token>',
      );
    }

    try {
      const { username, userId } = await this.authSvc.verifyToken(
        token,
        secret,
      );
      let user = await this.userSvc.getUserById(userId);
      user = typeof user === 'string' ? JSON.parse(user) : user;

      if (user.isActive === false) {
        throw new UnauthorizedException();
      }

      req.headers['user'] = JSON.stringify({
        id: user.id,
        email: username,
      });
    } catch (err) {
      Logger.log(err);
      if (req.originalUrl === '/v1/auth/login') {
        if (req.headers && req.headers.authorization)
          delete req.headers.authorization;
        return res.redirect(302, '/v1/auth/login');
      }
      return error(res, 401, err.name, err.message);
    }
    next();
  }
}
