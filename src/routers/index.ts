import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import notFoundRouter from './notFound';

const router = Router();
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', notFoundRouter);

export default router;
