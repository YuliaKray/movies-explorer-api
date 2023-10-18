const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const { HTTP_STATUS_OK } = require('http2').constants; // 200
const { HTTP_STATUS_CREATED } = require('http2').constants; // 201
const NotFoundError = require('../errors/NotFoundError'); // 404
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const ConflictError = require('../errors/ConflictError'); // 409

const user = require('../models/user');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      return user.create({
        name, email, password: hash,
      })
        .then((user) => {
          return res.status(HTTP_STATUS_CREATED)
            .send({
              name: user.name,
              email: user.email,
              _id: user._id,
            });
        })
        .catch((err) => {
          if (err.name === 'MongoServerError' || err.code === 11000) {
            next(new ConflictError('Такой email уже существует'));
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return user.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password, (error, isValid) => {
        if (isValid === false) {
          return next(new UnauthorizedError('Неправильные почта или пароль'));
        }

        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });

        return res.status(HTTP_STATUS_OK).send({ token });
      });
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  const userMe = req.user;
  return user.findById(userMe._id)
    .then((result) => {
      return res.status(HTTP_STATUS_OK).send(result);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  return user.findByIdAndUpdate(
    userId,
    {
      name: name,
      email: email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      if (result === null) {
        throw new NotFoundError('User not found');
      }
      return res.setHeader('content-type', 'application/json').status(HTTP_STATUS_OK).send(result);
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' || err.code === 11000) {
        next(new ConflictError('Такой email уже существует'));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getMe,
  updateProfile,
};
