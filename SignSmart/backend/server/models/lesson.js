const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  category: {
    type: String,
    enum: ['alphabet', 'numbers', 'greetings', 'basics'],
    required: true
  },
  signs: [{
    name: String,
    icon: String,
    description: String,
    videoUrl: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    }
  }],
  order: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 10
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', LessonSchema);