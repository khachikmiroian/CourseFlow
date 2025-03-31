const { Router } = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = Router();

router.get("/", auth, async (req, res) => {
  res.render("profile", {
    title: "Profile",
    isProfile: true,
    user: req.user.toObject(),
  });
});

// Добавьте обработку ошибок
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.redirect("/auth/login");
    }

    const toChange = {
      name: req.body.name,
    };

    if (req.file) {
      toChange.avatarUrl = "images/" + req.file.filename; // Путь без начального слеша
    }

    Object.assign(user, toChange);
    await user.save();

    res.redirect("/profile");
  } catch (e) {
    console.error("Ошибка обновления профиля:", e);
    res.redirect("/profile?error=1");
  }
});

module.exports = router;
