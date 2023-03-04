import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import DocNotFoundError from '../errors/docNotFoundError';
import User from '../models/user';
import { RequestWithId } from '../types/interfaces';
import handleError from '../helpers/index';
import CodesHTTPStatus from '../types/codes';
import UnauthorizedError from '../errors/unauthorizedError';

require('dotenv').config();

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

function makeHashPassword(password: string) {
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
}

export const createNewUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  const hashPassword = makeHashPassword(password);
  try {
    const user = await User.create({
      email,
      password: hashPassword,
      name,
      about,
      avatar,
    });
    res.status(CodesHTTPStatus.DOC_CREATED).json(user);
  } catch (err) {
    handleError(err, res, 'user');
  }
};

export const login = async (req: RequestWithId, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .orFail(new UnauthorizedError('Передан неправильный адрес электронной почты или неверный пароль'))
      .exec();
    const isPasswordTrue = bcrypt.compareSync(password, user.password);
    if (!isPasswordTrue) {
      throw new UnauthorizedError('Передан неправильный адрес электронной почты или неверный пароль');
    }
    const secretKey = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret';
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
    res
      .cookie(
        'token',
        token,
        {
          expires: new Date(Date.now() + 3600000 * 24 * 7),
          httpOnly: true,
          sameSite: 'strict',
        },
      )
      .send();
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
