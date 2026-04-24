const User = require('../models/User');

// Get all freelancers with filters
exports.getFreelancers = async (req, res) => {
  try {
    const { search, skill, minRate, maxRate, minRating } = req.query;
    let filter = { role: 'freelancer' };
    
    // Search by name or bio (case-insensitive, partial match)
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by skill (case-insensitive, partial match)
    if (skill && skill.trim()) {
      filter.skills = { $in: [new RegExp(skill, 'i')] };
    }
    
    // Filter by hourly rate range
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate && minRate > 0) filter.hourlyRate.$gte = parseInt(minRate);
      if (maxRate && maxRate > 0) filter.hourlyRate.$lte = parseInt(maxRate);
    }
    
    // Filter by minimum rating
    if (minRating && minRating > 0) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    const freelancers = await User.find(filter).select('-password').sort({ rating: -1 });
    res.json(freelancers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single freelancer by ID
exports.getFreelancerById = async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select('-password');
    if (!freelancer || freelancer.role !== 'freelancer') {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    res.json(freelancer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update freelancer profile
exports.updateFreelancerProfile = async (req, res) => {
  try {
    const { bio, skills, hourlyRate, experience } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can update this profile' });
    }
    
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (hourlyRate) user.hourlyRate = hourlyRate;
    if (experience) user.experience = experience;
    
    await user.save();
    res.json({ 
      message: 'Profile updated successfully', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        hourlyRate: user.hourlyRate,
        experience: user.experience,
        rating: user.rating,
        completedProjects: user.completedProjects
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
