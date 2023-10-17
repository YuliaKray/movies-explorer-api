const { HTTP_STATUS_OK } = require('http2').constants; // 200
const { HTTP_STATUS_CREATED } = require('http2').constants; // 201
const NotFoundError = require('../errors/NotFoundError'); // 404
const ForbiddenError = require('../errors/ForbiddenError'); // 403

const movie = require('../models/movie');

// const getMovies = (req, res, next) => {
//   return movie.find({})
//     .then((result) => {
//       return res.status(HTTP_STATUS_OK).send(result);
//     })
//     .catch(next);
// };

const getMovies = (req, res, next) => {
  const user = req.user._id;

  return movie.find({ owner: user })
    .then((result) => {
      if (result === null || result === undefined) {
        throw new NotFoundError('Movie not found');
      }
      return res.status(HTTP_STATUS_OK).send(result);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const user = req.user._id;
  return movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: user,
  })
    .then((result) => {
      return res.status(HTTP_STATUS_CREATED).send(result);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const user = req.user._id;

  movie.findById(req.params._id)
    .then((result) => {
      if (result === null || result === undefined) {
        throw new NotFoundError('Movie not found');
      }
      if (result.owner.toString() !== user) {
        throw new ForbiddenError('Пользователь не создавал этот фильм');
      }

      return result.deleteOne()
        .then((result) => {
          return res.status(HTTP_STATUS_OK).send(result);
        });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
