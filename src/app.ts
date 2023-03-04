import express from 'express';
import { env } from 'process';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './routers/index';
import authorization from './middlewares/auth';

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
app.use(['/users', '/cards'], authorization);

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Cервер работает на порту ${PORT}!!!`);
});
