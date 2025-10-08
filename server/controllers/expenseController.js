import Expense from '../models/expenseModel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createExpense = async (req, res) => {
  try {
    const { userId, title, amount, category, type, date, description, tags } = req.body;

    if (!userId || !title || !amount || !category || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const expense = new Expense({
      userId,
      title,
      amount,
      category,
      type,
      date: date || Date.now(),
      description,
      tags,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date, description, tags } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.type = type || expense.type;
    expense.date = date || expense.date;
    expense.description = description || expense.description;
    expense.tags = tags || expense.tags;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseStats = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find({ userId, ...dateFilter });

    const totalIncome = expenses
      .filter((exp) => exp.type === 'income')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const totalExpense = expenses
      .filter((exp) => exp.type === 'expense')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const categoryBreakdown = expenses
      .filter((exp) => exp.type === 'expense')
      .reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
      transactionCount: expenses.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAIInsights = async (req, res) => {
  try {
    const { userId, month, year } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const currentMonth = month ? parseInt(month) : new Date().getMonth();
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    if (expenses.length === 0) {
      return res.json({
        insights: 'No expenses recorded for this period. Start tracking your expenses to get personalized insights!',
        suggestions: [],
      });
    }

    const totalIncome = expenses
      .filter((exp) => exp.type === 'income')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const totalExpense = expenses
      .filter((exp) => exp.type === 'expense')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const categoryBreakdown = expenses
      .filter((exp) => exp.type === 'expense')
      .reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});

    const prompt = `
You are a personal finance advisor. Analyze the following financial data and provide insights and suggestions:

Total Income: $${totalIncome}
Total Expenses: $${totalExpense}
Net Balance: $${totalIncome - totalExpense}

Spending by Category:
${Object.entries(categoryBreakdown)
  .map(([cat, amt]) => `- ${cat}: $${amt} (${((amt / totalExpense) * 100).toFixed(1)}%)`)
  .join('\n')}

Please provide:
1. A brief analysis of spending habits (2-3 sentences)
2. Top 3 specific, actionable savings suggestions
3. One positive observation about their financial behavior

Format your response as JSON with this structure:
{
  "analysis": "your analysis here",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "positive": "positive observation here"
}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const aiResponse = JSON.parse(text);

    res.json({
      insights: aiResponse.analysis,
      suggestions: aiResponse.suggestions,
      positive: aiResponse.positive,
      stats: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error('AI Insights Error:', error);
    res.status(500).json({
      message: 'Failed to generate insights',
      error: error.message,
    });
  }
};
