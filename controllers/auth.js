const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const createError = require('../util/error');

exports.createUser = async(req, res, next) => {
    const errors = validationResult(req);
    try {
        if(!errors.isEmpty()) {
            const errorData = errors.array();
            throw createError(422, 'Fields are not valid', errorData);
        }

        const { email, password } = req.body;
        const existingUser = await User.findOne({email});

        if (existingUser) throw createError(400, 'This email already exists');

        const hashedPW = await bcrypt.hash(password, 12);
        const newUser = await new User({email, password: hashedPW}).save();
        res.status(201).send({userId: newUser._id});

    } catch (err) {
        next(err);
    }
};

exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            throw createError(401, 'This email is not registered');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw createError(401, 'Unable to login due to wrong credentials');
        }
        
        const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_SECRET, {expiresIn: '3h'});
        res.status(200).json({token, userId: user._id.toString(), email: user.email});

    } catch (err) {
        next(err);
    }
};


// Product.find().select('title price -_id') // dash to exclude field
//     .populate('userId', 'name date -..') // " " 

// // products: { ...p.productId._doc} // document without associted metadata