const jwt = require('jsonwebtoken');
const createError = require('../util/error');

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) throw createError(403, 'No token provided');

        const token = req.headers.authorization.split(' ')[1];
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedPayload) throw createError(401, 'Not authorized');

        req.userId = decodedPayload.userId; 
        next();

    } catch (err) {
        if (!err.statusCode) err.statusCode = 401;
        next(err);
    }
};