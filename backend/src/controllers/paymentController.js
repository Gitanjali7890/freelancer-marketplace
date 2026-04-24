const Payment = require('../models/Payment');
const Project = require('../models/Project');
const User = require('../models/User');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { projectId, bidId } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // For now, create a mock payment
    const payment = new Payment({
      projectId: project._id,
      clientId: req.user.userId,
      freelancerId: bid.freelancerId,
      amount: bid.amount,
      stripePaymentIntentId: 'mock_' + Date.now(),
      status: 'pending'
    });
    await payment.save();
    
    res.json({
      clientSecret: 'mock_client_secret',
      paymentId: payment._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    payment.status = 'completed';
    await payment.save();
    
    const project = await Project.findById(payment.projectId);
    project.status = 'in-progress';
    await project.save();
    
    res.json({ message: 'Payment confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.releasePayment = async (req, res) => {
  try {
    const { projectId } = req.body;
    
    const payment = await Payment.findOne({ projectId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    payment.escrowReleased = true;
    payment.releasedAt = new Date();
    await payment.save();
    
    await User.findByIdAndUpdate(payment.freelancerId, {
      $inc: { earnings: payment.amount }
    });
    
    res.json({ message: 'Payment released successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const payment = await Payment.findOne({ projectId });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};