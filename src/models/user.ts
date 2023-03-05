import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';

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
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxLength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator(url: string) {
          return isURL(url);
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
