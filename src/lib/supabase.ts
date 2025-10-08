import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  monthly_income: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes: string | null;
  is_recurring: boolean;
  recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string | null;
  alert_threshold: number;
  created_at: string;
  updated_at: string;
};

export type SavingsGoal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
};

export type MLPrediction = {
  id: string;
  user_id: string;
  prediction_type: string;
  category: string | null;
  predicted_amount: number;
  confidence_score: number;
  prediction_date: string;
  actual_amount: number | null;
  features: any;
  created_at: string;
};

export type SpendingInsight = {
  id: string;
  user_id: string;
  insight_type: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  category: string | null;
  amount: number | null;
  period_start: string | null;
  period_end: string | null;
  is_read: boolean;
  created_at: string;
};
