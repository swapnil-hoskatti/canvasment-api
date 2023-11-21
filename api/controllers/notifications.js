const mongoose = require("mongoose");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000";

const Assignment = require("../models/assignment");
const Notification = require("../models/notification");
const User = require("../models/user");

exports.getAllNotificationsForUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      Notification.find({ user: userId })
        .populate("assignment")
        .exec()
        .then((notifications) => {
          res.status(200).json({
            count: notifications.length,
            notifications: notifications.map((notification) => {
              return {
                _id: notification._id,
                user: notification.user,
                assignment: notification.assignment,
                read: notification.read,
                request: {
                  type: "GET",
                  url:
                    "http://" +
                    HOST +
                    ":" +
                    PORT +
                    "/notifications/" +
                    notification._id,
                },
              };
            }),
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
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
  const userId = req.params.userId;
  const notificationId = req.params.notificationId;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      Notification.findById(notificationId)
        .exec()
        .then((notification) => {
          if (!notification) {
            return res.status(404).json({
              message: "Notification not found",
            });
          }
          Notification.remove({ _id: notificationId })
            .exec()
            .then((result) => {
              res.status(200).json({
                message: "Notification deleted",
                request: {
                  type: "POST",
                  url:
                    "http://" +
                    HOST +
                    ":" +
                    PORT +
                    "/notifications/" +
                    userId +
                    "/" +
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
    });
};

exports.updateNotification = (req, res, next) => {
  const userId = req.params.userId;
  const notificationId = req.params.notificationId;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      Notification.findById(notificationId)
        .exec()
        .then((notification) => {
          if (!notification) {
            return res.status(404).json({
              message: "Notification not found",
            });
          }
          Notification.update({ _id: notificationId }, { $set: req.body })
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
                    userId +
                    "/" +
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
    });
};
