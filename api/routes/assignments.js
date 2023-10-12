const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /assignments'
    });
});

router.post('/', (req, res, next) => {
    const assignment = {
        name: req.body.name,
        description: req.body.description,
        dueDate: req.body.dueDate,
        course: req.body.course,
        points: req.body.points
    };
    res.status(201).json({
        message: 'Handling POST requests to /assignments',
        createdAssignment: assignment
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