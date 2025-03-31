const { Router } = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const { courseValidators } = require("../utils/validators");
const router = Router();

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

// Отображение списка курсов по маршруту GET /courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().lean().populate("userId", "email name");
    res.render("courses", {
      title: "Courses",
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    });
  } catch (e) {
    console.log(e);
  }
});

// Страница редактирования курса (GET /courses/:id/edit?allow=true)
router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.redirect("/courses");
    }

    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      return res.redirect("/courses");
    }
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }

    res.render("course-edit", {
      title: `Edit ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", auth, courseValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    const { id } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.redirect("/courses");
    }

    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect("/courses");
    }

    Object.assign(course, req.body);
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

// Удаление курса (POST /courses/remove)
router.post("/remove", auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

// Отображение детальной страницы курса (GET /courses/:id)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.redirect("/courses");
    }

    const course = await Course.findById(req.params.id)
      .lean()
      .populate("userId", "email name");
    if (!course) {
      return res.redirect("/courses");
    }

    res.render("course", {
      layout: "empty",
      title: `Course ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
