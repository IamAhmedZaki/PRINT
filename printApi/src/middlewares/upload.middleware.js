const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set different upload path
const orderuploads = path.join(__dirname, '../../public/orderuploads');
if (!fs.existsSync(orderuploads)) {
  fs.mkdirSync(orderuploads, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, orderuploads);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;