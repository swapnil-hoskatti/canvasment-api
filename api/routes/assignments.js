const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /assignments'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST requests to /assignments'
    });
});

router.get('/:assignId', (req, res, next) => {
    res.status(201).json({
        message: 'Assignment details!',
        assignId: req.params.assignId
    });
});

router.delete('/:assignId', (req, res, next) => {
    res.status(201).json({
        message: 'Deleted assignment!',
        assignId: req.params.assignId
    });
});

module.exports = router;