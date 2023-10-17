const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const { HTTP_STATUS_NOT_FOUND } = require('http2').constants; // 404
const auth = require('../middlewares/auth');

const {
  createUser,
  login,
  getMe,
  updateProfile,
} = require('../controllers/users');

const celebrateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru'] } }),
    password: Joi.string().required(),
  }).unknown(true),
});

// Создание пользователя
userRouter.post('/signup', celebrateValidator, createUser);

// Авторизация пользователя
userRouter.post('/signin', celebrateValidator, login);

// Запрос вернуть информацию о пользователе
userRouter.get('/users/me', auth, getMe);

// обновление информации профиля
userRouter.patch(
  '/users/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru'] } }),
    }),
  }),
  updateProfile,
);

// несуществующий путь
userRouter.patch('*', (req, res) => {
  return res.setHeader('content-type', 'application/json').status(HTTP_STATUS_NOT_FOUND).send({ message: 'Not found' });
});

module.exports = userRouter;
