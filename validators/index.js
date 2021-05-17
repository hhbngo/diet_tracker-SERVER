const { body } = require('express-validator');

exports.userRegisterValidator = [
    body('email')
        .isEmail(),
    body('password')
        .isLength({min: 6})
];
