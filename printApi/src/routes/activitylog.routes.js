const express = require('express');
const router = express.Router();
const { getLogsByOrderId, getLogsByOrderItemId } = require('../controllers/activitylog.controller');

// Route for logs by orderId
router.get('/order/:orderId', getLogsByOrderId);

// Route for logs by orderItemId
router.get('/orderitem/:orderItemId', getLogsByOrderItemId);

module.exports = router;
