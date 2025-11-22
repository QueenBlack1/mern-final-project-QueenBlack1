const mongoose = require('mongoose');

const GameScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['memory', 'quiz', 'spelling'],
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    index: true
  },
  timeTaken: {
    type: Number, // in seconds
    min: 0
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
GameScoreSchema.index({ user: 1, gameType: 1, level: 1 });
GameScoreSchema.index({ gameType: 1, level: 1, score: -1 });

module.exports = mongoose.model('GameScore', GameScoreSchema);