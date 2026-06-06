const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const ctrl = require('../controllers/uploadController');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.csv') cb(null, true);
    else cb(new Error('Only CSV files are allowed'));
  },
});

router.post('/', upload.single('file'), ctrl.uploadCSV);

module.exports = router;
