const mongoose = require("mongoose");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000";

const Assignment = require("../models/assignment");
const User = require("../models/user");
const Course = require("../models/course");
const Notification = require("../models/notification");

exports.assignments_get_all = (req, res, next) => {
  const courseCode = req.params.courseCode;
  Assignment.find({ course: courseCode })
    .select("name description dueDate course points")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        assignments: docs.map((doc) => {
          return {
            name: doc.name,
            description: doc.description,
            dueDate: doc.dueDate,
            course: doc.course,
            points: doc.points,
            _id: doc._id,
            request: {
              type: "GET",
              url:
                "http://" +
                HOST +
                ":" +
                PORT +
                "/api/assignments/" +
                courseCode +
                "/" +
                doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.assignments_create = (req, res, next) => {
  if (req.userData.role == "Instructor") {
    courseCode = req.params.courseCode;
    const newAssignment = new Assignment({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      course: courseCode,
      points: req.body.points,
    });

    newAssignment
      .save()
      .then((result) => {
        Course.findOne({ courseCode: courseCode })
          .exec()
          .then((doc) => {
            if (doc) {
              // Find students in course
              User.find({ courses: doc._id })
                .exec()
                .then((users) => {
                  var dateOffset = 24 * 60 * 60 * 1000;
                  // Add assignment to each student
                  for (const user of users) {
                    const newNotification = new Notification({
                      _id: new mongoose.Types.ObjectId(),
                      userId: user._id,
                      assignId: newAssignment._id,
                      dateTime: new Date(
                        newAssignment.dueDate.getTime() - dateOffset
                      ),
                      enabled: true,
                    });
                    newNotification.save();
                  }
                })
                .catch((err) => {
                  res.status(500).json({ error: err });
                });
            }
          });
        res.status(201).json({
          createdAssignment: newAssignment,
          request: {
            type: "GET",
            url:
              "http://" +
              HOST +
              ":" +
              PORT +
              "/api/assignments/" +
              newAssignment._id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to create an assignment" });
  }
};

exports.assignments_get_one = (req, res, next) => {
  courseCode = req.params.courseCode;
  const id = req.params.assignId;
  Assignment.findById(id)
    .select("name description dueDate course points")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          assignment: doc,
          request: {
            type: "GET",
            url:
              "http://" +
              HOST +
              ":" +
              PORT +
              "/api/assignments/" +
              courseCode +
              "/" +
              doc._id,
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.assignments_update = (req, res, next) => {
  if (req.userData.role == "Instructor") {
    const id = req.params.assignId;
    const updateOps = {
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      points: req.body.points,
    };    
    Assignment.updateOne({ _id: req.params.assignId }, { $set: updateOps })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Assignment updated",
          request: {
            type: "GET",
            url: "http://" + HOST + ":" + PORT + "/api/assignments/" + id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to update an assignment" });
  }
};

exports.assignments_delete = (req, res, next) => {
  if (req.userData.role == "Instructor") {
    const id = req.params.userId;
    Assignment.deleteOne({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Assignment deleted",
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to delete an assignment" });
  }
};

// Get all assignments for a user
exports.assignments_get_user = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .populate("courses")
    .exec()
    .then((doc) => {
      if (doc) {
        // Get all assignments for each course
        const assignments = [];
        for (const course of doc.courses) {
          assignments.push(
            Assignment.find({ course: course._id })
              .select("name description dueDate course points")
              .exec()
          );
        }
        Promise.all(assignments)
          .then((result) => {
            res.status(200).json({
              assignments: result,
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
