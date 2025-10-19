const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active tasks
router.get('/', async (req, res) => {
  try {
    const { category, location, limit = 20, page = 1 } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;

    // If location is provided, find nearby tasks
    let query = Task.find(filter);
    
    if (location) {
      const [lng, lat] = location.split(',').map(Number);
      query = query.where('location').near({
        center: { type: 'Point', coordinates: [lng, lat] },
        maxDistance: 50000, // 50km radius
        spherical: true
      });
    }

    const tasks = await query
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username profile.firstName profile.lastName')
      .populate('submissions.user', 'username profile.firstName profile.lastName');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new task (Admin/Government only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !['admin', 'government'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or Government role required.'
      });
    }

    const taskData = {
      ...req.body,
      createdBy: req.userId
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Submit task completion
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const { images, description, location } = req.body;

    // Check if user already submitted
    const existingSubmission = task.submissions.find(
      sub => sub.user.toString() === req.userId.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this task'
      });
    }

    // Add submission
    task.submissions.push({
      user: req.userId,
      images,
      description,
      location
    });

    await task.updateStatistics();

    res.json({
      success: true,
      message: 'Task submission successful',
      data: { task }
    });
  } catch (error) {
    console.error('Submit task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Verify task submission (Admin/Government only)
router.put('/:taskId/verify/:submissionId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !['admin', 'government'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or Government role required.'
      });
    }

    const { taskId, submissionId } = req.params;
    const { status, feedback } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const submission = task.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.status = status;
    submission.feedback = feedback;
    submission.verifiedBy = req.userId;
    submission.verifiedAt = new Date();

    await task.updateStatistics();

    // Award points to user if verified
    if (status === 'verified') {
      const submitter = await User.findById(submission.user);
      if (submitter) {
        submitter.profile.stats.pointsEarned += task.points;
        submitter.profile.stats.tasksCompleted += 1;
        await submitter.save();
      }
    }

    res.json({
      success: true,
      message: 'Submission verified successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Verify submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get user's task submissions
router.get('/my-submissions', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      'submissions.user': req.userId
    }).populate('createdBy', 'username');

    const userSubmissions = tasks.map(task => {
      const submission = task.submissions.find(
        sub => sub.user.toString() === req.userId.toString()
      );
      return {
        task: {
          _id: task._id,
          title: task.title,
          category: task.category,
          points: task.points,
          createdBy: task.createdBy
        },
        submission
      };
    });

    res.json({
      success: true,
      data: { submissions: userSubmissions }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
