import { Response } from 'express';
import mongoose from 'mongoose';
// import DocNotFoundError from '../errors/docNotFoundError';
import CodesHTTPStatus from '../types/codes';
// import UnauthorizedError from '../errors/unauthorizedError';
// import ForbiddenError from '../errors/forbiddenError';

/* const handleErrors = (err: any, res: Response) => {
  if (err instanceof DocNotFoundError) {
    return res.status(CodesHTTPStatus.NOT_FOUND).json({
      message: err.message,
    });
  }
  if (err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError) {
    return res.status(CodesHTTPStatus.BAD_REQUEST).json({
      message: `Переданы некорректные данные: ${err.message}`,
    });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(CodesHTTPStatus.UNAUTHORIZED).json({
      message: err.message,
    });
  }
  if (err instanceof ForbiddenError) {
    return res.status(CodesHTTPStatus.FORBIDDEN).json({
      message: err.message,
    });
  }
  if (err.name === 'MongoServerError') {
    return res.status(CodesHTTPStatus.CONFLICT).json({
      message: `Повторное использование ${Object.keys(err.keyValue)[0]} -
      ${Object.values(err.keyValue)[0]}, который должен быть уникальным.
      Используйте другой ${Object.keys(err.keyValue)[0]}.`,
    });
  }
  return res.status(CodesHTTPStatus.DEFAULT).json({
    message: `Произошла ошибка: ${err}`,
  });
}; */

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
      message: `Произошла ошибка: ${err}`,
    });
  } else {
    res.status(err.statusCode).json(err.message);
  }
};

export default handleErrors;
