const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const userRoutes = require('./routes/users');

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?replicaSet=${process.env.DB_REPLICASET}&authSource=admin`, {
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/users', userRoutes);

app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status_code = err.status || 500;
    res.status(status_code).json({status_code, message: err.message || 'Bad request'});
});

module.exports = app
