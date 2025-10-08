import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { supabase, Transaction } from '../lib/supabase';
import { mlService } from '../lib/ml-service';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const EXPENSE_CATEGORIES = [
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

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Other'
];

export function TransactionForm({ isOpen, onClose, onSuccess, userId }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [useSmartCategory, setUseSmartCategory] = useState(false);

  const handleSmartCategory = () => {
    if (title && amount) {
      const suggestedCategory = mlService.categorizeTransaction(title, parseFloat(amount));
      setCategory(suggestedCategory);
      setUseSmartCategory(true);
      setTimeout(() => setUseSmartCategory(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: userId,
        title,
        amount: parseFloat(amount),
        type,
        category: category || (type === 'expense' ? 'Other' : 'Other'),
        date,
        notes: notes || null,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : null
      });

      if (error) throw error;

      setTitle('');
      setAmount('');
      setCategory('');
      setNotes('');
      setIsRecurring(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add Transaction</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={type === 'expense' ? 'primary' : 'outline'}
                    className="flex-1"
                    onClick={() => setType('expense')}
                  >
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'income' ? 'primary' : 'outline'}
                    className="flex-1"
                    onClick={() => setType('income')}
                  >
                    Income
                  </Button>
                </div>

                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Grocery shopping"
                  required
                />

                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">
                      Category
                    </label>
                    {type === 'expense' && title && amount && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleSmartCategory}
                        className="text-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        Smart Suggest
                      </Button>
                    )}
                  </div>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: '', label: 'Select category' },
                      ...categories.map(cat => ({ value: cat, label: cat }))
                    ]}
                    required
                  />
                  {useSmartCategory && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-green-600 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI suggested category!
                    </motion.p>
                  )}
                </div>

                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional details..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-slate-700">
                    Recurring transaction
                  </label>
                </div>

                {isRecurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Select
                      label="Frequency"
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value as any)}
                      options={[
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'yearly', label: 'Yearly' }
                      ]}
                    />
                  </motion.div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                    <Plus className="w-4 h-4" />
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
