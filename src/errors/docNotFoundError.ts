import CodesHTTPStatus from '../types/codes';

class DocNotFoundError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.name = 'DocNotFoundError';
    this.statusCode = CodesHTTPStatus.NOT_FOUND;
  }
}

export default DocNotFoundError;
