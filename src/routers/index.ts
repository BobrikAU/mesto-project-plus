import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import notFoundRouter from './notFound';
import { createNewUser, login } from '../controllers/users';

const router = Router();
router.post('/signup', createNewUser);
router.post('/signin', login);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', notFoundRouter);

export default router;
