import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getAIInsights,
} from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.get('/insights', getAIInsights);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
