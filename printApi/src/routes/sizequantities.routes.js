const express = require('express');
const router = express.Router();
const {
  createSizeQuantity,
  getSingleSizeQuantity,
  updateSizeQuantity,
  deleteSizeQuantity,
} = require('../controllers/sizequantities.controller.js');

router.post('/', createSizeQuantity);
router.get('/:id', getSingleSizeQuantity);
router.put('/:id', updateSizeQuantity);
router.delete('/:id', deleteSizeQuantity);

module.exports = router;
