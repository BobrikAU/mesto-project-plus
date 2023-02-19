import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createNewUser,
  updateAvatar,
  updateUserInfo,
} from '../controllers/users';

const usersRouter = Router();
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createNewUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatar);

export default usersRouter;
