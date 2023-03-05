import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithId } from '../types/interfaces';
import UnauthorizedError from '../errors/unauthorizedError';

require('dotenv').config();

const authorization = (req: RequestWithId, res: Response, next: NextFunction) => {
  if (req.cookies) {
    const { token } = req.cookies;
    const secretKey = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret';
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
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
