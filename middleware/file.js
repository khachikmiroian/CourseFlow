const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Папка, в которую сохраняем файлы, должна существовать
    cb(null, path.join(__dirname, "..", "images"));
  },
  filename(req, file, cb) {
    // Убираем двоеточия, т.к. в Windows они недопустимы в именах файлов
    const dateStr = new Date().toISOString().replace(/:/g, "-");
    const finalName = dateStr + "-" + file.originalname;
    cb(null, finalName);
  },
});

const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
