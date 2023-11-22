const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const AssignmentsController = require("../controllers/assignments");

router.get("/:courseCode", checkAuth, AssignmentsController.assignments_get_all);

// router.get("/:userId", checkAuth, AssignmentsController.assignments_get_user);

router.post("/:courseCode", checkAuth, AssignmentsController.assignments_create);

router.get("/:courseCode/:assignId", checkAuth, AssignmentsController.assignments_get_one);

router.patch("/:assignId", checkAuth, AssignmentsController.assignments_update);

router.delete(
  "/:assignId",
  checkAuth,
  AssignmentsController.assignments_delete
);

module.exports = router;
