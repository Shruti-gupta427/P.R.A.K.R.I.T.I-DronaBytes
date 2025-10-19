const express = require('express');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const { status, category, priority, limit = 20, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('reportedBy', 'username profile.firstName profile.lastName')
      .populate('assignedTo.officer', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reportedBy', 'username profile.firstName profile.lastName')
      .populate('assignedTo.officer', 'username profile.firstName profile.lastName')
      .populate('timeline.updatedBy', 'username profile.firstName profile.lastName');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      data: { complaint }
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new complaint
router.post('/', auth, async (req, res) => {
  try {
    const complaintData = {
      ...req.body,
      reportedBy: req.userId,
      priority: 'medium' // Will be calculated based on severity and category
    };

    const complaint = new Complaint(complaintData);
    
    // Calculate priority
    complaint.priority = complaint.calculatePriority();
    
    await complaint.save();
    
    // Update timeline
    await complaint.updateTimeline(
      'pending',
      'Complaint submitted successfully',
      req.userId
    );

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update complaint status (Government/Admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !['admin', 'government'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or Government role required.'
      });
    }

    const { status, description } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = status;
    
    // Update government response based on status
    if (status === 'acknowledged') {
      complaint.governmentResponse.acknowledgment = {
        received: true,
        receivedAt: new Date(),
        message: description,
        officer: user.username
      };
    } else if (status === 'in_progress') {
      complaint.governmentResponse.action = {
        taken: true,
        description,
        takenAt: new Date()
      };
    } else if (status === 'resolved') {
      complaint.governmentResponse.resolution = {
        resolved: true,
        resolvedAt: new Date(),
        description
      };
      
      // Award points to reporter
      const reporter = await User.findById(complaint.reportedBy);
      if (reporter) {
        reporter.profile.stats.pointsEarned += complaint.reward.points || 50;
        reporter.profile.stats.complaintsSubmitted += 1;
        await reporter.save();
        
        complaint.reward.awarded = true;
        complaint.reward.awardedAt = new Date();
      }
    }

    await complaint.updateTimeline(status, description, req.userId);
    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Assign complaint to officer (Government/Admin only)
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !['admin', 'government'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or Government role required.'
      });
    }

    const { officerId, department } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.assignedTo = {
      department,
      officer: officerId,
      assignedAt: new Date()
    };

    await complaint.updateTimeline(
      'assigned',
      `Complaint assigned to ${department}`,
      req.userId
    );

    res.json({
      success: true,
      message: 'Complaint assigned successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get user's complaints
router.get('/my-complaints', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ reportedBy: req.userId })
      .populate('assignedTo.officer', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { complaints }
    });
  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Add feedback to resolved complaint
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (complaint.reportedBy.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only provide feedback for your own complaints.'
      });
    }

    if (complaint.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be provided for resolved complaints'
      });
    }

    complaint.feedback = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await complaint.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { complaint }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
