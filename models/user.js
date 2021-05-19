const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    entries: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Entrie'
        }
    ],
    stats: {
        weightHistory: [
            {
                weight: {type: Number, required: true},
                date: {type: Schema.Types.Date, required: true}
            }
        ],
        TDEE: {
            type: Number,
            default: 0
        },
        unit: {
            type: String,
            enum: ['Metric', 'Imperial'],
            default: 'Metric'
        }
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);