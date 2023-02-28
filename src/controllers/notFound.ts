import { Response, NextFunction } from 'express';
import { RequestWithId } from '../types/interfaces';

const pageNotFound = (req: RequestWithId<undefined>, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Запрошенная страница не найдена' });
  next();
};

export default pageNotFound;
