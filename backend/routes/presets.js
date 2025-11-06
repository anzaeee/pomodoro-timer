const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all custom presets for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const presets = await prisma.customPreset.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ presets });
  } catch (error) {
    console.error('Get presets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new custom preset
router.post(
  '/',
  authMiddleware,
  [
    body('name').trim().isLength({ min: 1, max: 50 }),
    body('workDuration').isInt({ min: 1, max: 120 }),
    body('shortBreak').isInt({ min: 1, max: 60 }),
    body('longBreak').isInt({ min: 1, max: 120 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user already has 3 presets
      const presetCount = await prisma.customPreset.count({
        where: { userId: req.user.id },
      });

      if (presetCount >= 3) {
        return res.status(400).json({ message: 'Maximum of 3 custom presets allowed' });
      }

      // Check if preset name already exists for this user
      const existingPreset = await prisma.customPreset.findUnique({
        where: {
          userId_name: {
            userId: req.user.id,
            name: req.body.name,
          },
        },
      });

      if (existingPreset) {
        return res.status(400).json({ message: 'Preset name already exists' });
      }

      const preset = await prisma.customPreset.create({
        data: {
          userId: req.user.id,
          name: req.body.name,
          workDuration: req.body.workDuration,
          shortBreak: req.body.shortBreak,
          longBreak: req.body.longBreak,
        },
      });

      res.status(201).json({
        message: 'Preset created successfully',
        preset,
      });
    } catch (error) {
      console.error('Create preset error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a custom preset
router.put(
  '/:id',
  authMiddleware,
  [
    body('name').optional().trim().isLength({ min: 1, max: 50 }),
    body('workDuration').optional().isInt({ min: 1, max: 120 }),
    body('shortBreak').optional().isInt({ min: 1, max: 60 }),
    body('longBreak').optional().isInt({ min: 1, max: 120 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if preset exists and belongs to user
      const existingPreset = await prisma.customPreset.findFirst({
        where: {
          id: req.params.id,
          userId: req.user.id,
        },
      });

      if (!existingPreset) {
        return res.status(404).json({ message: 'Preset not found' });
      }

      // If name is being changed, check for duplicates
      if (req.body.name && req.body.name !== existingPreset.name) {
        const duplicatePreset = await prisma.customPreset.findUnique({
          where: {
            userId_name: {
              userId: req.user.id,
              name: req.body.name,
            },
          },
        });

        if (duplicatePreset) {
          return res.status(400).json({ message: 'Preset name already exists' });
        }
      }

      const preset = await prisma.customPreset.update({
        where: { id: req.params.id },
        data: {
          ...(req.body.name && { name: req.body.name }),
          ...(req.body.workDuration !== undefined && { workDuration: req.body.workDuration }),
          ...(req.body.shortBreak !== undefined && { shortBreak: req.body.shortBreak }),
          ...(req.body.longBreak !== undefined && { longBreak: req.body.longBreak }),
        },
      });

      res.json({
        message: 'Preset updated successfully',
        preset,
      });
    } catch (error) {
      console.error('Update preset error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a custom preset
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if preset exists and belongs to user
    const existingPreset = await prisma.customPreset.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existingPreset) {
      return res.status(404).json({ message: 'Preset not found' });
    }

    await prisma.customPreset.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Preset deleted successfully' });
  } catch (error) {
    console.error('Delete preset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

