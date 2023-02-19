import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { RequestWithId } from '../types/interfaces';
import { handleError, updateInfo } from '../helpers/users';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  await User.find({})
    .then((users) => res.json(users))
    .catch((err) => handleError(err, res));
  next();
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  await User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new Error('null');
      }
      res.json(user);
    })
    .catch((err) => handleError(err, res));
  next();
};

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  await User.create({ name, about, avatar })
    .then((user) => res.json(user))
    .catch((err) => handleError(err, res));
  next();
};

interface IUpdateUserBody {
  name: string;
  about: string;
}
export const updateUserInfo = async (
  req: RequestWithId<IUpdateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  await updateInfo<IUpdateUserBody>(req, res, { name, about });
  next();
};

interface IUpdateAvatarBody {
  avatar: string;
}
export const updateAvatar = async (
  req: RequestWithId<IUpdateAvatarBody>,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  await updateInfo<IUpdateAvatarBody>(req, res, { avatar });
  next();
};
