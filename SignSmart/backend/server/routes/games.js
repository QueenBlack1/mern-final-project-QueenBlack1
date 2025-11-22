const express = require('express');
const mongoose = require('mongoose');
const GameScore = require('../models/GameScore');
const auth = require('../middleware/auth');
const { body, param, query, validationResult } = require('express-validator');

const router = express.Router();

// POST /api/games/scores - Save game score
router.post('/scores', [
  auth,
  body('gameType').isIn(['memory', 'quiz', 'spelling']).withMessage('Invalid game type'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a positive integer'),
  body('level').isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  body('timeTaken').optional().isInt({ min: 0 }).withMessage('Time taken must be a positive integer'),
  body('accuracy').optional().isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { gameType, score, level, timeTaken, accuracy } = req.body;

    const gameScore = new GameScore({
      user: req.user.id,
      gameType,
      score,
      level,
      timeTaken,
      accuracy
    });

    await gameScore.save();

    // Update user's game statistics
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { [`gameScores.${gameType}`]: score },
      $max: { [`highScores.${gameType}.${level}`]: score }
    });

    res.status(201).json({
      success: true,
      message: 'Game score saved successfully',
      data: gameScore
    });
  } catch (error) {
    console.error('Error saving game score:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// GET /api/games/scores - Get user's game scores
router.get('/scores', [
  auth,
  query('gameType').optional().isIn(['memory', 'quiz', 'spelling']),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { gameType, level, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user.id };
    
    if (gameType) filter.gameType = gameType;
    if (level) filter.level = level;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 50);

    const scores = await GameScore.find(filter)
      .sort({ score: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await GameScore.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: scores,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        filters: { gameType, level }
      }
    });
  } catch (error) {
    console.error('Error fetching game scores:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// GET /api/games/leaderboard - Get leaderboard
router.get('/leaderboard', [
  query('gameType').isIn(['memory', 'quiz', 'spelling']).withMessage('Invalid game type'),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { gameType, level, limit = 10 } = req.query;
    const filter = { gameType };
    if (level) filter.level = level;

    const leaderboard = await GameScore.find(filter)
      .populate('user', 'name avatar')
      .sort({ score: -1, timeTaken: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: leaderboard,
      meta: {
        gameType,
        level: level || 'all'
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;