import { Router } from 'express';
import {
  celebrate,
  Joi,
  Segments,
} from 'celebrate';
import usersRouter from './users';
import cardsRouter from './cards';
import notFoundRouter from './notFound';
import { createNewUser, login } from '../controllers/users';
import { user } from '../types/constants';

const router = Router();
router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email({
        minDomainSegments: 2,
        tlds: { allow: true },
      }),
      password: Joi.string().required(),
      name: Joi.string().min(user.name.MIN_LENGTH).max(user.name.MAX_LENGTH),
      about: Joi.string().min(user.about.MIN_LENGTH).max(user.about.MAX_LENGTH),
      avatar: Joi.string().uri({
        domain: {
          minDomainSegments: 2,
          tlds: { allow: true },
        },
        allowQuerySquareBrackets: true,
      }),
    }),
  }),
  createNewUser,
);
router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email({ minDomainSegments: 2 }),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', notFoundRouter);

export default router;
