const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const { SENDGRID_API_KEY } = require("../keys");
const regEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const { registerValidators, loginValidators } = require("../utils/validators");
const router = Router();

// Настраиваем transporter для SendGrid
const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: SENDGRID_API_KEY },
  })
);

// [GET] /auth/login
router.get("/login", (req, res) => {
  const registerErrors = req.flash("registerError");
  const loginErrors = req.flash("loginError");

  res.render("auth/login", {
    title: "Authorization",
    isLogin: true,
    registerError: registerErrors[0],
    loginError: loginErrors[0],
  });
});

// [POST] /auth/login
router.post("/login", loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) throw err;
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Invalid password");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "User not found");
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

// [GET] /auth/logout
router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

// [POST] /auth/register
router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      card: { items: [] },
    });
    await user.save();
    await transporter.sendMail(regEmail(email));
    res.redirect("/auth/login#login");
  } catch (e) {
    console.log(e);
  }
});

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Password reset",
    error: req.flash("error"),
  });
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Something went wrong, try later");
        return res.redirect("/auth/reset");
      }

      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000; // 1 hour
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect("/auth/login");
      } else {
        req.flash("error", "Invalid email");
        res.redirect("/auth/reset");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/password/:token", async (req, res) => {
  if (!req.params.token) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findOne({
      // Исправлено: resetToken вместо resetTOken
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect("/auth/login");
    }

    res.render("auth/password", {
      title: "Reset password",
      error: req.flash("error"),
      userId: user._id.toString(),
      token: req.params.token,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/password", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token, // <-- сверяем и resetToken, если нужно
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect("/auth/login"); // <-- Исправлено: "/auth/login" вместо "/auth.login"
    } else {
      req.flash("loginError", "Token is expired or invalid");
      res.redirect("/auth/login");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
