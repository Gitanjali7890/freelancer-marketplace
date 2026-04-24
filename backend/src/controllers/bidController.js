const Bid = require('../models/Bid');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.createBid = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can place bids' });
    }
    
    const { projectId, amount, coverLetter, estimatedDays } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Cannot bid on this project' });
    }
    
    const existingBid = await Bid.findOne({
      projectId,
      freelancerId: req.user.userId
    });
    
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this project' });
    }
    
    const bid = new Bid({
      projectId,
      freelancerId: req.user.userId,
      amount,
      coverLetter,
      estimatedDays
    });
    
    await bid.save();
    
    res.status(201).json({
      message: 'Bid placed successfully',
      bid
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectBids = async (req, res) => {
  try {
    const bids = await Bid.find({ projectId: req.params.projectId })
      .populate('freelancerId', 'name email profilePicture rating');
    
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.userId })
      .populate('projectId', 'title budget status deadline')
      .sort({ createdAt: -1 });
    
    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findById(req.params.bidId);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    const project = await Project.findById(bid.projectId);
    
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    bid.status = status;
    await bid.save();
    
    if (status === 'accepted') {
      project.status = 'in-progress';
      project.selectedBidId = bid._id;
      await project.save();
      
      await Bid.updateMany(
        { projectId: project._id, _id: { $ne: bid._id } },
        { status: 'rejected' }
      );
    }
    
    res.json({ message: `Bid ${status} successfully`, bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
