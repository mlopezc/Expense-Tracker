# Expense Tracker

A full-stack web application for personal expense tracking built with React and Express.js.

## Features

- **User Authentication**: Secure registration and login system
- **Expense Management**: Add, edit, delete, and categorize expenses
- **Category Management**: Custom expense categories with colors and icons
- **Data Visualization**: Charts and graphs for spending analysis
- **Reporting**: Generate reports by date range and category
- **Receipt Upload**: Attach receipts to expenses
- **Data Export**: Export data in CSV and JSON formats

## Tech Stack

### Frontend
- React 18+
- React Router for navigation
- Tailwind CSS for styling
- Chart.js for data visualization
- Axios for API calls
- Heroicons for icons

### Backend
- Node.js with Express.js
- SQLite (development) / PostgreSQL (production)
- JWT for authentication
- Multer for file uploads
- Joi for validation

### Development Tools
- Vite for build tooling
- ESLint for code linting
- Prettier for code formatting
- Concurrently for running multiple scripts

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ExpenseTracker
```

2. Install all dependencies (root, client, and server)
```bash
npm run install:all
```

3. Set up environment variables
```bash
cp server/.env.example server/.env
# Edit server/.env with your configuration
```

4. Initialize the database
```bash
cd server
npm run db:migrate
npm run db:seed
```

### Running the Application

#### Development Mode
Start both frontend and backend servers concurrently:
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

#### Individual Services
```bash
# Frontend only
npm run dev:client

# Backend only  
npm run dev:server
```

### Building for Production

```bash
npm run build
```

### Project Structure

```
expense-tracker/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API communication
│   │   ├── utils/              # Helper functions
│   │   └── styles/             # Global styles
│   └── package.json
├── server/                     # Express backend
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   ├── config/             # Configuration files
│   │   └── database/           # Database setup
│   ├── uploads/                # File storage
│   └── package.json
├── docs/                       # Documentation
├── tests/                      # Test files
└── package.json                # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses` - Get expenses (with filtering)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Reports
- `GET /api/reports/summary` - Get expense summary
- `GET /api/reports/categories` - Category analysis
- `GET /api/reports/trends` - Spending trends
- `GET /api/reports/export` - Export data

## Development Roadmap

The project follows a 6-phase development approach:

1. **Phase 1**: Project Setup & Foundation ✅
2. **Phase 2**: Core Backend Features
3. **Phase 3**: Frontend Core Features  
4. **Phase 4**: Data Visualization & Analytics
5. **Phase 5**: Enhanced Features & Polish
6. **Phase 6**: Deployment & Production Setup

See `Roadmap.md` for detailed development phases and tasks.

## Contributing

This project serves as a learning platform for documentation and testing practices. Students will be contributing:

- Comprehensive API documentation
- Unit and integration tests
- End-to-end testing scenarios
- User guides and tutorials

## License

This project is licensed under the MIT License.