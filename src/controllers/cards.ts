import { Response } from 'express';
import Card from '../models/card';
import { RequestWithId } from '../types/interfaces';
import processError from '../helpers/cards';
import CodesHTTPStatus from '../types/codes';
import DocNotFoundError from '../errors/docNotFoundError';

export const getAllCards = async (req: RequestWithId, res: Response) => {
  try {
    const cards = await Card.find({})
      .populate(['owner', 'likes']);
    res.json(cards);
  } catch (err) {
    processError(err, res);
  }
};

interface IReqCreateBody {
  name: string;
  link: string;
}
export const createCard = async (
  req: RequestWithId<IReqCreateBody>,
  res: Response,
) => {
  if (req.user) {
    const userId = req.user._id;
    const { name, link } = req.body;
    try {
      const card = await Card.create({ owner: userId, name, link });
      res.status(CodesHTTPStatus.DocCreated).json(card);
    } catch (err) {
      processError(err, res);
    }
  }
};

export const deleteCard = async (
  req: RequestWithId,
  res: Response,
) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId)
      .populate(['owner', 'likes']);
    if (card === null) {
      throw new DocNotFoundError('Card not found');
    }
    res.json(card);
  } catch (err) {
    processError(err, res);
  }
};

export const likeCard = async (
  req: RequestWithId<undefined>,
  res: Response,
) => {
  const { cardId } = req.params;
  if (req.user) {
    const userId = req.user._id;
    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: userId } },
        {
          returnDocument: 'after',
        },
      )
        .populate(['owner', 'likes']);
      if (card === null) {
        throw new DocNotFoundError('Card not found');
      }
      res.json(card);
    } catch (err) {
      processError(err, res);
    }
  }
};

export const dislikeCard = async (
  req: RequestWithId,
  res: Response,
) => {
  const { cardId } = req.params;
  if (req.user) {
    const userId = req.user._id;
    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: userId } },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
        .populate(['owner', 'likes']);
      if (card === null) {
        throw new DocNotFoundError('Card not found');
      }
      res.json(card);
    } catch (err) {
      processError(err, res);
    }
  }
};
