const router = require('express').Router();

const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

router.use(userRouter);

router.use(auth);

router.use(movieRouter);

module.exports = router;
