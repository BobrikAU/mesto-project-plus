require('dotenv').config();

const {
  JWT_SECRET = 'secret',
  PORT = '3000',
  MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb',
  HOST = 'localhost',
} = process.env;

export default {
  JWT_SECRET,
  PORT,
  MONGODB_URL,
  HOST,
};
