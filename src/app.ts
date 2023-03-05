import express, {
  Request,
  Response,
  NextFunction,
} from 'express';
import { env } from 'process';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {
  celebrate,
  Joi,
  errors,
  Segments,
} from 'celebrate';
import router from './routers/index';
import authorization from './middlewares/auth';
import handleErrors from './helpers/index';
import { requestLogger, errorLogger } from './middlewares/loggers';

const app = express();
const { PORT = 3000 } = env;

mongoose.set('strictQuery', false);
async function connectDataBase() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
}
connectDataBase()
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  ['/users', '/cards'],
  celebrate({
    [Segments.COOKIES]: Joi.object().keys({
      token: Joi.string().required(),
    }),
  }),
  authorization,
);
app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleErrors(err, res);
  next();
});

app.listen(PORT, () => {
  console.log(`Cервер работает на порту ${PORT}!!!`);
});
