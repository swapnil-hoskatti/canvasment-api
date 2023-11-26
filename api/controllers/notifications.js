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
            new Date(req.body.dateTime).toLocaleString('en-US', { timeZone: 'America/New_York' }) < new Date(Date.now()).toLocaleString('en-US', { timeZone: 'America/New_York' }) ||
            new Date(req.body.dateTime).toLocaleString('en-US', { timeZone: 'America/New_York' }) > new Date(assignment.dueDate).toLocaleString('en-US', { timeZone: 'America/New_York' })
          ) {
            return res.status(404).json({
              message: "Date is not valid",
            });
          }
          const notification = new Notification({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            assignId: assignmentId,
            dateTime: new Date(req.body.dateTime).toLocaleString('en-US', { timeZone: 'America/New_York' }),
            enabled: req.body.enabled,
          });
          notification
            .save()
            .then((result) => {
              res.status(201).json({
                message: "Notification created"
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
  const notificationId = req.params.notificationId;
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
      Assignment.findById(notification.assignId)
        .exec()
        .then((assignment) => {
          if (!assignment) {
            return res.status(404).json({
              message: "Assignment not found",
            });
          }
          // compare dateTime to current time and due date. It should be between the two
      if (
        new Date(req.body.dateTime).toLocaleString('en-US', { timeZone: 'America/New_York' }) < new Date(Date.now()).toLocaleString('en-US', { timeZone: 'America/New_York' }) ||
        new Date(req.body.dateTime).toLocaleString('en-US', { timeZone: 'America/New_York' }) > new Date(assignment.dueDate).toLocaleString('en-US', { timeZone: 'America/New_York' })
      ) {
        return res.status(404).json({
          message: "Date is not valid",
        });
      }
      const updateOps = {
        enabled: req.body.enabled,
        dateTime: new Date(req.body.dateTime).toLocaleString('en-US', { timeZone: 'America/New_York' })
      };
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
  });
};

exports.getAllNotificationsForUser = (req, res, next) => {
  const userId = req.userData.userId;
  Notification.find({ userId: userId })
  .populate('assignId')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        notifications: docs.map((doc) => {
          return {
            _id: doc._id,
            dateTime: doc.dateTime,
            enabled: doc.enabled,
            assignment: doc.assignId,
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