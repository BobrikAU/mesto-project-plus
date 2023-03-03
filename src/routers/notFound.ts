import { Router } from 'express';
import pageNotFound from '../controllers/notFound';

const notFoundRouter = Router();
notFoundRouter.all('*', pageNotFound);

export default notFoundRouter;
