import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { RequestWithId } from '../types/interfaces';
import UnauthorizedError from '../errors/unauthorizedError';

const authorization = (req: RequestWithId, res: Response, next: NextFunction) => {
  if (req.cookies) {
    const { token } = req.cookies;
    jwt.verify(token, config.JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        const error = new UnauthorizedError('Ошибка авторизации. Пройдите авторизацию');
        next(error);
      } else {
        req.user = { _id: decoded._id };
        next();
      }
    });
  }
};

export default authorization;
