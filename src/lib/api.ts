const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const api = {
  auth: {
    signup: async (email: string, password: string) => {
      const data = await fetchWithAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.token);
      return data;
    },
    login: async (email: string, password: string) => {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.token);
      return data;
    },
    logout: () => {
      setAuthToken(null);
    },
  },
  transactions: {
    getAll: () => fetchWithAuth('/transactions'),
    create: (transaction: any) => fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),
    delete: (id: string) => fetchWithAuth(`/transactions/${id}`, {
      method: 'DELETE',
    }),
  },
  budgets: {
    getAll: () => fetchWithAuth('/budgets'),
    create: (budget: any) => fetchWithAuth('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    }),
    delete: (id: string) => fetchWithAuth(`/budgets/${id}`, {
      method: 'DELETE',
    }),
  },
  goals: {
    getAll: () => fetchWithAuth('/goals'),
    create: (goal: any) => fetchWithAuth('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    }),
    contribute: (id: string, amount: number) => fetchWithAuth(`/goals/${id}/contribute`, {
      method: 'PATCH',
      body: JSON.stringify({ amount }),
    }),
    delete: (id: string) => fetchWithAuth(`/goals/${id}`, {
      method: 'DELETE',
    }),
  },
};

export type Transaction = {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes: string | null;
  isRecurring: boolean;
  recurringFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type Budget = {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string | null;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
};

export type SavingsGoal = {
  _id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
};
