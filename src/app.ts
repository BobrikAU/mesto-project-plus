import express, {
  Request,
  Response,
  NextFunction,
} from 'express';
import { env } from 'process';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './routers/index';
import authorization from './middlewares/auth';
import handleErrors from './helpers/index';

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
app.use(cookieParser());
/* app.use((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.log(req);
  next();
}); */
app.use(['/users', '/cards'], authorization);

app.use('/', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleErrors(err, res);
  next();
});

app.listen(PORT, () => {
  console.log(`Cервер работает на порту ${PORT}!!!`);
});
