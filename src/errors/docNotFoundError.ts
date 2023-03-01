class DocNotFoundError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'DocNotFoundError';
  }
}

export default DocNotFoundError;
