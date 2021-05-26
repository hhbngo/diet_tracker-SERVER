const Entrie = require('../models/entrie');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const createError = require('../util/error');

exports.getEntries = async(req, res, next) => {
    try {
        const { userId } = req;
        const entries = await User.findById(userId).select('entries -_id').populate('entries');
        res.status(302).send(entries);
    } catch (err) {
        next(err)
    }
}

exports.getEntry = async(req, res, next) => {
    try {
        const entry = await Entrie.findById(req.params.entrieId).exec();
        console.log(entry);
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
        if (!deleted) throw createError(400, 'Unable to update meal');

        res.status(200).send('Deleted meal');
    } catch (err) {
        next(err);
    }
};