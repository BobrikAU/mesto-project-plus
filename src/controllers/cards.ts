import { Response, NextFunction } from 'express';
import Card from '../models/card';
import { RequestWithId } from '../types/interfaces';
import CodesHTTPStatus from '../types/codes';
import DocNotFoundError from '../errors/docNotFoundError';
import ForbiddenError from '../errors/forbiddenError';

export const getAllCards = async (
  req: RequestWithId,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find({})
      .populate(['owner', 'likes']);
    res.json(cards);
  } catch (err) {
    next(err);
  }
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
    try {
      const card = await Card.create({ owner: userId, name, link });
      res.status(CodesHTTPStatus.DOC_CREATED).json(card);
    } catch (err) {
      next(err);
    }
  }
};

export const deleteCard = async (
  req: RequestWithId,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  const userId = req.user ? req.user._id : '';
  try {
    const card = await Card.findById(cardId)
      .orFail(new DocNotFoundError('Запрошенная карточка не найдена'));
    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('У Вас нет прав, на удаление этой карточки.');
    }
    res.json(await card.populate(['owner', 'likes']));
    await card.deleteOne();
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (
  req: RequestWithId<undefined>,
  res: Response,
  next: NextFunction,
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
        .orFail(new DocNotFoundError('Запрошенная карточка не найдена'))
        .populate(['owner', 'likes']);
      res.json(card);
    } catch (err) {
      next(err);
    }
  }
};

export const dislikeCard = async (
  req: RequestWithId,
  res: Response,
  next: NextFunction,
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
        .orFail(new DocNotFoundError('Запрошенная карточка не найдена'))
        .populate(['owner', 'likes']);
      res.json(card);
    } catch (err) {
      next(err);
    }
  }
};
