import { Router } from 'express';
import {
  celebrate,
  Joi,
  Segments,
} from 'celebrate';
import {
  getAllUsers,
  getUser,
  updateAvatar,
  updateUserInfo,
  getYourself,
} from '../controllers/users';
import { user } from '../types/constants';

const usersRouter = Router();
usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getYourself);
usersRouter.patch(
  '/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(user.name.MIN_LENGTH).max(user.name.MAX_LENGTH),
      about: Joi.string().min(user.about.MIN_LENGTH).max(user.about.MAX_LENGTH),
    }),
  }),
  updateUserInfo,
);
usersRouter.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().uri({
        domain: {
          minDomainSegments: 2,
          tlds: { allow: true },
        },
        allowQuerySquareBrackets: true,
      }).required(),
    }),
  }),
  updateAvatar,
);
usersRouter.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUser,
);

export default usersRouter;
