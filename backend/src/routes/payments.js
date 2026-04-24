const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  releasePayment,
  getPaymentStatus
} = require('../controllers/paymentController');

router.post('/create-intent', authMiddleware, createPaymentIntent);
router.post('/confirm', authMiddleware, confirmPayment);
router.post('/release', authMiddleware, releasePayment);
router.get('/:projectId', authMiddleware, getPaymentStatus);

module.exports = router;