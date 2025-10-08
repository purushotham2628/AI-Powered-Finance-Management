# AI-Powered Personal Finance Manager

A full-stack JavaScript application that helps you track expenses, analyze spending patterns, and get AI-powered financial insights and recommendations.

## Features

- **Expense Tracking**: Add, view, update, and delete income and expense transactions
- **AI-Powered Insights**: Get personalized financial analysis and savings suggestions using Google Gemini AI
- **Visual Analytics**: Interactive charts showing spending by category and trends
- **User Authentication**: Secure login and signup with Firebase Authentication (Email/Password + Google Sign-In)
- **Real-time Dashboard**: Overview of income, expenses, and balance
- **Category-based Organization**: Track spending across multiple predefined categories
- **Responsive Design**: Beautiful, modern UI built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - API communication
- **Firebase Auth** - Authentication
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Google Gemini AI** - AI-powered insights
- **CORS** - Cross-origin resource sharing

## Architecture Flowchart

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + Tailwind CSS)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION                             │
│                     (Firebase Auth)                             │
│           Email/Password + Google Sign-In                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT ROUTING                            │
│                    (React Router DOM)                           │
│                                                                 │
│   ┌────────────┐    ┌────────────┐    ┌────────────┐         │
│   │   Login    │    │ Dashboard  │    │  Insights  │         │
│   │    Page    │    │    Page    │    │    Page    │         │
│   └────────────┘    └────────────┘    └────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API SERVICE LAYER                          │
│                         (Axios)                                 │
│              HTTP Requests to Backend API                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPRESS.JS SERVER                           │
│                      (Port: 5000)                               │
│                                                                 │
│   ┌──────────────────────────────────────────────────┐         │
│   │              API ROUTES                          │         │
│   │  ┌────────────────┐    ┌─────────────────┐     │         │
│   │  │ /api/expenses  │    │  /api/users     │     │         │
│   │  │                │    │                 │     │         │
│   │  │ • GET all      │    │ • POST create   │     │         │
│   │  │ • POST create  │    │ • GET profile   │     │         │
│   │  │ • PUT update   │    │ • PUT update    │     │         │
│   │  │ • DELETE       │    │ • DELETE        │     │         │
│   │  │ • GET stats    │    │                 │     │         │
│   │  │ • GET insights │    │                 │     │         │
│   │  └────────────────┘    └─────────────────┘     │         │
│   └──────────────────────────────────────────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTROLLERS                                │
│                                                                 │
│   ┌─────────────────────┐    ┌─────────────────────┐          │
│   │ expenseController   │    │  userController     │          │
│   │                     │    │                     │          │
│   │ • Business Logic    │    │ • User Management   │          │
│   │ • Data Processing   │    │ • Profile Updates   │          │
│   │ • AI Integration    │    │                     │          │
│   └─────────────────────┘    └─────────────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
           ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│   MONGODB DATABASE   │    │  GOOGLE GEMINI AI    │
│     (Mongoose)       │    │                      │
│                      │    │ • Expense Analysis   │
│  ┌────────────────┐  │    │ • Insights Gen.      │
│  │  User Model    │  │    │ • Recommendations    │
│  │  • uid         │  │    │                      │
│  │  • email       │  │    └──────────────────────┘
│  │  • profile     │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ Expense Model  │  │
│  │  • userId      │  │
│  │  • title       │  │
│  │  • amount      │  │
│  │  • category    │  │
│  │  • type        │  │
│  │  • date        │  │
│  └────────────────┘  │
└──────────────────────┘
\`\`\`

## Data Flow

1. **User Authentication**: User logs in via Firebase (email/password or Google)
2. **User Sync**: Firebase user data syncs with MongoDB via backend API
3. **Transaction Management**: User creates/reads/updates/deletes expenses through React UI
4. **API Communication**: Frontend sends HTTP requests to Express backend
5. **Data Persistence**: Backend stores data in MongoDB
6. **AI Analysis**: When user views insights, backend fetches expense data and sends to Gemini AI
7. **Visualization**: Charts and statistics rendered on Dashboard and Insights pages

## Project Structure

\`\`\`
AI-Personal-Finance-Manager/
│
├── client/                         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   └── ExpenseForm.jsx
│   │   ├── pages/                  # Main application pages
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Insights.jsx
│   │   ├── services/               # External service integrations
│   │   │   ├── api.js              # Axios API calls
│   │   │   └── firebase.js         # Firebase auth config
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                         # Backend (Node.js + Express)
│   ├── routes/
│   │   ├── expenseRoutes.js        # Expense endpoints
│   │   └── userRoutes.js           # User endpoints
│   ├── controllers/
│   │   ├── expenseController.js    # Expense business logic
│   │   └── userController.js       # User business logic
│   ├── models/
│   │   ├── userModel.js            # User MongoDB schema
│   │   └── expenseModel.js         # Expense MongoDB schema
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── server.js                   # Express server entry
│   └── package.json
│
├── shared/                         # Shared utilities
│   └── constants.js                # Shared constants
│
├── .env                            # Environment variables (create from .env.example)
├── .env.example                    # Example environment file
├── .gitignore
├── package.json                    # Root package for concurrent dev
└── README.md
\`\`\`

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Either:
  - [Local MongoDB installation](https://www.mongodb.com/docs/manual/installation/)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud database - recommended)
- **Firebase Account** - [Create Account](https://firebase.google.com/)
- **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)

## Installation & Setup

### Step 1: Clone or Download the Project

\`\`\`bash
cd AI-Personal-Finance-Manager
\`\`\`

### Step 2: Install All Dependencies

Run this command from the root directory to install dependencies for both client and server:

\`\`\`bash
npm run install-all
\`\`\`

Or install manually:

\`\`\`bash
# Root dependencies
npm install

# Client dependencies
cd client
npm install

# Server dependencies
cd ../server
npm install
cd ..
\`\`\`

### Step 3: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string (it looks like: \`mongodb+srv://username:password@cluster.mongodb.net/\`)
6. Replace \`<password>\` with your database password

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   \`\`\`bash
   mongod
   \`\`\`
3. Your connection string will be: \`mongodb://localhost:27017/finance-manager\`

### Step 4: Set Up Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to **Authentication** → **Get Started**
4. Enable **Email/Password** authentication
5. Enable **Google** authentication
6. Go to **Project Settings** (gear icon) → **General**
7. Scroll down to "Your apps" and click the web icon (\`</>\`)
8. Register your app and copy the Firebase configuration

### Step 5: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 6: Configure Environment Variables

1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Open \`.env\` and fill in your credentials:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-manager

# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini AI API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API URL
VITE_API_URL=http://localhost:5000/api
\`\`\`

### Step 7: Run the Application

From the root directory, run:

\`\`\`bash
npm run dev
\`\`\`

This will start both the frontend and backend concurrently:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### Step 8: Create Your Account

1. Open your browser and go to http://localhost:3000
2. Click "Sign Up" and create an account
3. Or use "Continue with Google" for faster signup

## Usage

### Adding Transactions

1. Navigate to the Dashboard
2. Click "Add Transaction" button
3. Fill in the form:
   - Select type (Income or Expense)
   - Enter title, amount, category, and date
   - Optionally add a description
4. Click "Add Transaction"

### Viewing Analytics

- **Dashboard**: View total income, expenses, balance, pie chart of spending by category, and recent transactions
- **AI Insights**: Get AI-powered analysis of your spending habits, personalized recommendations, and detailed bar charts

### Managing Transactions

- View all transactions on the Dashboard
- Delete transactions by clicking the trash icon
- Transactions are automatically categorized and visualized

## API Endpoints

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users | Create or update user |
| GET | /api/users/:uid | Get user profile |
| PUT | /api/users/:uid | Update user profile |
| DELETE | /api/users/:uid | Delete user |

### Expense Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/expenses | Create new expense |
| GET | /api/expenses?userId=:uid | Get all user expenses |
| GET | /api/expenses/:id | Get single expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/expenses/stats?userId=:uid | Get expense statistics |
| GET | /api/expenses/insights?userId=:uid&month=:m&year=:y | Get AI insights |

## Scripts

### Root Level

\`\`\`bash
npm run dev          # Run both client and server concurrently
npm run client       # Run only frontend
npm run server       # Run only backend
npm run install-all  # Install all dependencies
npm run build        # Build client for production
npm start            # Start production server
\`\`\`

### Client

\`\`\`bash
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
\`\`\`

### Server

\`\`\`bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
\`\`\`

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Set root directory to \`client\`
5. Add environment variables (all VITE_* variables)
6. Deploy

### Backend (Render)

1. Go to [Render](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set root directory to \`server\`
5. Set build command: \`npm install\`
6. Set start command: \`npm start\`
7. Add environment variables (MONGODB_URI, GEMINI_API_KEY, etc.)
8. Deploy

### Environment Variables for Production

Update \`VITE_API_URL\` in your frontend deployment to point to your production backend URL.

## Troubleshooting

### Port Already in Use

If you get "Port already in use" error:

\`\`\`bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
\`\`\`

### MongoDB Connection Error

- Check your MongoDB URI is correct
- Ensure your IP address is whitelisted in MongoDB Atlas
- Verify your database password is correct

### Firebase Auth Error

- Verify all Firebase config values are correct
- Check that authentication methods are enabled in Firebase Console
- Ensure your domain is authorized in Firebase settings

### AI Insights Not Working

- Verify your Gemini API key is correct and active
- Check you have billing enabled (if required)
- Ensure you have transactions in the selected month/year

## Features Roadmap

- [ ] Budget setting and tracking
- [ ] Recurring transactions
- [ ] Multiple currency support
- [ ] Export data to CSV/PDF
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Transaction tags and filters
- [ ] Advanced AI predictions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Include screenshots if applicable

## Acknowledgments

- Google Gemini AI for intelligent insights
- Firebase for authentication
- MongoDB for database
- React and Vite for amazing developer experience
- Recharts for beautiful visualizations

---

**Built with ❤️ using React, Node.js, MongoDB, and AI**
