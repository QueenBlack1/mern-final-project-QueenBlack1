const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
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
    default: 'U'
  },
  progress: {
    signsLearned: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 0 },
    totalPracticeTime: { type: Number, default: 0 },
    currentLevel: { type: String, default: 'beginner' }
  },
  achievements: [{
    name: String,
    dateEarned: { type: Date, default: Date.now },
    icon: String
  }]
}, {
  timestamps: true
});


UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);