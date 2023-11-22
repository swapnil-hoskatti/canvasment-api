const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Notification = require("../models/notification");
const checkAuth = require("../middleware/check-auth");
const NotificationsController = require("../controllers/notifications");

router.get("/:assignmentId", checkAuth, NotificationsController.getAllNotificationsForAssignment);

router.post("/:userId/:assignmentId", checkAuth, NotificationsController.createNotification);

router.delete("/:notificationId", checkAuth, NotificationsController.deleteNotification);

router.patch("/:notificationId", checkAuth, NotificationsController.updateNotification);

module.exports = router;