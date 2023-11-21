const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Notification = require("../models/notification");
const checkAuth = require("../middleware/check-auth");
const NotificationsController = require("../controllers/notifications");

router.get("/:userId", checkAuth, NotificationsController.getAllNotificationsForUser);

router.post("/:userId/:assignmentId", checkAuth, NotificationsController.createNotification);

router.delete("/:userId/:notificationId", checkAuth, NotificationsController.deleteNotification);

router.patch("/:userId/:notificationId", checkAuth, NotificationsController.updateNotification);

module.exports = router;