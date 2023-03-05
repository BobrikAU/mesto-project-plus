import { Router } from 'express';
import {
  celebrate,
  Joi,
  Segments,
} from 'celebrate';
import {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { card } from '../types/constants';

const cardsRouter = Router();
cardsRouter.get('/', getAllCards);
cardsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(card.name.MIN_LENGTH).max(card.name.MAX_LENGTH).required(),
      link: Joi.string().uri({
        domain: {
          minDomainSegments: 2,
          tlds: { allow: true },
        },
        allowQuerySquareBrackets: true,
      }).required(),
    }),
  }),
  createCard,
);
cardsRouter.delete(
  '/:cardId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCard,
);
cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  likeCard,
);
cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  dislikeCard,
);

export default cardsRouter;
