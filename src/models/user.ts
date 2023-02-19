import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema({
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
      validator(string: string) {
        return string.startsWith('https://') || string.startsWith('http://');
      },
      message: 'Неверный адрес аватара',
    },
    required: true,
  },
});

export default model<IUser>('user', userSchema);
