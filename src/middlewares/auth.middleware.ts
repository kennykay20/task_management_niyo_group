import { Inject, Injectable, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticationMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);
  constructor(
    @Inject()
    private userSvc: UserService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(AuthenticationMiddleware.name);

    // TODO: Authenticate the request
    const userId = '123';
    this.userSvc.getUserById(userId);

    next();
  }
}
