import { Response } from 'express';
import { RequestWithId } from '../types/interfaces';
import CodesHTTPStatus from '../types/codes';

const pageNotFound = (req: RequestWithId<undefined>, res: Response) => {
  res.status(CodesHTTPStatus.NotFound).json({ message: 'Запрошенная страница не найдена' });
};

export default pageNotFound;
