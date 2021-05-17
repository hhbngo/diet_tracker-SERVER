const express = require('express');
const { userRegisterValidator } = require('../validators');
const { createUser, signIn } = require('../controllers/auth');
const router = express.Router();

router.put('/create-user', userRegisterValidator, createUser);
router.post('/sign-in', signIn);

module.exports = router;
