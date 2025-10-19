const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['illegal_dumping', 'water_pollution', 'air_pollution', 'noise_pollution', 'deforestation', 'waste_management', 'other']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  images: [String], // URLs of uploaded images
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    department: String,
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: Date
  },
  governmentResponse: {
    acknowledgment: {
      received: {
        type: Boolean,
        default: false
      },
      receivedAt: Date,
      message: String,
      officer: String
    },
    action: {
      taken: {
        type: Boolean,
        default: false
      },
      description: String,
      takenAt: Date,
      images: [String]
    },
    resolution: {
      resolved: {
        type: Boolean,
        default: false
      },
      resolvedAt: Date,
      description: String,
      finalImages: [String]
    }
  },
  timeline: [{
    status: String,
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  reward: {
    points: {
      type: Number,
      default: 0
    },
    awarded: {
      type: Boolean,
      default: false
    },
    awardedAt: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ reportedBy: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ createdAt: -1 });

// Update timeline when status changes
complaintSchema.methods.updateTimeline = function(status, description, updatedBy) {
  this.timeline.push({
    status,
    description,
    timestamp: new Date(),
    updatedBy
  });
  return this.save();
};

// Calculate priority based on severity and other factors
complaintSchema.methods.calculatePriority = function() {
  const severityWeight = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'critical': 4
  };
  
  const categoryWeight = {
    'illegal_dumping': 2,
    'water_pollution': 3,
    'air_pollution': 3,
    'noise_pollution': 1,
    'deforestation': 3,
    'waste_management': 2,
    'other': 1
  };
  
  const weight = severityWeight[this.severity] + categoryWeight[this.category];
  
  if (weight >= 6) return 'urgent';
  if (weight >= 4) return 'high';
  if (weight >= 2) return 'medium';
  return 'low';
};

module.exports = mongoose.model('Complaint', complaintSchema);
