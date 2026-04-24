const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createBid,
  getProjectBids,
  updateBidStatus,
  getMyBids
} = require('../controllers/bidController');

router.post('/', authMiddleware, createBid);
router.get('/my-bids', authMiddleware, getMyBids);
router.get('/project/:projectId', authMiddleware, getProjectBids);
router.patch('/:bidId', authMiddleware, updateBidStatus);

module.exports = router;