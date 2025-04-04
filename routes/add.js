const { Router } = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const { courseValidators } = require("../utils/validators");
const router = Router();

// Отображаем форму добавления курса по маршруту GET /add
router.get("/", auth, (req, res) => {
  res.render("add-course", {
    title: "Add new course",
    isAdd: true,
    data: {},
    error: null,
  });
});

router.post("/", auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add-course", {
      title: "Add Course",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      },
    });
  }

  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user._id,
  });

  try {
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
