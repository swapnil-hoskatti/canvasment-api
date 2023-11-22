const mongoose = require("mongoose");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000";

const Assignment = require("../models/assignment");
const Notification = require("../models/notification");
const User = require("../models/user");

exports.getAllNotificationsForAssignment = (req, res, next) => {
  const userId = req.userData.userId;
  console.log(userId);
  const assignmentId = req.params.assignmentId;
  console.log(assignmentId);
  Notification.find({ userId: userId }).find({ assignId: assignmentId })
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        count: docs.length,
        notifications: docs.map((doc) => {
          return {
            _id: doc._id,
            dateTime: doc.dateTime,
            request: {
              type: "GET",
              url:
                "http://" +
                HOST +
                ":" +
                PORT +
                "/notifications/" +
                doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.createNotification = (req, res, next) => {
  const userId = req.params.userId;
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
          const notification = new Notification({
            _id: mongoose.Types.ObjectId(),
            user: userId,
            assignment: assignmentId,
            read: false,
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
  notificationId = req.params.notificationId;
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
      Notification.updateOne(
        { _id: notificationId },
        {  $set: updateOps  }
      )
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
