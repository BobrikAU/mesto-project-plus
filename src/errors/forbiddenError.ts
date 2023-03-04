class ForbiddenError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
