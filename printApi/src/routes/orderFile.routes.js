const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware.js');
const {
  createOrderFile,
  getOrderFiles,
  updateOrderFile,
  deleteOrderFile,
} = require('../controllers/orderFile.controller.js');

// Create with file upload
router.post('/', upload.single('file'), createOrderFile);

// Get all files (filter by orderId or productId)
router.get('/', getOrderFiles);

// Update with optional file
router.put('/:id', upload.single('file'), updateOrderFile);

// Delete
router.delete('/:id', deleteOrderFile);

module.exports = router;
