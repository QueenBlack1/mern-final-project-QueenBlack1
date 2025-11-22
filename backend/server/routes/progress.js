const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('progress');
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user progress
router.put('/', auth, async (req, res) => {
  try {
    const { signsLearned, accuracyRate, currentLevel, completedLesson } = req.body;
    
    const updateData = {};
    if (signsLearned !== undefined) updateData['progress.signsLearned'] = signsLearned;
    if (accuracyRate !== undefined) updateData['progress.accuracyRate'] = accuracyRate;
    if (currentLevel !== undefined) updateData['progress.currentLevel'] = currentLevel;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData, $addToSet: { 'progress.completedLessons': completedLesson } },
      { new: true }
    ).select('progress');
    
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;