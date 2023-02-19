import { Response } from 'express';
import CodesErrors from '../types/codesErrors';

const handleErrors = (err: any, res: Response) => {
  if ((err.name === 'CastError' && err.path === '_id') || err.message === 'null') {
    return res.status(CodesErrors.NotFound).json({
      message: 'Запрошенная карточка не найдена',
    });
  }
  if ((err.name === 'CastError' && err.path !== '_id') || err.name === 'ValidationError') {
    return res.status(CodesErrors.BadReq).json({
      message: `Переданы некорректные данные: ${err.message}`,
    });
  }
  return res.status(CodesErrors.Default).json({
    message: `Произошла ошибка: ${err}`,
  });
};

export default handleErrors;
