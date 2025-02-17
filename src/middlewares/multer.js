const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const filepath = path.join(__dirname, '../assets');
app.use(express.static(filepath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, filepath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;