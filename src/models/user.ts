import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { REGEX, user } from '../types/constants';

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => isEmail(email),
        message: 'Неверный адрес электронной почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minLength: user.name.MIN_LENGTH,
      maxLength: user.name.MAX_LENGTH,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: user.about.MIN_LENGTH,
      maxLength: user.about.MAX_LENGTH,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator(url: string) {
          return REGEX.test(url);
        },
        message: 'Неверный адрес аватара',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  {
    autoIndex: true,
  },
);

export default model<IUser>('user', userSchema);
