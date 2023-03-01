import { Response } from 'express';
import { RequestWithId } from '../types/interfaces';
import User from '../models/user';
import CodesHTTPStatus from '../types/codes';
import DocNotFoundError from '../errors/docNotFoundError';

export const handleError = (err: any, res: Response) => {
  if ((err.name === 'CastError' && err.path === '_id') || err.name === 'DocNotFoundError') {
    return res.status(CodesHTTPStatus.NotFound).json({
      message: 'Запрошенный пользователь не найден',
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

interface IBody {
  [name: string]: string;
}
export async function updateInfo<T>(req: RequestWithId<T>, res: Response, body: IBody) {
  if (req.user) {
    const userId = req.user._id;
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        body,
        {
          returnDocument: 'after',
          runValidators: true,
        },
      );
      if (user === null) {
        throw new DocNotFoundError('User not found');
      }
      res.json(user);
    } catch (err) {
      handleError(err, res);
    }
  } else {
    res.status(CodesHTTPStatus.BadReq).json({ message: 'Id пользователя не передано' });
  }
}
