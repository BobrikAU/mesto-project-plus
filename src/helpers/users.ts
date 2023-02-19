import { Response } from 'express';
import { RequestWithId } from '../types/interfaces';
import User from '../models/user';
import CodesErrors from '../types/codesErrors';

export const handleError = (err: any, res: Response) => {
  if ((err.name === 'CastError' && err.path === '_id') || err.message === 'null') {
    return res.status(CodesErrors.NotFound).json({
      message: 'Запрошенный пользователь не найден',
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

interface IBody {
  [name: string]: string;
}
export async function updateInfo<T>(req: RequestWithId<T>, res: Response, body: IBody) {
  if (req.user) {
    const userId = req.user._id;
    await User.findByIdAndUpdate(
      userId,
      body,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    )
      .then((user) => {
        if (user === null) {
          throw new Error('null');
        }
        res.json(user);
      })
      .catch((err) => handleError(err, res));
  } else {
    res.status(400).json({ message: 'Id пользователя не передано' });
  }
}
