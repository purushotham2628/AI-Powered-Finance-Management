import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Target, Sparkles, Brain } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Navbar } from '../components/Navbar';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { supabase, Transaction } from '../lib/supabase';
import { mlService, PredictionResult, AnomalyDetection } from '../lib/ml-service';

export default function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: txns, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setTransactions(txns || []);

      if (txns && txns.length > 0) {
        const preds = mlService.predictNextMonthSpending(txns);
        setPredictions(preds);

        const allAnomalies: AnomalyDetection[] = [];
        const categories = [...new Set(txns.filter(t => t.type === 'expense').map(t => t.category))];
        categories.forEach(cat => {
          const catAnomalies = mlService.detectAnomalies(txns, cat);
          allAnomalies.push(...catAnomalies);
        });
        setAnomalies(allAnomalies.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyTrends = transactions
    .reduce((acc, t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      const existing = acc.find(item => item.month === monthKey);
      if (existing) {
        if (t.type === 'income') {
          existing.income += t.amount;
        } else {
          existing.expenses += t.amount;
        }
      } else {
        acc.push({
          month: monthKey,
          monthName,
          income: t.type === 'income' ? t.amount : 0,
          expenses: t.type === 'expense' ? t.amount : 0
        });
      }
      return acc;
    }, [] as { month: string; monthName: string; income: number; expenses: number }[])
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  const spendingPatterns = mlService.analyzeSpendingPatterns(transactions);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg font-medium text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-slate-600 mt-1">AI-powered financial analysis and predictions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <CardTitle>Next Month Predictions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.slice(0, 5).map((pred, index) => (
                    <motion.div
                      key={pred.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{pred.category}</h4>
                          <p className="text-2xl font-bold text-blue-600 mt-1">
                            ${pred.predictedAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pred.trend === 'increasing' ? 'bg-red-100 text-red-700' :
                            pred.trend === 'decreasing' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {pred.trend}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">
                          {(pred.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">
                  Add more transactions to see predictions
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <CardTitle>Anomaly Detection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {anomalies.length > 0 ? (
                <div className="space-y-4">
                  {anomalies.map((anomaly, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        anomaly.severity === 'high' ? 'bg-red-50 border-red-200' :
                        anomaly.severity === 'medium' ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                          anomaly.severity === 'high' ? 'text-red-600' :
                          anomaly.severity === 'medium' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 mb-1">
                            {anomaly.description}
                          </p>
                          <p className="text-sm text-slate-600">
                            Expected: ${anomaly.expectedRange.min.toFixed(2)} - ${anomaly.expectedRange.max.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">
                  No unusual spending detected
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {monthlyTrends.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Income vs Expenses Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="monthName" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Income"
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Expenses"
                    dot={{ fill: '#ef4444', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <CardTitle>Spending Patterns</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {spendingPatterns.length > 0 ? (
              <div className="space-y-6">
                {spendingPatterns.slice(0, 6).map((pattern, index) => (
                  <motion.div
                    key={pattern.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg">{pattern.category}</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Avg: ${pattern.avgAmount.toFixed(2)} • {pattern.frequency.toFixed(1)}x/month
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pattern.trend > 5 ? 'bg-red-100 text-red-700' :
                        pattern.trend < -5 ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {pattern.trend > 0 ? '+' : ''}{pattern.trend.toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{pattern.seasonality}</span>
                      <TrendingUp className={`w-4 h-4 ${
                        pattern.trend > 5 ? 'text-red-600' :
                        pattern.trend < -5 ? 'text-green-600' :
                        'text-slate-600'
                      }`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">
                Add more transactions to see patterns
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
