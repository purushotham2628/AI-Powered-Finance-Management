import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { supabase, Budget, Transaction } from '../lib/supabase';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      const [budgetsRes, txnsRes] = await Promise.all([
        supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'expense')
      ]);

      if (budgetsRes.error) throw budgetsRes.error;
      if (txnsRes.error) throw txnsRes.error;

      setBudgets(budgetsRes.data || []);
      setTransactions(txnsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('budgets').insert({
        user_id: user.id,
        category,
        amount: parseFloat(amount),
        period,
        start_date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      setCategory('');
      setAmount('');
      setPeriod('monthly');
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this budget?')) return;

    try {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Failed to delete budget');
    }
  };

  const calculateSpent = (budget: Budget) => {
    const now = new Date();
    let startDate = new Date(budget.start_date);

    if (budget.period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (budget.period === 'quarterly') {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
    } else if (budget.period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return transactions
      .filter(t => t.category === budget.category)
      .filter(t => new Date(t.date) >= startDate)
      .reduce((sum, t) => sum + t.amount, 0);
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Budget Management</h1>
            <p className="text-slate-600 mt-1">Set and track your spending limits</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-5 h-5" />
            Create Budget
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget, index) => {
            const spent = calculateSpent(budget);
            const percentage = (spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage >= budget.alert_threshold && !isOverBudget;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isOverBudget ? 'bg-red-600' :
                    isNearLimit ? 'bg-orange-600' :
                    'bg-green-600'
                  }`} />

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900">{budget.category}</h3>
                        <p className="text-sm text-slate-600 capitalize">{budget.period}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <X className="w-4 h-4 text-slate-600" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-900">
                          ${spent.toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-600">
                          of ${budget.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-3 rounded-full ${
                            isOverBudget ? 'bg-red-600' :
                            isNearLimit ? 'bg-orange-600' :
                            'bg-green-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isOverBudget ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">
                                Over by ${(spent - budget.amount).toFixed(2)}
                              </span>
                            </>
                          ) : isNearLimit ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-600">
                                {percentage.toFixed(0)}% used
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                ${(budget.amount - spent).toFixed(2)} left
                              </span>
                            </>
                          )}
                        </div>
                        <span className="text-sm text-slate-600">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No budgets yet
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first budget to start tracking your spending limits
              </p>
              <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsFormOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsFormOpen(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Create Budget</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: '', label: 'Select category' },
                      ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
                    ]}
                    required
                  />

                  <Input
                    label="Budget Amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />

                  <Select
                    label="Period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    options={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'quarterly', label: 'Quarterly' },
                      { value: 'yearly', label: 'Yearly' }
                    ]}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                      <Target className="w-4 h-4" />
                      Create Budget
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
