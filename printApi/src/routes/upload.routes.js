// src/routes/upload.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { uploadFile } = require('../controllers/upload.controller');

// Single file upload (form field name should be 'file')
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
