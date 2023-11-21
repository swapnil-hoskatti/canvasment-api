const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const checkAuth = require("../middleware/check-auth");
const CoursesController = require("../controllers/courses");

const Course = require("../models/course");

router.get("/", checkAuth, CoursesController.getAllCourses);

router.get("/:courseCode", checkAuth, CoursesController.getOneCourse);

router.post("/", checkAuth, CoursesController.createCourse);

router.patch("/:courseId", checkAuth, CoursesController.updateCourse);

router.delete("/:courseId", checkAuth, CoursesController.deleteCourse);

module.exports = router;
