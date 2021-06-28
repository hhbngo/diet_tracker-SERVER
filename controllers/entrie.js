const Entrie = require('../models/entrie');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const createError = require('../util/error');
const mongoose = require('mongoose');

exports.getEntries = async(req, res, next) => {
    try {
        const page = parseInt(req.params.page);
        if (page <  1) throw createError(404, 'Invalid page number')
        const pageSkip = (page-1) * 4;
        const { userId } = req;
        const u = await User.aggregate([
            {
                $match: {_id: mongoose.Types.ObjectId(userId)}
            },
            {
                $project: {
                    _id: 0,
                    totalEntries: {
                        $size: '$entries'
                    },
                    entries: {
                        $slice: [
                            {$reverseArray: '$entries'},
                            pageSkip,
                            4
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'entries',
                    localField: 'entries',
                    foreignField: '_id',
                    as: 'pageEntries'
                }
            },
            {
                $project: {
                    'pageEntries.meals': 0,
                    'pageEntries.updatedAt': 0,
                    'pageEntries.__v': 0,
                    entries: 0
                }
            }
        ]);
        res.status(200).send(u[0]);
    } catch (err) {
        next(err)
    }
}

exports.getEntry = async(req, res, next) => {
    try {
        const entry = await Entrie.findById(req.params.entrieId).exec();
        if (!entry) throw createError(404, 'Entry not found');
        res.status(200).send(entry);

    } catch(err) {
        next(err)
    }
}

exports.addEntrie = async(req, res, next) => {
    const { userId } = req;
    try {
        const entry = await new Entrie().save();
        const user = await User.findById(userId);
        user.entries.push(entry._id);
        await user.save();
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

exports.createMeal = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw createError(422, 'Field(s) invalid', errors.array());
        const entry = await Entrie.findById(req.params.entrieId).exec();
        if (!entry) throw createError(404, 'Entrie not found');
        entry.meals = [...entry.meals, req.body]; 
        await entry.save();

        res.status(200).send('Meal created');
    } catch (err) {
        next(err)
    }
}

exports.updateMeal = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw createError(422, 'Field(s) invalid', errors.array());
        const updated = await Entrie.findOneAndUpdate({"meals._id": req.params.mealId}, {$set: {"meals.$" : req.body}}).exec();
        if (!updated) throw createError(400, 'Unable to update meal');

        res.status(200).send('Meal updated');
    } catch (err) {
        next(err)
    }
}

exports.deleteMeal = async(req, res, next) => {
    try {
        const deleted = await Entrie.findOneAndUpdate({"meals._id": req.params.mealId}, {$pull: {meals : {_id: req.params.mealId}}}).exec();
        if (!deleted) throw createError(400, 'Unable to delete meal');

        res.status(200).send('Deleted meal');
    } catch (err) {
        next(err);
    }
};