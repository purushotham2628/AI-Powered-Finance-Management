# SmartFinance AI - AI-Powered Personal Finance Manager

[![GitHub](https://img.shields.io/badge/GitHub-purushotham2628-blue?logo=github)](https://github.com/purushotham2628)

A modern, production-ready AI-powered personal finance management application with machine learning features, real-time analytics, and intelligent insights. Built with React, TypeScript, Express, and MongoDB. All financial data displayed in Indian Rupees (₹).

**GitHub Repository**: https://github.com/purushotham2628/AI-Powered-Finance-Management

## Features

### Core Features
- **Smart Transaction Tracking**: Add, manage, and categorize income/expense transactions with AI-powered category suggestions
- **Real-time Dashboard**: Beautiful overview of your financial health with animated statistics and charts
- **AI-Powered Insights**: Get personalized financial analysis and actionable recommendations
- **Budget Management**: Set and track spending limits with visual progress indicators and alerts
- **Savings Goals**: Create and track savings goals with progress visualization and contribution tracking
- **Advanced Analytics**: ML-powered spending predictions, anomaly detection, and pattern analysis
- **Currency**: All amounts displayed in Indian Rupees (₹)

### Machine Learning Features
- **Expense Prediction**: Forecast future spending by category using linear regression
- **Anomaly Detection**: Automatically identify unusual spending patterns using statistical analysis
- **Smart Categorization**: AI suggests transaction categories based on title and amount
- **Spending Pattern Analysis**: Detect trends, seasonality, and behavioral patterns in your finances
- **Confidence Scoring**: ML models provide confidence levels for all predictions

### User Experience
- **Beautiful UI**: Modern, clean design with smooth animations using Framer Motion
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
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
- **React Router v7** - Client-side routing
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Machine Learning
- **Custom ML Service** - TypeScript-based ML algorithms
  - Linear regression for predictions
  - Statistical anomaly detection
  - Pattern recognition
  - Time series analysis

## Project Structure

```
smartfinance-ai/
├── backend/                      # Express backend
│   ├── models/                   # MongoDB models
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Budget.js
│   │   └── SavingsGoal.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   ├── budgets.js
│   │   └── goals.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env.example
├── src/                         # React frontend
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── StatCard.tsx
│   │   └── TransactionForm.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Analytics.tsx
│   │   ├── Budgets.tsx
│   │   └── Goals.tsx
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── ml-service.ts        # ML algorithms
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)

### Step 1: Clone the Repository

```bash
git clone https://github.com/purushotham2628/AI-Powered-Finance-Management.git
cd AI-Powered-Finance-Management
```

### Step 2: Set Up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartfinance?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this
   NODE_ENV=development
   ```

   **Getting MongoDB URI:**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
   - Create a new cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<username>`, `<password>`, and database name

5. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Step 3: Set Up Frontend

1. Open a new terminal and navigate to the project root:
   ```bash
   cd ..
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to `http://localhost:5173`

## Deployment Guide

### Deploy Backend to Render

1. **Create a Render Account**
   - Go to [Render](https://render.com) and sign up

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: smartfinance-backend
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables**
   - In the Render dashboard, go to "Environment"
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_super_secret_jwt_key
     NODE_ENV=production
     PORT=5000
     ```

4. **Deploy**
   - Render will automatically build and deploy your backend
   - Note the backend URL (e.g., `https://smartfinance-backend.onrender.com`)

### Deploy Frontend to Netlify

1. **Create a Netlify Account**
   - Go to [Netlify](https://www.netlify.com) and sign up

2. **Deploy from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Configure build settings:
     - **Base directory**: (leave empty)
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Add Environment Variables**
   - In the Netlify dashboard, go to "Site settings" → "Environment variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
     Replace with your Render backend URL

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your frontend
   - Your app will be live at `https://your-site-name.netlify.app`

### Important Notes for Deployment

- **CORS**: The backend is configured to allow all origins. For production, update CORS settings in `backend/server.js`
- **MongoDB**: Use MongoDB Atlas for cloud database hosting
- **Environment Variables**: Never commit `.env` files to Git
- **Free Tier Limitations**: Render's free tier may spin down with inactivity (30s startup delay)

## Usage Guide

### Getting Started

1. **Sign Up**: Create an account with email and password
2. **Add Transactions**: Click "Add Transaction" to record income/expenses
3. **Smart Categories**: Use the "Smart Suggest" button for AI-powered category suggestions
4. **View Dashboard**: See your financial overview with real-time stats and charts

### Features Walkthrough

#### Dashboard
- Overview of total balance, income, and expenses (in ₹)
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

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `DELETE /api/budgets/:id` - Delete budget

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PATCH /api/goals/:id/contribute` - Add contribution
- `DELETE /api/goals/:id` - Delete goal

## Security

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth with 7-day expiry
- **Input Validation**: express-validator for all inputs
- **Environment Variables**: Sensitive data stored securely
- **CORS**: Configurable cross-origin policies
- **MongoDB Security**: Connection string encryption

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

**purushotham2628**
- GitHub: [@purushotham2628](https://github.com/purushotham2628)

## Support

For issues, questions, or feature requests:
- Open an issue on [GitHub](https://github.com/purushotham2628/AI-Powered-Finance-Management/issues)
- Include detailed description and screenshots
- Check existing issues first

---

**Built with modern technologies and AI-powered insights for smarter financial management in India**
