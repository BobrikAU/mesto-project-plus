import { Response } from 'express';
import CodesHTTPStatus from '../types/codes';

const handleErrors = (err: any, res: Response, typeDoc: string) => {
  if ((err.name === 'CastError' && err.path === '_id') || err.name === 'DocNotFoundError') {
    return res.status(CodesHTTPStatus.NOT_FOUND).json({
      message: typeDoc === 'user'
        ? 'Запрошенный пользователь не найден'
        : 'Запрошенная карточка не найдена',
    });
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(CodesHTTPStatus.BAD_REQUEST).json({
      message: `Переданы некорректные данные: ${err.message}`,
    });
  }
  return res.status(CodesHTTPStatus.DEFAULT).json({
    message: `Произошла ошибка: ${err}`,
  });
};

export default handleErrors;
