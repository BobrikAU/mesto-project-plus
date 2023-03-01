import { Response } from 'express';
import CodesHTTPStatus from '../types/codes';

const handleErrors = (err: any, res: Response) => {
  if ((err.name === 'CastError' && err.path === '_id') || err.name === 'DocNotFoundError') {
    return res.status(CodesHTTPStatus.NotFound).json({
      message: 'Запрошенная карточка не найдена',
    });
  }
  if ((err.name === 'CastError' && err.path !== '_id') || err.name === 'ValidationError') {
    return res.status(CodesHTTPStatus.BadReq).json({
      message: `Переданы некорректные данные: ${err.message}`,
    });
  }
  return res.status(CodesHTTPStatus.Default).json({
    message: `Произошла ошибка: ${err}`,
  });
};

export default handleErrors;
