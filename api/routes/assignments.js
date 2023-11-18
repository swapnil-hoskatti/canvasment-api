const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const AssignmentsController = require('../controllers/assignments');

router.get("/", checkAuth, AssignmentsController.assignments_get_all);

router.post("/", checkAuth, AssignmentsController.assignments_create);

router.get("/:assignId", checkAuth, AssignmentsController.assignments_get_one);

router.patch("/:assignId", checkAuth, AssignmentsController.assignments_update);

router.delete("/:assignId", checkAuth, AssignmentsController.assignments_delete);

module.exports = router;
