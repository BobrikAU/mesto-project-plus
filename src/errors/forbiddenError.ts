import CodesHTTPStatus from '../types/codes';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = CodesHTTPStatus.FORBIDDEN;
  }
}

export default ForbiddenError;
