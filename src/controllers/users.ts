import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import DocNotFoundError from '../errors/docNotFoundError';
import User from '../models/user';
import { RequestWithId } from '../types/interfaces';
import CodesHTTPStatus from '../types/codes';
import UnauthorizedError from '../errors/unauthorizedError';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

async function getUserById(userId: string, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(userId).orFail(
      new DocNotFoundError('Запрошенный пользователь не найден'),
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export const getYourself = async (req: RequestWithId, res: Response, next: NextFunction) => {
  if (req.user) {
    const userId = req.user._id;
    await getUserById(userId, res, next);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  await getUserById(userId, res, next);
};

function makeHashPassword(password: string) {
  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
}

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
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
    next(err);
  }
};

export const login = async (req: RequestWithId, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(new UnauthorizedError('Передан неправильный адрес электронной почты или неверный пароль'))
      .exec();
    const isPasswordTrue = bcrypt.compareSync(password, user.password);
    if (!isPasswordTrue) {
      throw new UnauthorizedError('Передан неправильный адрес электронной почты или неверный пароль');
    }
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
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
      .json(user);
  } catch (err) {
    next(err);
  }
};

interface IBody {
  [name: string]: string;
}
async function updateInfo(
  userId: string,
  data: IBody,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      data,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    ).orFail(new DocNotFoundError('Запрошенный пользователь не найден'));
    res.json(user);
  } catch (err) {
    next(err);
  }
}

interface IUpdateUserBody extends IBody {
  name: string;
  about: string;
}
export const updateUserInfo = async (
  req: RequestWithId<IUpdateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    const userId = req.user._id;
    const data = req.body;
    await updateInfo(userId, data, res, next);
  }
};

interface IUpdateAvatarBody extends IBody {
  avatar: string;
}
export const updateAvatar = async (
  req: RequestWithId<IUpdateAvatarBody>,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    const userId = req.user._id;
    const data = req.body;
    await updateInfo(userId, data, res, next);
  }
};
