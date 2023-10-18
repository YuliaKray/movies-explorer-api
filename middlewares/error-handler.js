const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants; // 500
const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants; // 400

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.setHeader('content-type', 'application/json').status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Data' });
  }
  if (err === null || err === undefined) {
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
  return res.status(err.statusCode).send({ message: err.message });
};

module.exports = errorHandler;
