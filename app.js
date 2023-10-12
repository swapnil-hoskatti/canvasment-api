const express = require('express');
const app = express();
const morgan = require('morgan');

const userRoutes = require('./api/routes/users');
const assignmentRoutes = require('./api/routes/assignments');

app.use(morgan('dev'));

// Routes handling requests
app.use('/users', userRoutes);
app.use('/assignments', assignmentRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    // Forward the error request
    next(error);
});

app.use((error, req, res, next) => {
    // Error status or default 500
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;