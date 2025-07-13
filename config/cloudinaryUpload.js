const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: "dhshxgl9o",
  api_key: "327843754598999",
  api_secret: "YY8dHO52TYD6b72Do-7B5KdR0X4",
});
module.exports = { upload, cloudinary };
