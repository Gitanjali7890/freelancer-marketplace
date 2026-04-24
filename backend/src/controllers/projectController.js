const Project = require('../models/Project');
const Bid = require('../models/Bid');

exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create projects' });
    }
    
    const { title, description, budget, deadline } = req.body;
    
    const project = new Project({
      title,
      description,
      budget,
      deadline,
      clientId: req.user.userId
    });
    
    await project.save();
    
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    
    const projects = await Project.find(filter)
      .populate('clientId', 'name email profilePicture rating totalReviews')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name email profilePicture rating totalReviews');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await project.deleteOne();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'client') {
      projects = await Project.find({ clientId: req.user.userId })
        .populate('clientId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ status: 'open' })
        .populate('clientId', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// NEW: Mark project as completed
exports.completeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (project.status !== 'in-progress') {
      return res.status(400).json({ message: 'Only in-progress projects can be marked as completed' });
    }
    
    project.status = 'completed';
    await project.save();
    
    res.json({ 
      message: 'Project marked as completed successfully!', 
      project 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
