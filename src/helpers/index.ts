import { Response } from 'express';
import mongoose from 'mongoose';
import CodesHTTPStatus from '../types/codes';
import DocNotFoundError from '../errors/docNotFoundError';

const handleErrors = (err: any, res: Response, typeDoc: string) => {
  if ((err instanceof mongoose.Error.CastError && err.path === '_id')
    || err instanceof DocNotFoundError) {
    return res.status(CodesHTTPStatus.NOT_FOUND).json({
      message: typeDoc === 'user'
        ? 'Запрошенный пользователь не найден'
        : 'Запрошенная карточка не найдена',
    });
  }
  if (err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError) {
    return res.status(CodesHTTPStatus.BAD_REQUEST).json({
      message: `Переданы некорректные данные: ${err.message}`,
    });
  }
  return res.status(CodesHTTPStatus.DEFAULT).json({
    message: `Произошла ошибка: ${err}`,
  });
};

export default handleErrors;
