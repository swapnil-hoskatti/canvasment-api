const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Course = require("../models/course");

// Get courses for a user
router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  Course.find({ userId: userId })
    .select("name description userId")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        courses: docs.map((doc) => {
          return {
            name: doc.name,
            description: doc.description,
            userId: doc.userId,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/api/courses/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err });
    });
});

// Create a course
router.post("/", (req, res, next) => {
  const course = new Course({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    userId: req.body.userId,
  });
  course
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created course successfully",
        createdCourse: {
          name: result.name,
          description: result.description,
          userId: result.userId,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/api/courses/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Register a user for a course, add course to user's list of courses
router.patch("/:userId/:courseId", (req, res, next) => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;
  Course.updateOne(
    { _id: courseId },
    {
      $addToSet: { userId: userId },
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Course added to user's list of courses",
        request: {
          type: "GET",
          url: "http://localhost:3000/api/courses/" + courseId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


module.exports = router;