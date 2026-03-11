const express = require('express');
const router = express.Router();

const { getProducts,returnProducts } = require('./../controllers/productsController');

router.get('/products',getProducts);
router.post('/returnECOProducts',returnProducts);

module.exports = router;
