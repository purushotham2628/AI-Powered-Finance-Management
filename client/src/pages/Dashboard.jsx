import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
  Edit,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import { expenseAPI } from '../services/api';

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#6366F1',
  '#84CC16',
];

function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, statsRes] = await Promise.all([
        expenseAPI.getAll(user.uid),
        expenseAPI.getStats(user.uid),
      ]);
      setExpenses(expensesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.uid]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await expenseAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const chartData = stats?.categoryBreakdown
    ? Object.entries(stats.categoryBreakdown).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your financial journey</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  Total Income
                </p>
                <p className="text-3xl font-bold">
                  ${stats?.totalIncome?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">
                  Total Expenses
                </p>
                <p className="text-3xl font-bold">
                  ${stats?.totalExpense?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Balance</p>
                <p className="text-3xl font-bold">
                  ${stats?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Spending by Category
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No expense data available
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Transactions
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {expenses.length > 0 ? (
                expenses.slice(0, 10).map((expense) => (
                  <div
                    key={expense._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {expense.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {expense.category} •{' '}
                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p
                        className={`text-lg font-bold ${
                          expense.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {expense.type === 'income' ? '+' : '-'}$
                        {expense.amount.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No transactions yet. Add your first transaction!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <ExpenseForm
          user={user}
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

export default Dashboard;
