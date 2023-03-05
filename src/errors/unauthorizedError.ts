import CodesHTTPStatus from '../types/codes';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = CodesHTTPStatus.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
