const router = require('express').Router();
const { HTTP_STATUS_NOT_FOUND } = require('http2').constants; // 404

const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

router.use(userRouter);

router.use(auth);

router.use(movieRouter);

// несуществующий путь
router.patch('*', (req, res) => {
  return res.setHeader('content-type', 'application/json').status(HTTP_STATUS_NOT_FOUND).send({ message: 'Not found' });
});

module.exports = router;
