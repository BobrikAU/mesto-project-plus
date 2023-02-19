import express, { Response, NextFunction } from 'express';
import { env } from 'process';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import { RequestWithId } from './types/interfaces';
import cardsRouter from './routers/cards';

const app = express();
const { PORT = 3000 } = env;

mongoose.set('strictQuery', false);
async function connectDataBase() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
}
connectDataBase()
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  (req: RequestWithId<undefined>, res: Response, next: NextFunction) => {
    req.user = {
      _id: '63ed67d7b7530c25c51922e8',
    };
    next();
  },
);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`Cервер работает на порту ${PORT}!!!`);
});
