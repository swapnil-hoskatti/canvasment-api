const mongoose = require("mongoose");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000";

const Course = require("../models/course");
const User = require("../models/user");

exports.getAllCourses = (req, res, next) => {
  const userId = req.userData.userId;
  const role = req.userData.role;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      if ( role == "Student" ) {
      Course.find({ _id: { $in: user.courses } })
        .select("name description courseCode instructor")
        .exec()
        .then((docs) => {
          const response = {
            count: docs.length,
            courses: docs.map((doc) => {
              return {
                name: doc.name,
                description: doc.description,
                courseCode: doc.courseCode,
                instructor: doc.instructor,
                _id: doc._id,
                request: {
                  type: "GET",
                  url:
                    "http://" +
                    HOST +
                    ":" +
                    PORT +
                    "/api/courses/" +
                    doc.courseCode,
                },
              };
            }),
          };
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
      } else if ( role == "Instructor" ) {
        Course.find({ instructor: userId })
          .select("name description courseCode instructor")
          .exec()
          .then((docs) => {
            const response = {
              count: docs.length,
              courses: docs.map((doc) => {
                return {
                  name: doc.name,
                  description: doc.description,
                  courseCode: doc.courseCode,
                  instructor: doc.instructor,
                  _id: doc._id,
                  request: {
                    type: "GET",
                    url:
                      "http://" +
                      HOST +
                      ":" +
                      PORT +
                      "/api/courses/" +
                      doc.courseCode,
                  },
                };
              }),
            };
            res.status(200).json(response);
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

exports.getOneCourse = (req, res, next) => {
  const courseCode = req.params.courseCode;
  Course.findOne({ courseCode: courseCode })
    .select("name description courseCode instructor")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          course: doc,
          request: {
            type: "GET",
            url:
              "http://" + HOST + ":" + PORT + "/api/courses/" + doc.courseCode,
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid course found for provided course code" });
      }
    });
};

exports.createCourse = (req, res, next) => {
  const course = new Course({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    userId: req.body.userId,
  });
  course
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Created course successfully",
        createdCourse: {
          name: result.name,
          description: result.description,
          userId: result.userId,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://" + HOST + ":" + PORT + "/api/courses/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.updateCourse = (req, res, next) => {
  const id = req.params.courseId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Course.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Course updated",
        request: {
          type: "GET",
          url: "http://" + HOST + ":" + PORT + "/api/courses/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.deleteCourse = (req, res, next) => {
  const id = req.params.courseId;
  Course.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Course deleted",
        request: {
          type: "POST",
          url: "http://" + HOST + ":" + PORT + "/api/courses/",
          body: { name: "String", description: "String", userId: "String" },
        },
      });
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
};
