const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

router.post('/:lesson/:level', auth, async (req, res) => {
  try {
    const { lesson, level } = req.params;
    const { signsCompleted, totalScore, timeSpent } = req.body;

    let progress = await Progress.findOne({
      user: req.userId,
      lesson,
      level
    });

    if (progress) {
     
      progress.signsCompleted = signsCompleted;
      progress.totalScore = totalScore;
      progress.timeSpent = timeSpent;
    } else {
     
      progress = new Progress({
        user: req.userId,
        lesson,
        level,
        signsCompleted,
        totalScore,
        timeSpent
      });
    }

    await progress.save();

  
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        'progress.signsLearned': signsCompleted.length,
        'progress.totalPracticeTime': timeSpent
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress', error: error.message });
  }
});

module.exports = router;