import { Response } from 'express';
import mongoose from 'mongoose';
import CodesHTTPStatus from '../types/codes';

const handleErrors = (err: any, res: Response) => {
  if (err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError) {
    res.status(CodesHTTPStatus.BAD_REQUEST).json({
      message: `Переданы некорректные данные: ${err.message}`,
    });
  } else if (err.name === 'MongoServerError') {
    res.status(CodesHTTPStatus.CONFLICT).json({
      message: `Повторное использование ${Object.keys(err.keyValue)[0]} - ${Object.values(err.keyValue)[0]}, который должен быть уникальным. Используйте другой ${Object.keys(err.keyValue)[0]}.`,
    });
  } else if (!err.statusCode) {
    res.status(CodesHTTPStatus.DEFAULT).json({
      message: 'На сервере произошла ошибка',
    });
  } else {
    res.status(err.statusCode).json(err.message);
  }
};

export default handleErrors;
