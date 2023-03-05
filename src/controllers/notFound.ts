import { Response, NextFunction } from 'express';
import { RequestWithId } from '../types/interfaces';
// import CodesHTTPStatus from '../types/codes';
import DocNotFoundError from '../errors/docNotFoundError';
// import handleErrors from '../helpers/index';

const pageNotFound = (req: RequestWithId<undefined>, res: Response, next: NextFunction) => {
  const error = new DocNotFoundError('Запрошенная страница не найдена');
  next(error);
  // res.status(CodesHTTPStatus.NOT_FOUND).json({ message: 'Запрошенная страница не найдена' });
};

export default pageNotFound;
