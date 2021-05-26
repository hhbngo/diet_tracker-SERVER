const { body } = require('express-validator');

exports.userRegisterValidator = [
    body('email')
        .trim()
        .isEmail(),
    body('password')
        .trim()
        .isLength({min: 6})
];

exports.mealValidator = [
    body('foods.*.name')
        .trim()
        .isString(),
    body('foods.*.weight')
        .trim()
        .isNumeric(),
    body('foods.*.fat')
        .trim()
        .isNumeric(),
    body('foods.*.carb')
        .trim()
        .isNumeric(),
    body('foods.*.protein')
        .trim()
        .isNumeric(),
    body('foods.*.calories')
        .trim()
        .isNumeric(),
    body('time')
        .trim()
        .isString()
];

