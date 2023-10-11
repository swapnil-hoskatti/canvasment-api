const express = require('express');
const app = express();

const userRoutes = require('./api/routes/users');
const assignmentRoutes = require('./api/routes/assignments');

app.use('/users', userRoutes);
app.use('/assignments', assignmentRoutes);

module.exports = app;