const express = require('express');
const router = express.Router();
const orderItemsController = require('../controllers/orderItems.controller');

router.post('/', orderItemsController.createOrderItem);

router.get('/:orderItemId/stages', orderItemsController.getStagesByOrderItemId);
router.get('/:id', orderItemsController.getSingleOrderItem);
router.put('/:id', orderItemsController.updateOrderItem);
router.delete('/:id', orderItemsController.deleteOrderItem);

module.exports = router;
