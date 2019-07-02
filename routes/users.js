const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Validator = require('../libraries/validator');
const ErrorHandler = require('../error_handler');
const User = require('../models/user');

router.post('/', (req, res, next) => {
    const validate = Validator.validate({
        name: ['required'],
    }, req.body, true);

    validate.then(() => {
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            name: req.body['name'],
            created_at: new Date()
        });
        return user.save().then(() => user);
    }).then(user => {
        res.json(user);
    }).catch(ErrorHandler.handle(res));
});

router.get('/', (req, res, next) => {
    const filters = {};

    User.find(filters).sort('-created_at').limit(20).then(users => {
        res.json({data: users, meta: {
            count: users.length,
        }});
    }).catch(ErrorHandler.handle(res));
});

module.exports = router;