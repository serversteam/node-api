const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    created_at: { type: Date, required: true }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema, 'testing_collection');
