const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');

const userRoutes = require('./api/routes/users');
const assignmentRoutes = require('./api/routes/assignments');

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS handling
app.use((req, res, next) => {
    // Allow any client to access
    res.header('Access-Control-Allow-Origin', '*');
    // Allow these headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Check for options request
    if (req.method === 'OPTIONS') {
        // Allow these methods
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        // Return response
        return res.status(200).json({});
    }
    // Forward the request
    next();
});

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