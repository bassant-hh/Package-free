const express = require('express');
const router = express.Router();

const { getOrders,placeOrder } = require('./../controllers/ordersController');

router.get('/getOrders',getOrders);
router.post('/placeOrder',placeOrder);

module.exports = router;
