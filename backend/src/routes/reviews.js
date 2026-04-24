const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createReview,
  getUserReviews,
  getProjectReviews
} = require('../controllers/reviewController');

router.post('/', authMiddleware, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/project/:projectId', getProjectReviews);

module.exports = router;
