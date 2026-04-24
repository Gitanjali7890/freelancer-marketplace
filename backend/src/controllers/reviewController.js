const Review = require('../models/Review');
const Project = require('../models/Project');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    const { projectId, toUserId, rating, comment } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed projects' });
    }
    
    const existingReview = await Review.findOne({
      projectId,
      fromUserId: req.user.userId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this project' });
    }
    
    const review = new Review({
      projectId,
      fromUserId: req.user.userId,
      toUserId,
      rating,
      comment
    });
    
    await review.save();
    
    // Update user rating
    const reviews = await Review.find({ toUserId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(toUserId, {
      rating: avgRating,
      totalReviews: reviews.length
    });
    
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ toUserId: req.params.userId })
      .populate('fromUserId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ projectId: req.params.projectId })
      .populate('fromUserId', 'name')
      .populate('toUserId', 'name');
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
