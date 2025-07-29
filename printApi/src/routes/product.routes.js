const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/uploadProductFiles');

router.post('/', upload.array('files'), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.array('files'),productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
