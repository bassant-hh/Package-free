const express = require('express');
const router = express.Router();

const { login,register,forgetPassword,confirmResetToken,resetPassword,getProfile,getCart,verifyAccount } = require('./../controllers/authController');

router.post('/login',login);
router.post('/register',register);

router.post('/forgetPassword',forgetPassword);
router.post('/confirmResetToken',confirmResetToken);
router.post('/resetPassword',resetPassword);

router.get('/profile',getProfile);
router.get('/cart',getCart);
router.get('/confirmAccount?:verifyToken',verifyAccount);

module.exports = router;
