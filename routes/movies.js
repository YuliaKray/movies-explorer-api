const { celebrate, Joi } = require('celebrate');
const movieRouter = require('express').Router();
const regEx = require('../utils/constants');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const celebrateValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regEx),
    trailerLink: Joi.string().required().regex(regEx),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(regEx),
    movieId: Joi.number().required(),
  }).unknown(true),
});

// Запрос вернуть все фильмы, сохранненые пользователем
movieRouter.get('/movies', getMovies);

// Создание фильма
movieRouter.post('/movies', celebrateValidator, createMovie);

// Удалить фильм по ID
movieRouter.delete(
  '/movies/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = movieRouter;

// {
//   "country": "Россия",
//   "director": "Олег Трофим",
//   "duration": "90",
//   "year": "2021",
//   "description": "Про Игоря Грома",
//   "image": "https://hd.kinopoisk.ru/film/46020c592c198b0c95b955a396fb7b25",
//   "trailerLink": "https://hd.kinopoisk.ru/film/46020c592c198b0c95b955a396fb7b25",
//   "nameRU": "Майор Гром",
//   "nameEN": "Mayor Grom",
//   "thumbnail": "https://hd.kinopoisk.ru/film/46020c592c198b0c95b955a396fb7b25",
//   "movieId": "1"
// }
