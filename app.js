require('dotenv').config();
const express = require('express');
const hemlet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const limiter = require('./middlewares/limiter');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to DB');
});

const app = express();

app.use(cors());

app.use(hemlet());

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
