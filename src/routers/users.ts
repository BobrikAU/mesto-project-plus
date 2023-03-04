import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateAvatar,
  updateUserInfo,
  getYourself,
} from '../controllers/users';

const usersRouter = Router();
usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getYourself);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.get('/:userId', getUser);

export default usersRouter;
