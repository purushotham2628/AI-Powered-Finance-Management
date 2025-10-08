import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PiggyBank, Target, TrendingUp, X, DollarSign } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { supabase, SavingsGoal } from '../lib/supabase';

const GOAL_CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'Home Purchase',
  'Car Purchase',
  'Education',
  'Wedding',
  'Retirement',
  'Investment',
  'Other'
];

export default function Goals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [contributeAmount, setContributeAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
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
      const { error } = await supabase.from('savings_goals').insert({
        user_id: user.id,
        title,
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount) || 0,
        target_date: targetDate || null,
        category: category || 'Other',
        priority
      });

      if (error) throw error;

      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setTargetDate('');
      setCategory('');
      setPriority('medium');
      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    setLoading(true);

    try {
      const newAmount = selectedGoal.current_amount + parseFloat(contributeAmount);
      const newStatus = newAmount >= selectedGoal.target_amount ? 'completed' : 'active';

      const { error } = await supabase
        .from('savings_goals')
        .update({
          current_amount: newAmount,
          status: newStatus
        })
        .eq('id', selectedGoal.id);

      if (error) throw error;

      setContributeAmount('');
      setIsContributeOpen(false);
      setSelectedGoal(null);
      loadData();
    } catch (error) {
      console.error('Error contributing to goal:', error);
      alert('Failed to add contribution');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this goal?')) return;

    try {
      const { error } = await supabase.from('savings_goals').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal');
    }
  };

  const openContribute = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsContributeOpen(true);
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
            <h1 className="text-3xl font-bold text-slate-900">Savings Goals</h1>
            <p className="text-slate-600 mt-1">Track your financial goals and milestones</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-5 h-5" />
            New Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => {
            const percentage = (goal.current_amount / goal.target_amount) * 100;
            const isCompleted = goal.status === 'completed';
            const daysLeft = goal.target_date
              ? Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isCompleted ? 'bg-green-600' :
                    goal.priority === 'high' ? 'bg-red-600' :
                    goal.priority === 'medium' ? 'bg-orange-600' :
                    'bg-blue-600'
                  }`} />

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isCompleted ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          <PiggyBank className={`w-5 h-5 ${
                            isCompleted ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">{goal.title}</h3>
                          <p className="text-sm text-slate-600">{goal.category}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <X className="w-4 h-4 text-slate-600" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-900">
                          ${goal.current_amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-slate-600">
                          of ${goal.target_amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-3 ${
                            isCompleted ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-medium ${
                          isCompleted ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {percentage.toFixed(0)}% complete
                        </span>
                        {daysLeft !== null && !isCompleted && (
                          <span className={`${
                            daysLeft < 30 ? 'text-red-600' :
                            daysLeft < 90 ? 'text-orange-600' :
                            'text-slate-600'
                          }`}>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                          </span>
                        )}
                      </div>

                      {!isCompleted && (
                        <Button
                          variant="primary"
                          className="w-full mt-4"
                          onClick={() => openContribute(goal)}
                        >
                          <DollarSign className="w-4 h-4" />
                          Add Contribution
                        </Button>
                      )}

                      {isCompleted && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            Goal Achieved!
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <PiggyBank className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No savings goals yet
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first savings goal to start tracking your progress
              </p>
              <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Goal
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
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Create Savings Goal</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <Input
                    label="Goal Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Emergency Fund"
                    required
                  />

                  <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: '', label: 'Select category' },
                      ...GOAL_CATEGORIES.map(cat => ({ value: cat, label: cat }))
                    ]}
                    required
                  />

                  <Input
                    label="Target Amount"
                    type="number"
                    step="0.01"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />

                  <Input
                    label="Current Amount (Optional)"
                    type="number"
                    step="0.01"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0.00"
                  />

                  <Input
                    label="Target Date (Optional)"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />

                  <Select
                    label="Priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' }
                    ]}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                      <Target className="w-4 h-4" />
                      Create Goal
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}

        {isContributeOpen && selectedGoal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsContributeOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsContributeOpen(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Add Contribution</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsContributeOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleContribute} className="p-6 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Contributing to:</p>
                    <p className="text-lg font-semibold text-slate-900">{selectedGoal.title}</p>
                    <p className="text-sm text-slate-600 mt-2">
                      Current: ${selectedGoal.current_amount.toLocaleString()} / ${selectedGoal.target_amount.toLocaleString()}
                    </p>
                  </div>

                  <Input
                    label="Contribution Amount"
                    type="number"
                    step="0.01"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsContributeOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                      <DollarSign className="w-4 h-4" />
                      Add Contribution
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
