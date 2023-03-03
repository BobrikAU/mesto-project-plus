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
    },
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxLength: 200,
    },
    avatar: {
      type: String,
      validate: {
        validator(url: string) {
          return isURL(url);
        },
        message: 'Неверный адрес аватара',
      },
      required: true,
    },
  },
  {
    autoIndex: true,
  },
);

export default model<IUser>('user', userSchema);
