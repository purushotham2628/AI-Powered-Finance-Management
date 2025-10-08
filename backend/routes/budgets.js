import express from 'express';
import { body, validationResult } from 'express-validator';
import Budget from '../models/Budget.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

router.post('/',
  auth,
  [
    body('category').notEmpty().trim(),
    body('amount').isNumeric().isFloat({ min: 0 }),
    body('period').isIn(['monthly', 'quarterly', 'yearly']),
    body('startDate').isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const budget = new Budget({
        ...req.body,
        userId: req.userId
      });

      await budget.save();
      res.status(201).json(budget);
    } catch (error) {
      console.error('Create budget error:', error);
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }
);

router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

export default router;
