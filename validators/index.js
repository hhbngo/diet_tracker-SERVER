const { body } = require('express-validator');

exports.userRegisterValidator = [
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({min: 6})
];
