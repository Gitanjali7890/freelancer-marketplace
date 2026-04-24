const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  completeProject
} = require('../controllers/projectController');

router.post('/', authMiddleware, createProject);
router.get('/', getAllProjects);
router.get('/my-projects', authMiddleware, getMyProjects);
router.get('/:id', getProjectById);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);
router.patch('/:id/complete', authMiddleware, completeProject);

module.exports = router;
