const express = require('express');
const router = express.Router();
const { createOrder,getAllOrders,getProductColors,getSingleOrders,updateOrder,deleteOrder,orderFromToken,getProductSizes } = require('../controllers/order.controller');
const upload = require('../middlewares/uploadOrderFiles');
const { authenticate } = require('../middlewares/auth.middleware');
// const { getAllOrders } = require('../controllers/order.controller');
// const { getOrder } = require('../controllers/order.controller');
// const { createOrderComment } = require('../controllers/order.controller');
// const { deleteOrder } = require('../controllers/order.controller');

router.post('/', upload.array('files'), createOrder);
router.get('/', getAllOrders);
router.get('/token/:token', orderFromToken);
router.get('/productColors/:id', getProductColors);
router.get('/productSizes/:id', getProductSizes);
router.get('/:id', getSingleOrders);
router.put('/:id', updateOrder);

router.delete('/:id', deleteOrder);
// router.post('/:orderId/comments', createOrderComment);

module.exports = router;
