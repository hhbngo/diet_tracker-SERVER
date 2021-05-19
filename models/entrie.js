const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrieSchema = new Schema({
    meals: [
        {
            foods: [
                {
                    name: String,
                    weight: {type: Number, required: true},
                    fat: {type: Number, required: true},
                    carb: {type: Number, required: true},
                    protein: {type: Number, required: true},
                    calories: Number
                }
            ],
            time: {
                type: Schema.Types.Date,
                required: true
            }
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model('Entrie', entrieSchema);