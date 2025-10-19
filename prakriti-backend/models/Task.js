const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['waste_segregation', 'tree_planting', 'water_conservation', 'energy_saving', 'cleanup_drive', 'awareness_campaign']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  points: {
    type: Number,
    required: true,
    min: 10,
    max: 1000
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
    country: {
      type: String,
      default: 'India'
    }
  },
  requirements: {
    images: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    },
    description: String,
    checklist: [String]
  },
  deadline: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    images: [String], // URLs of uploaded images
    description: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    totalSubmissions: {
      type: Number,
      default: 0
    },
    verifiedSubmissions: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
taskSchema.index({ location: '2dsphere' });
taskSchema.index({ category: 1, isActive: 1 });
taskSchema.index({ createdBy: 1 });

// Update statistics when submissions are modified
taskSchema.methods.updateStatistics = function() {
  const totalSubmissions = this.submissions.length;
  const verifiedSubmissions = this.submissions.filter(sub => sub.status === 'verified').length;
  const completionRate = totalSubmissions > 0 ? (verifiedSubmissions / totalSubmissions) * 100 : 0;
  
  this.statistics = {
    totalSubmissions,
    verifiedSubmissions,
    completionRate
  };
  
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);
