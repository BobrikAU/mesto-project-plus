import { Request } from 'express';

export interface RequestWithId<I = any> extends Request{
  user?: {
    _id: string;
  };
  body: I;
}
