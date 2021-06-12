const express = require('express');
const { userRegisterValidator } = require('../validators');
const { createUser, signIn } = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');
const router = express.Router();

router.put('/create-user', userRegisterValidator, createUser);
router.post('/sign-in', signIn);
router.post('/isAuth', isAuth, (req, res) => res.status(200).send({userId: req.userId, email: req.email}));


module.exports = router;
