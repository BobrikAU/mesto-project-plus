import { Request, Response } from 'express';
import DocNotFoundError from '../errors/docNotFoundError';
import User from '../models/user';
import { RequestWithId } from '../types/interfaces';
import handleError from '../helpers/index';
import CodesHTTPStatus from '../types/codes';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    handleError(err, res, 'user');
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).orFail(new DocNotFoundError('User not found'));
    res.json(user);
  } catch (err) {
    handleError(err, res, 'user');
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(CodesHTTPStatus.DOC_CREATED).json(user);
  } catch (err) {
    handleError(err, res, 'user');
  }
};

interface IBody {
  [name: string]: string;
}
async function updateInfo(
  userId: string,
  data: IBody,
  res: Response,
) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      data,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    ).orFail(new DocNotFoundError('User not found'));
    res.json(user);
  } catch (err) {
    handleError(err, res, 'user');
  }
}

interface IUpdateUserBody extends IBody {
  name: string;
  about: string;
}
export const updateUserInfo = async (
  req: RequestWithId<IUpdateUserBody>,
  res: Response,
) => {
  if (req.user) {
    const userId = req.user._id;
    const data = req.body;
    await updateInfo(userId, data, res);
  }
};

interface IUpdateAvatarBody extends IBody {
  avatar: string;
}
export const updateAvatar = async (
  req: RequestWithId<IUpdateAvatarBody>,
  res: Response,
) => {
  if (req.user) {
    const userId = req.user._id;
    const data = req.body;
    await updateInfo(userId, data, res);
  }
};
