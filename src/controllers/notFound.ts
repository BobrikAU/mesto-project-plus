import { Response, NextFunction } from 'express';
import { RequestWithId } from '../types/interfaces';
import DocNotFoundError from '../errors/docNotFoundError';

const pageNotFound = (req: RequestWithId<undefined>, res: Response, next: NextFunction) => {
  const error = new DocNotFoundError('Запрошенная страница не найдена');
  next(error);
};

export default pageNotFound;
