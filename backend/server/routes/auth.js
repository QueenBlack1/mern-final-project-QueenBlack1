const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');

const router = express.Router();

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// POST /api/auth/signup - User registration
router.post('/signup', [
  body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('ageGroup').optional().isIn(['child', 'teen', 'adult']).withMessage('Invalid age group')
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

    const { name, email, password, ageGroup } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json(
        ResponseHelper.error(
          'User with this email already exists',
          'USER_EXISTS'
        )
      );
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      ageGroup: ageGroup || 'adult',
      avatar: name.charAt(0).toUpperCase()
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json(
      ResponseHelper.success(
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            ageGroup: user.ageGroup
          }
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json(
      ResponseHelper.error(
        'Internal server error during registration',
        'SERVER_ERROR'
      )
    );
  }
});

// POST /api/auth/signin - User login
router.post('/signin', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json(
        ResponseHelper.error(
          'Invalid email or password',
          'INVALID_CREDENTIALS'
        )
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(
        ResponseHelper.error(
          'Invalid email or password',
          'INVALID_CREDENTIALS'
        )
      );
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json(
      ResponseHelper.success(
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            ageGroup: user.ageGroup,
            progress: user.progress
          }
        },
        'Login successful'
      )
    );
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json(
      ResponseHelper.error(
        'Internal server error during login',
        'SERVER_ERROR'
      )
    );
  }
});

// GET /api/auth/verify - Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json(
        ResponseHelper.error(
          'No token provided',
          'NO_TOKEN'
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password -__v');

    if (!user) {
      return res.status(401).json(
        ResponseHelper.error(
          'Invalid token',
          'INVALID_TOKEN'
        )
      );
    }

    res.status(200).json(
      ResponseHelper.success(
        { user },
        'Token is valid'
      )
    );
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json(
      ResponseHelper.error(
        'Invalid token',
        'INVALID_TOKEN'
      )
    );
  }
});

module.exports = router;