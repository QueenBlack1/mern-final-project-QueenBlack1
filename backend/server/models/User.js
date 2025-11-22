const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  ageGroup: {
    type: String,
    enum: ['child', 'teen', 'adult'],
    default: 'adult'
  },
  avatar: {
    type: String,
    default: '',
    maxlength: 2
  },
  progress: {
    signsLearned: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 0, min: 0, max: 100 },
    currentLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    completedLessons: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson' 
    }],
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  gameScores: {
    memory: { type: Number, default: 0 },
    quiz: { type: Number, default: 0 },
    spelling: { type: Number, default: 0 }
  },
  highScores: {
    memory: {
      beginner: { type: Number, default: 0 },
      intermediate: { type: Number, default: 0 },
      advanced: { type: Number, default: 0 },
      expert: { type: Number, default: 0 }
    },
    quiz: {
      beginner: { type: Number, default: 0 },
      intermediate: { type: Number, default: 0 },
      advanced: { type: Number, default: 0 },
      expert: { type: Number, default: 0 }
    },
    spelling: {
      beginner: { type: Number, default: 0 },
      intermediate: { type: Number, default: 0 },
      advanced: { type: Number, default: 0 },
      expert: { type: Number, default: 0 }
    }
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    sound: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  }
}, {
  timestamps: true
});

// Index for efficient queries
UserSchema.index({ email: 1 });
UserSchema.index({ 'progress.currentLevel': 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active timestamp
UserSchema.methods.updateLastActive = function() {
  this.progress.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);