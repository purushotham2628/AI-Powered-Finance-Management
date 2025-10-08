# SmartFinance AI - Intelligent Personal Finance Manager

A stunning, production-ready AI-powered personal finance management application with machine learning features, real-time analytics, and intelligent insights.

## Features

### Core Features
- **Smart Transaction Tracking**: Add, manage, and categorize income/expense transactions with AI-powered category suggestions
- **Real-time Dashboard**: Beautiful overview of your financial health with animated statistics and charts
- **AI-Powered Insights**: Get personalized financial analysis and actionable recommendations
- **Budget Management**: Set and track spending limits with visual progress indicators and alerts
- **Savings Goals**: Create and track savings goals with progress visualization and contribution tracking
- **Advanced Analytics**: ML-powered spending predictions, anomaly detection, and pattern analysis

### Machine Learning Features
- **Expense Prediction**: Forecast next month's spending by category using linear regression
- **Anomaly Detection**: Automatically identify unusual spending patterns using statistical analysis
- **Smart Categorization**: AI suggests transaction categories based on title and amount
- **Spending Pattern Analysis**: Detect trends, seasonality, and behavioral patterns in your finances
- **Confidence Scoring**: ML models provide confidence levels for all predictions

### User Experience
- **Beautiful UI**: Modern, clean design with smooth animations using Framer Motion
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Secure Authentication**: Supabase Auth with email/password authentication
- **Real-time Updates**: Instant data synchronization across all views
- **Interactive Charts**: Dynamic visualizations using Recharts

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful, responsive charts
- **React Router v6** - Client-side routing
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - Complete backend platform
  - PostgreSQL database
  - Built-in authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
  - RESTful API

### Machine Learning
- **Custom ML Service** - TypeScript-based ML algorithms
  - Linear regression for predictions
  - Statistical anomaly detection
  - Pattern recognition
  - Time series analysis

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│              (React + TypeScript + Tailwind)                │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Dashboard │ │Analytics │ │ Budgets  │ │  Goals   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  ML SERVICE LAYER                           │
│                                                             │
│  • Expense Predictions    • Anomaly Detection              │
│  • Pattern Analysis       • Smart Categorization           │
│  • Trend Forecasting      • Confidence Scoring             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE CLIENT                            │
│                                                             │
│  • Authentication        • Real-time Queries               │
│  • Database Operations   • Type Generation                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE BACKEND                           │
│                                                             │
│  ┌───────────────────────────────────────────────┐         │
│  │         PostgreSQL Database                   │         │
│  │                                               │         │
│  │  • profiles          • budgets                │         │
│  │  • transactions      • savings_goals          │         │
│  │  • ml_predictions    • spending_insights      │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
│  ┌───────────────────────────────────────────────┐         │
│  │       Row Level Security (RLS)                │         │
│  │  • User data isolation                        │         │
│  │  • Secure by default                          │         │
│  └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Tables

#### profiles
User profile information linked to auth.users
- `id` (uuid, primary key)
- `email`, `full_name`, `avatar_url`
- `currency`, `monthly_income`
- Timestamps

#### transactions
Financial transactions (income/expenses)
- `id` (uuid, primary key)
- `user_id` (foreign key)
- `title`, `amount`, `type`, `category`
- `date`, `notes`, `tags`
- `is_recurring`, `recurring_frequency`
- Timestamps

#### budgets
Spending limit tracking
- `id` (uuid, primary key)
- `user_id` (foreign key)
- `category`, `amount`, `period`
- `start_date`, `end_date`
- `alert_threshold`
- Timestamps

#### savings_goals
Financial goal tracking
- `id` (uuid, primary key)
- `user_id` (foreign key)
- `title`, `target_amount`, `current_amount`
- `target_date`, `category`, `priority`, `status`
- Timestamps

#### ml_predictions
Machine learning prediction history
- `id` (uuid, primary key)
- `user_id` (foreign key)
- `prediction_type`, `category`
- `predicted_amount`, `confidence_score`
- `prediction_date`, `actual_amount`, `features`
- Timestamp

#### spending_insights
AI-generated financial insights
- `id` (uuid, primary key)
- `user_id` (foreign key)
- `insight_type`, `title`, `description`
- `severity`, `category`, `amount`
- `period_start`, `period_end`, `is_read`
- Timestamp

## Project Structure

```
smartfinance-ai/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Select.tsx
│   │   ├── Navbar.tsx             # Navigation component
│   │   ├── StatCard.tsx           # Dashboard stat cards
│   │   └── TransactionForm.tsx    # Transaction modal form
│   ├── pages/
│   │   ├── Login.tsx              # Authentication page
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── Analytics.tsx          # ML insights & predictions
│   │   ├── Budgets.tsx            # Budget management
│   │   └── Goals.tsx              # Savings goals
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client & types
│   │   └── ml-service.ts          # ML algorithms
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── .env.example                   # Environment variables template
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd smartfinance-ai
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to Project Settings → API
4. Copy your project URL and anon public key

### Step 4: Set Up the Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the migration from the instructions below and run it
3. This will create all tables, indexes, and RLS policies

### Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Step 6: Build the Project

```bash
npm run build
```

### Step 7: Access the Application

The application will be available at the URL shown in your terminal.

## Usage Guide

### Getting Started

1. **Sign Up**: Create an account with email and password
2. **Add Transactions**: Click "Add Transaction" to record income/expenses
3. **Smart Categories**: Use the "Smart Suggest" button for AI-powered category suggestions
4. **View Dashboard**: See your financial overview with real-time stats and charts

### Features Walkthrough

#### Dashboard
- Overview of total balance, income, and expenses
- AI-powered insights and recommendations
- Spending breakdown by category (pie chart)
- Recent transaction history

#### Analytics
- Next month spending predictions by category
- Anomaly detection for unusual expenses
- Income vs expenses trend analysis
- Spending patterns with seasonality detection

#### Budgets
- Create budgets for different categories
- Track spending against budget limits
- Visual progress indicators
- Automatic alerts when approaching limits

#### Goals
- Set financial savings goals
- Track progress with visual indicators
- Add contributions to goals
- Goal completion celebrations

## Machine Learning Features Explained

### Expense Prediction
Uses linear regression to analyze historical spending patterns and predict future expenses by category. Provides confidence scores and trend indicators.

### Anomaly Detection
Employs statistical analysis (z-scores and standard deviation) to identify unusual spending that deviates significantly from your normal patterns.

### Smart Categorization
Analyzes transaction titles and amounts to suggest appropriate categories using keyword matching and heuristics.

### Pattern Analysis
Examines spending frequency, amounts, and timing to detect trends, seasonality, and behavioral patterns in your financial habits.

## Security

- **Row Level Security (RLS)**: Every table has RLS policies ensuring users can only access their own data
- **Secure Authentication**: Supabase Auth with industry-standard security
- **Environment Variables**: Sensitive credentials stored securely
- **Type Safety**: TypeScript ensures compile-time safety
- **Input Validation**: All user inputs are validated and sanitized

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your Git repository
2. Add environment variables
3. Build command: `npm run build`
4. Deploy

### Backend
Supabase handles all backend infrastructure automatically.

## Performance Optimizations

- **Code Splitting**: React Router lazy loading
- **Optimized Animations**: Hardware-accelerated CSS transforms
- **Efficient Queries**: Indexed database columns
- **Memoization**: React hooks prevent unnecessary re-renders
- **Bundle Optimization**: Vite's tree-shaking and minification

## Future Enhancements

- [ ] Export data to CSV/PDF
- [ ] Recurring transaction automation
- [ ] Multi-currency support
- [ ] Email notifications for budget alerts
- [ ] Mobile app (React Native)
- [ ] Dark mode theme
- [ ] Bank account integration
- [ ] Advanced ML models (LSTM for time series)
- [ ] Social features (shared budgets)
- [ ] Financial health score

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Include detailed description and screenshots
- Check existing issues first

---

**Built with modern technologies and AI-powered insights for smarter financial management**
