const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  signsCompleted: [{
    signId: String,
    accuracy: Number,
    attempts: Number,
    bestAccuracy: Number,
    lastPracticed: Date
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

ProgressSchema.index({ user: 1, lesson: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);