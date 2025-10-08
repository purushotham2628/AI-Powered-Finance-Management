import express from 'express';
import { body, validationResult } from 'express-validator';
import SavingsGoal from '../models/SavingsGoal.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

router.post('/',
  auth,
  [
    body('title').notEmpty().trim(),
    body('targetAmount').isNumeric().isFloat({ min: 0 }),
    body('category').notEmpty().trim(),
    body('priority').isIn(['low', 'medium', 'high'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const goal = new SavingsGoal({
        ...req.body,
        userId: req.userId
      });

      await goal.save();
      res.status(201).json(goal);
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  }
);

router.patch('/:id/contribute',
  auth,
  [body('amount').isNumeric().isFloat({ min: 0 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const goal = await SavingsGoal.findOne({
        _id: req.params.id,
        userId: req.userId
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      goal.currentAmount += req.body.amount;

      if (goal.currentAmount >= goal.targetAmount) {
        goal.status = 'completed';
      }

      await goal.save();
      res.json(goal);
    } catch (error) {
      console.error('Contribute to goal error:', error);
      res.status(500).json({ error: 'Failed to contribute to goal' });
    }
  }
);

router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
