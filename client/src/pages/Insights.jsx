import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Sparkles, TrendingUp, Lightbulb, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { expenseAPI } from '../services/api';

function Insights({ user }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getInsights(
        user.uid,
        selectedMonth,
        selectedYear
      );
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [user.uid, selectedMonth, selectedYear]);

  const chartData = insights?.stats?.categoryBreakdown
    ? Object.entries(insights.stats.categoryBreakdown).map(([name, value]) => ({
        name: name.length > 12 ? name.substring(0, 12) + '...' : name,
        amount: value,
      }))
    : [];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl font-semibold text-gray-700">
            Generating AI insights...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            AI-Powered Insights
          </h1>
          <p className="text-gray-600 mt-1">
            Smart analysis and personalized recommendations
          </p>
        </div>

        <div className="card mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Select Period</h3>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="input-field"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="input-field"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {insights?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${insights.stats.totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="card border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-1">Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                ${insights.stats.totalExpense.toFixed(2)}
              </p>
            </div>
            <div className="card border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  insights.stats.balance >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                ${insights.stats.balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Spending Analysis
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="amount" fill="#3B82F6" name="Amount Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No expense data for this period
            </div>
          )}
        </div>

        {insights?.insights && (
          <div className="card bg-gradient-to-br from-blue-50 to-slate-50 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              AI Analysis
            </h2>
            <p className="text-gray-700 leading-relaxed">{insights.insights}</p>
          </div>
        )}

        {insights?.positive && (
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              What You're Doing Right
            </h2>
            <p className="text-gray-700 leading-relaxed">{insights.positive}</p>
          </div>
        )}

        {insights?.suggestions && insights.suggestions.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              Personalized Recommendations
            </h2>
            <div className="space-y-3">
              {insights.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!insights?.insights && (
          <div className="card text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Insights Yet
            </h3>
            <p className="text-gray-600">
              Start adding transactions to get AI-powered insights and
              recommendations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Insights;
