const express = require('express');
const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const auth = require('../middleware/auth');
const { body, param, query, validationResult } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');

const router = express.Router();

// Input validation middleware
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json(
      ResponseHelper.error(
        'Invalid lesson ID format',
        'INVALID_ID'
      )
    );
  }
  next();
};

const validateLevel = (req, res, next) => {
  const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  if (req.params.level && !validLevels.includes(req.params.level)) {
    return res.status(400).json(
      ResponseHelper.error(
        'Invalid level parameter',
        'INVALID_LEVEL',
        { validLevels }
      )
    );
  }
  next();
};

// GET /api/lessons - Get all lessons with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  query('category').optional().isIn(['alphabet', 'numbers', 'greetings', 'basics']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        ResponseHelper.error(
          'Validation failed',
          'VALIDATION_ERROR',
          errors.array()
        )
      );
    }

    const { level, category, page = 1, limit = 10, sort = 'order' } = req.query;
    
    // Build filter object
    const filter = {};
    if (level) filter.level = level;
    if (category) filter.category = category;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 100);

    // Execute query with pagination
    const lessons = await Lesson.find(filter)
      .sort({ [sort]: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    // Get total count for pagination info
    const total = await Lesson.countDocuments(filter);

    const meta = ResponseHelper.paginationMeta(page, limitNum, total, { level, category });

    res.status(200).json(
      ResponseHelper.list(lessons, meta, 'Lessons retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json(
      ResponseHelper.error(
        'Internal server error',
        'SERVER_ERROR'
      )
    );
  }
});

// GET /api/lessons/:id - Get single lesson
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).select('-__v');
    
    if (!lesson) {
      return res.status(404).json(
        ResponseHelper.error(
          'Lesson not found',
          'LESSON_NOT_FOUND'
        )
      );
    }

    res.status(200).json(
      ResponseHelper.success(
        lesson,
        'Lesson retrieved successfully'
      )
    );
  } catch (error) {
    console.error(`Error fetching lesson ${req.params.id}:`, error);
    
    if (error.name === 'CastError') {
      return res.status(400).json(
        ResponseHelper.error(
          'Invalid lesson ID',
          'INVALID_ID'
        )
      );
    }

    res.status(500).json(
      ResponseHelper.error(
        'Internal server error',
        'SERVER_ERROR'
      )
    );
  }
});

// POST /api/lessons - Create new lesson
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('level').isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  body('category').isIn(['alphabet', 'numbers', 'greetings', 'basics']).withMessage('Invalid category'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('signs').isArray({ min: 1 }).withMessage('At least one sign is required'),
  body('signs.*.name').notEmpty().withMessage('Sign name is required'),
  body('signs.*.icon').notEmpty().withMessage('Sign icon is required'),
  body('signs.*.description').notEmpty().withMessage('Sign description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        ResponseHelper.error(
          'Validation failed',
          'VALIDATION_ERROR',
          errors.array()
        )
      );
    }

    const { title, description, level, category, signs, order, estimatedTime } = req.body;

    // Check if lesson with same order and level already exists
    const existingLesson = await Lesson.findOne({ level, order });
    if (existingLesson) {
      return res.status(409).json(
        ResponseHelper.error(
          'Lesson with this order already exists for the specified level',
          'DUPLICATE_ORDER'
        )
      );
    }

    const newLesson = new Lesson({
      title,
      description,
      level,
      category,
      signs,
      order,
      estimatedTime: estimatedTime || 10,
      createdBy: req.user.id
    });

    const savedLesson = await newLesson.save();
    
    res.status(201).json(
      ResponseHelper.success(
        savedLesson,
        'Lesson created successfully'
      )
    );
  } catch (error) {
    console.error('Error creating lesson:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(
        ResponseHelper.error(
          'Validation failed',
          'VALIDATION_ERROR',
          errors
        )
      );
    }

    res.status(500).json(
      ResponseHelper.error(
        'Internal server error',
        'SERVER_ERROR'
      )
    );
  }
});

// PUT /api/lessons/:id - Update lesson
router.put('/:id', [
  auth,
  validateObjectId,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid level'),
  body('category').optional().isIn(['alphabet', 'numbers', 'greetings', 'basics']).withMessage('Invalid category'),
  body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        ResponseHelper.error(
          'Validation failed',
          'VALIDATION_ERROR',
          errors.array()
        )
      );
    }

    const { title, description, level, category, signs, order, estimatedTime } = req.body;

    // Check if lesson exists
    const existingLesson = await Lesson.findById(req.params.id);
    if (!existingLesson) {
      return res.status(404).json(
        ResponseHelper.error(
          'Lesson not found',
          'LESSON_NOT_FOUND'
        )
      );
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (level) updateData.level = level;
    if (category) updateData.category = category;
    if (signs) updateData.signs = signs;
    if (order) updateData.order = order;
    if (estimatedTime) updateData.estimatedTime = estimatedTime;

    // Check if updating order would cause conflict
    if (order && level) {
      const conflictLesson = await Lesson.findOne({ 
        level: level || existingLesson.level, 
        order, 
        _id: { $ne: req.params.id } 
      });
      
      if (conflictLesson) {
        return res.status(409).json(
          ResponseHelper.error(
            'Another lesson with this order already exists for the specified level',
            'DUPLICATE_ORDER'
          )
        );
      }
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json(
      ResponseHelper.success(
        updatedLesson,
        'Lesson updated successfully'
      )
    );
  } catch (error) {
    console.error(`Error updating lesson ${req.params.id}:`, error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(
        ResponseHelper.error(
          'Validation failed',
          'VALIDATION_ERROR',
          errors
        )
      );
    }

    res.status(500).json(
      ResponseHelper.error(
        'Internal server error',
        'SERVER_ERROR'
      )
    );
  }
});

// DELETE /api/lessons/:id - Delete lesson
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    
    if (!deletedLesson) {
      return res.status(404).json(
        ResponseHelper.error(
          'Lesson not found',
          'LESSON_NOT_FOUND'
        )
      );
    }

    res.status(200).json(
      ResponseHelper.success(
        {
          id: deletedLesson._id,
          title: deletedLesson.title,
          level: deletedLesson.level
        },
        'Lesson deleted successfully'
      )
    );
  } catch (error) {
    console.error(`Error deleting lesson ${req.params.id}:`, error);
    res.status(500).json(
      ResponseHelper.error(
        'Internal server error',
        'SERVER_ERROR'
      )
    );
  }
});

// GET /api/lessons/level/:level - Get lessons by level
router.get('/level/:level', validateLevel, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        ResponseHelper.error(
          'Validation failed',
          'VALIDATION_ERROR',
          errors.array()
        )
      );
    }

    const { level } = req.params;
    const { category, page = 1, limit = 10 } = req.query;

    const filter = { level };
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), 100);

    const lessons = await Lesson.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Lesson.countDocuments(filter);

    if (lessons.length === 0) {
      return res.status(404).json(
        ResponseHelper.error(
          `No lessons found for level: ${level}`,
          'NO_LESSONS_FOUND'
        )
      );
    }

    const meta = ResponseHelper.paginationMeta(page, limitNum, total, { level, category });

    res.status(200).json(
      ResponseHelper.list(lessons, meta, `Lessons for ${level} level retrieved successfully`)
    );
  } catch (error) {
    console.error(`Error fetching lessons for level ${req.params.level}:`, error);
    res.status(500).json(
      ResponseHelper.error(
        'Internal server error',
        'SERVER_ERROR'
      )
    );
  }
});

module.exports = router;