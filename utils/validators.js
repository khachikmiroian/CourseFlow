const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Type correct email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This email address is already in use");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "The password must be a minimum of 6 characters")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The passwords must match");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("The name must be minimum 3 characters")
    .trim(),
];

exports.loginValidators = [
  body("email").isEmail().withMessage("Type correct email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim(),
];

exports.courseValidators = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Minimum length is 3 characters")
    .escape(),
  body("price", "Type correct price (minimum 0.01)")
    .isFloat({ min: 0.01 })
    .customSanitizer((value) => parseFloat(value)),
  body("img", "Type correct URL of photo").isURL({
    protocols: ["http", "https"],
    require_protocol: true,
  }),
];
