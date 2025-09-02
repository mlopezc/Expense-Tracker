# Expense Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-%5E18.2.0-blue.svg)

A modern, full-stack web application for personal expense tracking with advanced analytics and reporting capabilities.

## 🚀 Overview

**Expense Tracker** is a comprehensive personal finance management tool that empowers users to take control of their spending habits. Built with modern web technologies, it provides an intuitive interface for expense management, powerful analytics, and detailed reporting features.

### Key Features

- 🔐 **Secure Authentication** - JWT-based user registration and login system
- 💰 **Smart Expense Management** - Create, edit, and categorize expenses with receipt attachments
- 🏷️ **Dynamic Categories** - Custom expense categories with visual customization (colors & icons)
- 📊 **Advanced Analytics** - Interactive charts and spending trend analysis
- 📈 **Comprehensive Reporting** - Generate detailed reports by date range and category
- 📎 **Receipt Management** - Upload and attach receipts to expense records
- 📤 **Data Export** - Export financial data in multiple formats (CSV, JSON)
- 🔍 **Advanced Filtering** - Search and filter expenses by multiple criteria
- 📱 **Responsive Design** - Works seamlessly across desktop and mobile devices

### Use Cases

- **Personal Finance Management** - Track daily expenses and identify spending patterns
- **Budget Planning** - Analyze spending habits to create realistic budgets
- **Tax Preparation** - Organize and categorize expenses for tax reporting
- **Business Expense Tracking** - Monitor business-related expenses and receipts
- **Financial Goal Setting** - Use spending insights to achieve financial objectives

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18.2.0** - Modern UI library with hooks and context
- **React Router DOM 6.20.1** - Client-side routing and navigation
- **Vite 5.0.0** - Fast build tool and development server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.2** - Promise-based HTTP client
- **Chart.js 4.4.0 + React-ChartJS-2 5.2.0** - Interactive data visualization
- **Heroicons React 2.0.18** - Beautiful SVG icons
- **date-fns 2.30.0** - Modern JavaScript date utility library

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Fast, minimalist web framework
- **SQLite3 5.1.6** - Embedded database for development
- **PostgreSQL** - Production database (configured)
- **Knex.js 3.0.1** - SQL query builder and schema migrations
- **JWT (jsonwebtoken 9.0.2)** - Secure token-based authentication
- **bcryptjs 2.4.3** - Password hashing and encryption
- **Joi 17.11.0** - Object schema validation
- **Multer 1.4.5** - Multipart/form-data handling for file uploads

### Development & Build Tools
- **ESLint 8.53.0+** - Code quality and style enforcement
- **Jest 29.7.0** - JavaScript testing framework
- **Supertest 6.3.3** - HTTP assertion library for testing
- **Nodemon 3.0.1** - Automatic server restart during development
- **Concurrently 8.2.2** - Run multiple npm scripts simultaneously
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixing

## 🏗️ Project Architecture

### System Architecture
```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐    SQL Queries    ┌─────────────────┐
│   React Client  │ ◄─────────────► │  Express Server │ ◄─────────────► │    Database     │
│                 │                  │                 │                  │                 │
│  • Components   │                  │  • Controllers  │                  │  • Users        │
│  • Context API  │                  │  • Middleware   │                  │  • Categories   │
│  • Services     │                  │  • Models       │                  │  • Expenses     │
│  • Routing      │                  │  • Routes       │                  │                 │
└─────────────────┘                  └─────────────────┘                  └─────────────────┘
```

### Directory Structure
```
expense-tracker/
├── client/                      # React Frontend Application
│   ├── public/                  # Static assets
│   │   └── vite.svg            # Vite logo
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── categories/      # Category management components
│   │   │   ├── common/          # Shared components (Layout, Navbar, etc.)
│   │   │   ├── expenses/        # Expense management components
│   │   │   └── forms/           # Form components
│   │   ├── context/             # React Context Providers
│   │   │   ├── AuthContext.jsx  # Authentication state management
│   │   │   └── ExpenseContext.jsx # Expense & category state management
│   │   ├── pages/               # Route-level page components
│   │   ├── services/            # API communication layer
│   │   │   └── api.js          # Axios configuration with interceptors
│   │   ├── styles/              # Global CSS styles
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── vite.config.js          # Vite build configuration
├── server/                      # Express Backend Application
│   ├── src/
│   │   ├── config/              # Database and environment configuration
│   │   ├── controllers/         # Business logic handlers
│   │   │   ├── authController.js     # User authentication logic
│   │   │   ├── categoryController.js # Category CRUD operations
│   │   │   └── expenseController.js  # Expense CRUD operations
│   │   ├── database/            # Database setup and management
│   │   │   ├── connection.js    # SQLite connection wrapper
│   │   │   ├── schema.sql       # Database schema definition
│   │   │   ├── seed.sql         # Initial data seeding
│   │   │   └── seeder.js        # Seeding logic
│   │   ├── middleware/          # Express middleware functions
│   │   │   └── auth.js         # JWT authentication middleware
│   │   ├── models/              # Data models with business logic
│   │   │   ├── User.js         # User model with authentication methods
│   │   │   ├── Category.js     # Category model with validation
│   │   │   └── Expense.js      # Expense model with filtering/pagination
│   │   ├── routes/              # API route definitions
│   │   └── utils/               # Utility functions
│   ├── uploads/                 # File storage directory
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express server entry point
├── docs/                        # Documentation (for student contributions)
├── tests/                       # Test files (for student contributions)
├── README.md                    # Project documentation
├── Roadmap.md                   # Development roadmap
├── context.md                   # Project analysis documentation
└── package.json                 # Root-level scripts and dependencies
```

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** version 18.0.0 or higher
- **npm** package manager (comes with Node.js)
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables** *(Optional - will use defaults)*
   ```bash
   # Copy example environment file (when available)
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   # PORT=3001
   # NODE_ENV=development
   # JWT_SECRET=your-secret-key
   # DATABASE_URL=your-database-url (for production)
   ```

4. **Initialize the database** *(Currently automatic on first run)*
   ```bash
   # The database will be automatically created when starting the server
   # Future: npm run db:migrate && npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Health Check**: http://localhost:3001/api/health

## 🚀 Usage

### Development Commands

```bash
# Start both frontend and backend (recommended)
npm run dev

# Start services individually
npm run dev:client    # Frontend only (port 3000)
npm run dev:server    # Backend only (port 3001)

# Install dependencies for all projects
npm run install:all
```

### Production Commands

```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### Code Quality Commands

```bash
# Run linting
cd client && npm run lint      # Frontend linting
cd server && npm run lint      # Backend linting

# Fix linting issues automatically
cd client && npm run lint:fix
cd server && npm run lint:fix

# Run tests (when implemented)
cd server && npm test
```

### Basic Usage Examples

1. **User Registration & Login**
   - Navigate to `/register` to create a new account
   - Use `/login` to authenticate with existing credentials
   - JWT tokens are automatically managed by the application

2. **Managing Expenses**
   - Add expenses through the Expenses page
   - Categorize expenses using predefined or custom categories
   - Attach receipts and add notes for detailed tracking

3. **Analytics & Reports**
   - View spending summaries on the Dashboard
   - Generate reports by date range and category
   - Export data for external analysis

## 🧪 Development

### Architecture Patterns

- **Frontend**: Component-based architecture with Context API for global state
- **Backend**: MVC pattern with Express.js controllers and models
- **Database**: SQLite for development, PostgreSQL-ready for production
- **Authentication**: JWT-based with secure password hashing

### Key Design Decisions

- **State Management**: React Context + useReducer for predictable state updates
- **API Communication**: Axios with interceptors for automatic token handling
- **Database Access**: Promise-based SQLite wrapper with prepared statements
- **Validation**: Server-side validation with Joi schemas
- **Security**: bcryptjs for password hashing, JWT for stateless authentication

### Contributing Guidelines

This project serves as a **learning platform** for documentation and testing practices. Contributions are welcome in these areas:

1. **API Documentation** - Create comprehensive OpenAPI/Swagger documentation
2. **Unit Testing** - Implement Jest tests for models and controllers
3. **Integration Testing** - Add API endpoint testing with Supertest
4. **E2E Testing** - Set up Cypress or Playwright for end-to-end testing
5. **Performance Testing** - Implement load testing and optimization

### Development Workflow

1. **Code Style**: Follow ESLint configurations
2. **Commit Messages**: Use conventional commit format
3. **Testing**: Write tests for new features (when testing is implemented)
4. **Documentation**: Update relevant documentation with changes

### Current Development Status

- ✅ **Phase 1**: Project Setup & Foundation - **COMPLETED**
- 🔄 **Phase 2**: Core Backend Features - **IN PROGRESS**
- ⏳ **Phase 3**: Frontend Core Features - **PENDING**
- ⏳ **Phase 4**: Data Visualization & Analytics - **PENDING**
- ⏳ **Phase 5**: Enhanced Features & Polish - **PLANNED**
- ⏳ **Phase 6**: Deployment & Production Setup - **PLANNED**

## 📚 API Reference

### Authentication Endpoints
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Expense Endpoints
```http
GET /api/expenses?page=1&limit=20&categoryId=1&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <jwt-token>
```

```http
POST /api/expenses
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "amount": 25.99,
  "description": "Coffee shop",
  "date": "2024-01-15",
  "categoryId": 1,
  "notes": "Morning coffee",
  "tags": ["coffee", "morning"]
}
```

### Database Schema
```sql
-- Users table
users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  user_id INTEGER,
  is_default BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
expenses (
  id INTEGER PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  receipt_filename TEXT,
  tags TEXT, -- JSON array
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=your-database-url-for-production

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_PATH=./uploads
```

### Vite Configuration (Frontend)
The frontend is configured with:
- **Proxy Setup** - API calls proxied to backend during development
- **Build Optimization** - Source maps and optimized bundles
- **Hot Module Replacement** - Fast development experience

### Database Configuration
- **Development**: SQLite database (`expense_tracker.db`)
- **Production**: PostgreSQL (configured via `DATABASE_URL`)
- **Migrations**: Knex.js migration system (planned)

## 🧪 Testing

### Testing Stack (Configured)
- **Backend**: Jest + Supertest for API testing
- **Frontend**: Testing to be added (React Testing Library recommended)

### Running Tests
```bash
# Backend tests (when implemented)
cd server && npm test

# Frontend tests (when implemented)
cd client && npm test

# Run all tests
npm run test:all  # (to be implemented)
```

## 📖 Additional Documentation

### Project Status
- **Current Phase**: Foundation complete, core features in development
- **Database Status**: Schema and seeding files need implementation
- **Testing Status**: Framework configured, test cases pending
- **Documentation**: Ready for comprehensive API documentation

### Known Issues
1. Database schema files (`schema.sql`, `seed.sql`) need implementation
2. Environment variable examples need creation
3. Test suite needs implementation
4. API documentation needs generation

### Troubleshooting

**Common Issues:**

- **Port conflicts**: Ensure ports 3000 and 3001 are available
- **Database errors**: SQLite database is created automatically on first run
- **Authentication issues**: Clear localStorage and re-login if experiencing token issues
- **Build failures**: Ensure all dependencies are installed with `npm run install:all`

**Debug Mode:**
```bash
# Enable debug logging
DEBUG=* npm run dev:server
```

### FAQ

**Q: How do I reset the database?**
A: Delete the `server/src/database/expense_tracker.db` file and restart the server.

**Q: Can I use a different database?**
A: Yes, the app is configured for PostgreSQL in production via environment variables.

**Q: How do I add new API endpoints?**
A: Add routes in `server/src/routes/`, create controllers in `server/src/controllers/`, and update models as needed.

### Roadmap & Future Enhancements

See [`Roadmap.md`](./Roadmap.md) for detailed development phases and planned features.

### Learning Opportunities

This project is ideal for learning:
- **Full-stack Development** - React + Express.js integration
- **Authentication Systems** - JWT implementation and security
- **Database Design** - Relational data modeling and queries
- **API Development** - RESTful API design and implementation
- **State Management** - React Context API and reducer patterns
- **Testing Strategies** - Unit, integration, and E2E testing
- **Documentation Practices** - Technical writing and API documentation

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for learning and practical financial management**