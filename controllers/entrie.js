const Entrie = require('../models/entrie');
const User = require('../models/user');
const createError = require('../util/error');
const {validationResult} = require('express-validator');

exports.getEntries = async(req, res, next) => {
    const { userId } = req;
    try {
        const entries = await User.findById(userId).select('entries -_id').populate('entries');
        res.status(302).send(entries);
    } catch (err) {
        next(err)
    }
}

exports.addEntrie = async(req, res, next) => {
    const { userId } = req;
    try {
        const entry = await new Entrie().save();
        await User.findByIdAndUpdate(userId, {
            $push: { entries: entry._id}
        });
        res.status(200).send('Entrie Created');
    } catch (err) {
        next(err)
    }
}

exports.deleteEntrie = async(req, res, next) => {
    const { entrieId } = req.params;
    const { userId } = req;

    try {
        const user = await User.findById(userId);

        if (!user.entries.some(e => e.toString() === entrieId.toString())) {
            throw createError(404, 'Entry not found for user');
        }

        user.entries = [...user.entries].filter(e => e.toString() !== entrieId.toString());
        await user.save();
        
        await Entrie.findByIdAndDelete(entrieId);
        res.status(200).send('Entry deleted');
    } catch (err) {
        next(err);
    }
}