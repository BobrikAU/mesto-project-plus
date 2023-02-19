import { Response, NextFunction } from 'express';
import Card from '../models/card';
import { RequestWithId } from '../types/interfaces';
import processError from '../helpers/cards';

export const getAllCards = async (req: RequestWithId, res: Response, next: NextFunction) => {
  await Card.find({})
    .populate('owner')
    .then((cards) => res.json(cards))
    .catch((err) => processError(err, res));
  next();
};

interface IReqCreateBody {
  name: string;
  link: string;
}
export const createCard = async (
  req: RequestWithId<IReqCreateBody>,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    const userId = req.user._id;
    const { name, link } = req.body;
    await Card.create({ owner: userId, name, link })
      .then((card) => res.json(card))
      .catch((err) => processError(err, res));
  }
  next();
};

export const deleteCard = async (
  req: RequestWithId,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  await Card.findByIdAndRemove(cardId)
    .populate('owner')
    .then((card) => {
      if (card === null) {
        throw new Error('null');
      }
      res.json(card);
    })
    .catch((err) => processError(err, res));
  next();
};

export const likeCard = async (
  req: RequestWithId<undefined>,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  if (req.user) {
    const userId = req.user._id;
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    )
      .populate('owner')
      .then((card) => {
        if (card === null) {
          throw new Error('null');
        }
        res.json(card);
      })
      .catch((err) => processError(err, res));
  }
  next();
};

export const dislikeCard = async (
  req: RequestWithId,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  if (req.user) {
    const userId = req.user._id;
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    )
      .populate('owner')
      .then((card) => {
        if (card === null) {
          throw new Error('null');
        }
        res.json(card);
      })
      .catch((err) => processError(err, res));
  }
  next();
};
