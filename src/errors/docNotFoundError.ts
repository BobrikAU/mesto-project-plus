import mongoose from 'mongoose';

export class DocNotFoundError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'DocNotFoundError';
  }
}

/* если начать поиск по несуществующему _id = '1234567890abcdef', то mongoose выдаст
ошибку CastError, следовательно может быть другие аналогичные случаи. Эта функция
заменяет данную ошибку на DocNotFoundError */
export function changeTypeError(err: unknown, typeDoc: string) {
  const error = err instanceof mongoose.Error.CastError && err.path === '_id'
    ? new DocNotFoundError(`${typeDoc} not found`)
    : err;
  return error;
}
