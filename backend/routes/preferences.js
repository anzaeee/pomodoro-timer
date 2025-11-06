const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user preferences
router.get('/', authMiddleware, async (req, res) => {
  try {
    let preferences = await prisma.preference.findUnique({
      where: { userId: req.user.id },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.preference.create({
        data: {
          userId: req.user.id,
        },
      });
    }

    res.json({ preferences });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put(
  '/',
  authMiddleware,
  [
    body('workDuration').optional().isInt({ min: 1, max: 60 }),
    body('shortBreak').optional().isInt({ min: 1, max: 30 }),
    body('longBreak').optional().isInt({ min: 1, max: 60 }),
    body('autoStartBreaks').optional().isBoolean(),
    body('autoStartPomodoros').optional().isBoolean(),
    body('longBreakInterval').optional().isInt({ min: 1 }),
    body('soundEnabled').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        workDuration,
        shortBreak,
        longBreak,
        autoStartBreaks,
        autoStartPomodoros,
        longBreakInterval,
        soundEnabled,
      } = req.body;

      // Check if preferences exist
      let preferences = await prisma.preference.findUnique({
        where: { userId: req.user.id },
      });

      if (!preferences) {
        // Create new preferences
        preferences = await prisma.preference.create({
          data: {
            userId: req.user.id,
            workDuration: workDuration || 25,
            shortBreak: shortBreak || 5,
            longBreak: longBreak || 15,
            autoStartBreaks: autoStartBreaks ?? true,
            autoStartPomodoros: autoStartPomodoros ?? false,
            longBreakInterval: longBreakInterval || 4,
            soundEnabled: soundEnabled ?? true,
          },
        });
      } else {
        // Update existing preferences
        preferences = await prisma.preference.update({
          where: { userId: req.user.id },
          data: {
            ...(workDuration !== undefined && { workDuration }),
            ...(shortBreak !== undefined && { shortBreak }),
            ...(longBreak !== undefined && { longBreak }),
            ...(autoStartBreaks !== undefined && { autoStartBreaks }),
            ...(autoStartPomodoros !== undefined && { autoStartPomodoros }),
            ...(longBreakInterval !== undefined && { longBreakInterval }),
            ...(soundEnabled !== undefined && { soundEnabled }),
          },
        });
      }

      res.json({
        message: 'Preferences updated successfully',
        preferences,
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

