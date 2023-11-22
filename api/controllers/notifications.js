const mongoose = require("mongoose");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000";

const Assignment = require("../models/assignment");
const Notification = require("../models/notification");
const User = require("../models/user");

exports.getAllNotificationsForAssignment = (req, res, next) => {
  const userId = req.userData.userId;
  const assignmentId = req.params.assignmentId;
  Notification.find({ userId: userId })
    .find({ assignId: assignmentId })
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        notifications: docs.map((doc) => {
          return {
            _id: doc._id,
            dateTime: doc.dateTime,
            enabled: doc.enabled,
            request: {
              type: "GET",
              url: "http://" + HOST + ":" + PORT + "/notifications/" + doc._id,
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

exports.createNotification = (req, res, next) => {
  const userId = req.userData.userId;
  const assignmentId = req.params.assignmentId;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      Assignment.findById(assignmentId)
        .exec()
        .then((assignment) => {
          if (!assignment) {
            return res.status(404).json({
              message: "Assignment not found",
            });
          }
          // compare dateTime to current time and due date. It should be between the two
          if (
            req.body.dateTime < Date.now() ||
            req.body.dateTime > assignment.dueDate
          ) {
            return res.status(404).json({
              message: "Date is not valid",
            });
          }
          const notification = new Notification({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            assignId: assignmentId,
            dateTime: req.body.dateTime,
            enabled: req.body.enabled,
          });
          notification
            .save()
            .then((result) => {
              res.status(201).json({
                message: "Notification created",
                createdNotification: {
                  _id: result._id,
                  user: result.user,
                  assignment: result.assignment,
                  read: result.read,
                },
                request: {
                  type: "GET",
                  url:
                    "http://" +
                    HOST +
                    ":" +
                    PORT +
                    "/notifications/" +
                    result._id,
                },
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        });
    });
};

exports.deleteNotification = (req, res, next) => {
  notificationId = req.params.notificationId;
  Notification.findById(notificationId)
    .exec()
    .then((notification) => {
      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }
      Notification.deleteOne({ _id: notificationId })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Notification deleted",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
};

exports.updateNotification = (req, res, next) => {
  const notificationId = req.params.notificationId;
  Notification.findById(notificationId)
    .exec()
    .then((notification) => {
      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }
      const updateOps = {};
      for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
      }
      Notification.updateOne({ _id: notificationId }, { $set: updateOps })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Notification updated",
            request: {
              type: "GET",
              url:
                "http://" +
                HOST +
                ":" +
                PORT +
                "/notifications/" +
                notificationId,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
};
