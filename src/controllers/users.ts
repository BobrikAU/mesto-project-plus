import { Request, Response } from 'express';
import User from '../models/user';
import { RequestWithId } from '../types/interfaces';
import { handleError, updateInfo } from '../helpers/users';
import CodesHTTPStatus from '../types/codes';
import DocNotFoundError from '../errors/docNotFoundError';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    handleError(err, res);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user === null) {
      throw new DocNotFoundError('User not found');
    }
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(CodesHTTPStatus.DocCreated).json(user);
  } catch (err) {
    handleError(err, res);
  }
};

interface IUpdateUserBody {
  name: string;
  about: string;
}
export const updateUserInfo = async (
  req: RequestWithId<IUpdateUserBody>,
  res: Response,
) => {
  const { name, about } = req.body;
  await updateInfo<IUpdateUserBody>(req, res, { name, about });
};

interface IUpdateAvatarBody {
  avatar: string;
}
export const updateAvatar = async (
  req: RequestWithId<IUpdateAvatarBody>,
  res: Response,
) => {
  const { avatar } = req.body;
  await updateInfo<IUpdateAvatarBody>(req, res, { avatar });
};
