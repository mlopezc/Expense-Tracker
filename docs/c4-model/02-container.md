# C4 Model - Level 2: Container Diagram

**Proyecto:** ExpenseTracker
**Versión:** 1.0
**Fecha:** 2025-11-05
**Nivel:** Container (C4 Level 2)

---

## 1. Introducción

Este documento describe el **Diagrama de Contenedores** (C4 Level 2) del sistema ExpenseTracker. El diagrama de contenedores muestra los contenedores (aplicaciones, bases de datos, file systems) que componen el sistema y cómo se comunican entre sí.

### Propósito del Diagrama de Contenedores

El diagrama de contenedores:
- Muestra la **estructura de alto nivel** del sistema
- Identifica las **aplicaciones y servicios** principales
- Define las **tecnologías** usadas en cada contenedor
- Mapea los **protocolos de comunicación** entre contenedores
- Establece los **límites de deployment** de cada contenedor

### Diferencia con Context Diagram (Level 1)

- **Context (L1)**: Muestra el sistema como "caja negra" y sus interacciones externas
- **Container (L2)**: Abre la "caja negra" y muestra los contenedores internos

### Audiencia

- **Arquitectos de Software**: Diseño de deployment y escalamiento
- **Desarrolladores**: Entender componentes técnicos y dependencias
- **DevOps/SRE**: Planificación de infraestructura y deployment
- **Tech Leads**: Decisiones de tecnología y arquitectura

---

## 2. Diagrama de Contenedores (PlantUML)

```plantuml
@startuml C4_Container_ExpenseTracker
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

title Container Diagram for Expense Tracker System

Person(user, "Personal User", "Individual tracking personal expenses via web browser")

System_Boundary(c1, "Expense Tracker System") {
    Container(webApp, "Web Application", "React 18, JavaScript", "Delivers static content and single-page application to user's browser. Provides UI for expense management, data visualization, and reports.")

    Container(apiApp, "API Application", "Express.js, Node.js", "Provides REST API for expense management, authentication, and business logic. Handles all backend operations.")

    ContainerDb(database, "Database", "SQLite (dev) / PostgreSQL (prod)", "Stores user accounts, expense records, categories, and all transactional data.")

    Container(fileStore, "File Storage", "Local File System", "Stores receipt images and file attachments uploaded by users.")
}

' External systems
System_Ext(emailService, "Email Service", "Sends transactional emails (future)")
System_Ext(exportLib, "Export Library", "CSV/PDF generation (future)")

' User interactions
Rel(user, webApp, "Uses", "HTTPS (443)")
Rel_Down(user, webApp, "Views expenses, creates transactions, uploads receipts")

' Web App to API
Rel(webApp, apiApp, "Makes API calls to", "JSON/HTTPS (REST)")
Rel_Down(webApp, apiApp, "GET/POST/PUT/DELETE requests with JWT auth")

' API to Database
Rel(apiApp, database, "Reads from and writes to", "SQL Protocol")
Rel_Down(apiApp, database, "CRUD operations, queries, transactions")

' API to File Storage
Rel(apiApp, fileStore, "Stores and retrieves files", "File System I/O")
Rel_Down(apiApp, fileStore, "Save/load receipt images")

' Future integrations
Rel(apiApp, emailService, "Sends emails via", "SMTP/REST API", "Future")
Rel(apiApp, exportLib, "Generates reports using", "Library API", "Future")

' Notes
note right of webApp
  **Technology:**
  - React 18.2.0
  - Vite 5.0 (build tool)
  - Tailwind CSS 3.3.6
  - Axios (HTTP client)
  - Chart.js (visualization)

  **Port:** 3000 (dev)

  **Key Features:**
  - SPA with client-side routing
  - Context API state management
  - Responsive design
  - JWT token storage
end note

note right of apiApp
  **Technology:**
  - Express.js 4.18.2
  - Node.js 18+
  - JWT for authentication
  - Joi for validation
  - Multer for file uploads

  **Port:** 3001 (dev)

  **Endpoints:**
  - /api/auth/*
  - /api/expenses/*
  - /api/categories/*
  - /api/reports/*
end note

note right of database
  **Schema:**
  - users
  - expenses
  - categories

  **Indexes:**
  - user_id, date, category_id

  **Migration Path:**
  SQLite → PostgreSQL
end note

note right of fileStore
  **Location:**
  /server/uploads/

  **Structure:**
  receipts/{user_id}/

  **Future:**
  Migrate to S3/Cloudinary
end note

@enduml
```

![Diagrama de Contenedores](container.png)
---

## 3. Descripción de Contenedores

### 3.1 Web Application (Single Page Application)

**Tipo:** Frontend Container
**Tecnología Principal:** React 18.2.0 + Vite 5.0.0
**Estado:** ✅ Implementado

#### Descripción General

La Web Application es una Single Page Application (SPA) construida con React que proporciona la interfaz de usuario completa para ExpenseTracker. Se ejecuta completamente en el navegador del usuario y se comunica con el backend vía API REST.

#### Tecnologías Específicas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2.0 | Framework UI principal, component-based architecture |
| **Vite** | 5.0.0 | Build tool, dev server, HMR (Hot Module Replacement) |
| **Tailwind CSS** | 3.3.6 | Utility-first CSS framework para estilos |
| **React Router DOM** | 6.20.1 | Client-side routing entre páginas |
| **Axios** | 1.6.2 | HTTP client para llamadas API |
| **Chart.js** | 4.4.0 | Biblioteca de visualización de datos |
| **React-ChartJS-2** | 5.2.0 | React wrapper para Chart.js |
| **Heroicons React** | 2.0.18 | Iconos SVG |
| **date-fns** | 2.30.0 | Manipulación de fechas |

#### Responsabilidades

1. **Renderizado de UI**
   - Páginas: Login, Register, Dashboard, Expenses, Categories, Reports
   - Componentes reutilizables: Forms, Lists, Cards, Modals
   - Navegación y routing client-side

2. **Gestión de Estado Cliente**
   - AuthContext: Estado de autenticación (user, token, loading)
   - ExpenseContext: Estado de gastos y categorías
   - React Hooks (useState, useEffect, useReducer)

3. **Comunicación con API**
   - HTTP requests con Axios
   - Interceptores para inyectar JWT token
   - Manejo de errores y loading states

4. **Visualización de Datos**
   - Gráficos con Chart.js (pie charts, line charts, bar charts)
   - Tablas de gastos con filtros
   - Dashboard con métricas

5. **Validación de Formularios**
   - Validación client-side de inputs
   - Feedback visual de errores
   - Prevención de envíos inválidos

#### Estructura Interna

```
client/src/
├── components/          # UI components
│   ├── common/         # Layout, Navbar, Sidebar, LoadingSpinner
│   ├── forms/          # ExpenseForm, CategoryForm
│   ├── expenses/       # ExpenseList, ExpenseFilters
│   ├── categories/     # CategoryList
│   └── charts/         # Chart components (future)
├── pages/              # Route pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Expenses.jsx
│   ├── Categories.jsx
│   └── Reports.jsx
├── context/            # State management
│   ├── AuthContext.jsx
│   └── ExpenseContext.jsx
├── services/           # API communication
│   └── api.js
└── styles/            # Global styles
    └── index.css
```

#### Interfaces Expuestas

**URL Base (Development):**
```
http://localhost:3000
```

**URL Base (Production):**
```
https://expensetracker.com
```

**Rutas Públicas:**
- `/login` - Página de login
- `/register` - Página de registro

**Rutas Protegidas (requieren autenticación):**
- `/` - Dashboard principal
- `/expenses` - Lista y gestión de gastos
- `/categories` - Gestión de categorías
- `/reports` - Reportes y visualizaciones

#### Comunicación Externa

**Outbound Connections:**
- **API Application**: HTTP REST calls a `http://localhost:3001/api/*`
  - Método: GET, POST, PUT, DELETE
  - Formato: JSON
  - Autenticación: Bearer token en header `Authorization`

**Inbound Connections:**
- **User Browser**: HTTPS requests from navegador
  - Entrega de assets estáticos (HTML, JS, CSS)
  - Single page application load

#### Configuración de Desarrollo

**Vite Dev Server:**
```javascript
// vite.config.js
{
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
}
```

**Proxy Behavior:**
- Requests a `/api/*` son proxiados a backend
- Evita CORS issues en desarrollo
- Transparente para el código frontend

#### Build Output

**Development:**
- Servido por Vite dev server
- Hot Module Replacement activo
- Source maps completos

**Production:**
```
client/dist/
├── index.html           # Entry point
├── assets/
│   ├── index-[hash].js  # Main bundle (~150KB gzipped)
│   ├── vendor-[hash].js # Dependencies (~180KB gzipped)
│   └── index-[hash].css # Styles (~15KB gzipped)
└── vite.svg
```

**Total Bundle Size:** ~330KB (gzipped)

#### Performance Optimizations

- **Code Splitting:** React Router lazy loading (futuro)
- **Tree Shaking:** Vite elimina código no usado
- **CSS Purging:** Tailwind elimina clases no usadas
- **Asset Optimization:** Minificación y compresión

#### Security Considerations

- **XSS Protection:** React auto-escaping
- **CSRF:** No aplicable (API stateless con JWT)
- **Token Storage:** localStorage (consideration: move to httpOnly cookies)
- **Content Security Policy:** A implementar en producción
- **HTTPS Only:** Enforced en producción

---

### 3.2 API Application (Backend Service)

**Tipo:** Backend Container
**Tecnología Principal:** Express.js 4.18.2 + Node.js
**Estado:** ✅ Implementado

#### Descripción General

El API Application es el backend del sistema, construido con Express.js. Proporciona una API REST completa para gestión de gastos, autenticación de usuarios, y lógica de negocio. Es stateless y diseñado para escalamiento horizontal.

#### Tecnologías Específicas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Express.js** | 4.18.2 | Framework web Node.js |
| **Node.js** | 18+ | Runtime JavaScript |
| **jsonwebtoken** | 9.0.2 | Generación y verificación de JWT |
| **bcryptjs** | 2.4.3 | Hashing de contraseñas |
| **Joi** | 17.11.0 | Validación de esquemas |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **Morgan** | 1.10.0 | HTTP request logger |
| **Multer** | 1.4.5-lts.1 | File upload handling |
| **dotenv** | 16.3.1 | Environment variables |
| **SQLite3** | 5.1.6 | Database driver (dev) |
| **Nodemon** | 3.0.1 | Auto-restart en desarrollo |

#### Responsabilidades

1. **Autenticación y Autorización**
   - Registro de usuarios con validación
   - Login con generación de JWT
   - Verificación de tokens en cada request protegido
   - Password hashing con bcrypt (10 salt rounds)

2. **Gestión de Gastos**
   - CRUD completo de expenses
   - Filtrado por fecha, categoría, monto
   - Búsqueda y paginación
   - Adjuntar/eliminar recibos

3. **Gestión de Categorías**
   - CRUD de categorías personalizadas
   - Categorías predefinidas del sistema
   - Asociación de gastos con categorías

4. **Reportes y Analytics**
   - Agregación de gastos por período
   - Resumen por categoría
   - Estadísticas mensuales/anuales
   - Exportación de datos (CSV, JSON)

5. **Gestión de Archivos**
   - Upload de imágenes de recibos
   - Almacenamiento en file system
   - Servir archivos estáticos

6. **Validación de Datos**
   - Validación de inputs con Joi
   - Business rules enforcement
   - Data sanitization

#### Arquitectura Interna (MVC)

```
server/src/
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── categoryController.js
│   └── expenseController.js
├── models/               # Data access layer
│   ├── User.js
│   ├── Category.js
│   └── Expense.js
├── routes/               # Route definitions
│   ├── auth.js
│   ├── categories.js
│   ├── expenses.js
│   └── reports.js
├── middleware/           # Express middleware
│   └── auth.js          # JWT verification
├── utils/               # Utilities
│   └── auth.js          # Token generation
├── database/            # Database setup
│   ├── connection.js
│   ├── schema.sql
│   └── seeder.js
└── config/              # Configuration
    └── database.js
```

#### API Endpoints Expuestos

**Base URL (Development):**
```
http://localhost:3001/api
```

**Base URL (Production):**
```
https://api.expensetracker.com/api
```

##### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT token |
| POST | `/api/auth/logout` | Yes | Logout (client-side token removal) |
| GET | `/api/auth/me` | Yes | Get current user info |

**Example Request - Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Example Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Expense Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expenses` | Yes | Get all user expenses (with filters) |
| GET | `/api/expenses/:id` | Yes | Get single expense by ID |
| POST | `/api/expenses` | Yes | Create new expense |
| PUT | `/api/expenses/:id` | Yes | Update expense |
| DELETE | `/api/expenses/:id` | Yes | Delete expense |
| POST | `/api/expenses/:id/receipt` | Yes | Upload receipt image |

**Query Parameters for GET /api/expenses:**
- `category_id` - Filter by category
- `start_date` - Filter from date (YYYY-MM-DD)
- `end_date` - Filter to date (YYYY-MM-DD)
- `min_amount` - Minimum amount
- `max_amount` - Maximum amount
- `page` - Page number (pagination)
- `limit` - Items per page

**Example Request - Create Expense:**
```http
POST /api/expenses
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Lunch at restaurant",
  "category_id": 1,
  "date": "2024-11-05",
  "notes": "Business lunch"
}
```

**Example Response:**
```json
{
  "message": "Expense created successfully",
  "expense": {
    "id": 123,
    "amount": 50.00,
    "description": "Lunch at restaurant",
    "category_id": 1,
    "user_id": 1,
    "date": "2024-11-05",
    "notes": "Business lunch",
    "receipt_filename": null,
    "created_at": "2024-11-05T14:30:00Z",
    "updated_at": "2024-11-05T14:30:00Z"
  }
}
```

##### Category Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Yes | Get all categories (default + user's) |
| GET | `/api/categories/:id` | Yes | Get single category |
| POST | `/api/categories` | Yes | Create custom category |
| PUT | `/api/categories/:id` | Yes | Update category |
| DELETE | `/api/categories/:id` | Yes | Delete category |

##### Report Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reports/summary` | Yes | Get expense summary |
| GET | `/api/reports/categories` | Yes | Get spending by category |
| GET | `/api/reports/trends` | Yes | Get spending trends |
| GET | `/api/reports/export` | Yes | Export data (CSV/JSON) |

**Example Request - Summary:**
```http
GET /api/reports/summary?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Response:**
```json
{
  "period": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  },
  "summary": {
    "total_expenses": 5234.50,
    "expense_count": 187,
    "average_expense": 27.99,
    "highest_expense": 350.00,
    "most_expensive_category": "Food & Dining"
  },
  "by_category": [
    {
      "category": "Food & Dining",
      "total": 1850.00,
      "percentage": 35.3
    },
    ...
  ]
}
```

##### Health Check Endpoint

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check and API status |

**Response:**
```json
{
  "status": "OK",
  "message": "Expense Tracker API is running",
  "timestamp": "2024-11-05T14:30:00.000Z"
}
```

#### Authentication Flow

**JWT Token Structure:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1699564800,
  "exp": 1700169600
}
```

**Token Lifetime:** 7 days (168 hours)

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY5OTU2NDgwMCwiZXhwIjoxNzAwMTY5NjAwfQ.signature
```

#### Middleware Chain

**Request Processing Order:**
```
1. CORS middleware (cors)
2. Request logging (morgan)
3. Body parsing (express.json, express.urlencoded)
4. Route matching
5. Authentication middleware (authenticateToken) - for protected routes
6. Validation middleware (Joi) - in controllers
7. Controller handler
8. Error handling middleware (catch-all)
```

#### Error Handling

**Standard Error Response:**
```json
{
  "error": "Error message",
  "details": ["Validation error 1", "Validation error 2"]
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `500` - Internal Server Error

#### Environment Variables

```bash
# .env file
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-key-minimum-32-chars
JWT_EXPIRES_IN=7d
DATABASE_URL=sqlite://./src/database/expense_tracker.db
```

#### Logging

**Morgan Configuration:**
```javascript
app.use(morgan('combined'))
// Log format: :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
```

**Example Log:**
```
::1 - - [05/Nov/2024:14:30:00 +0000] "POST /api/expenses HTTP/1.1" 201 245 "http://localhost:3000/" "Mozilla/5.0..."
```

#### Performance Considerations

**Current Performance (SQLite):**
- Simple endpoint (health): ~5-10ms
- Database query (single expense): ~15-30ms
- Complex aggregation (reports): ~50-100ms

**Optimizations Implemented:**
- Database indexes on frequently queried columns
- Stateless design (horizontal scalability)
- Connection pooling ready (for PostgreSQL)

**Future Optimizations:**
- Redis caching for frequent queries
- Response compression (gzip)
- Rate limiting (express-rate-limit)
- Database query optimization

#### Security Features

**Implemented:**
- JWT authentication
- bcrypt password hashing (10 rounds)
- Input validation with Joi
- CORS configuration
- SQL injection prevention (parameterized queries)

**Pending (Production):**
- Helmet.js for security headers
- Rate limiting
- HTTPS enforcement
- CSP (Content Security Policy)

---

### 3.3 Database (Relational Database)

**Tipo:** Data Store Container
**Tecnología:** SQLite 5.1.6 (dev) / PostgreSQL 15+ (prod)
**Estado:** ✅ Implementado (SQLite), ⏳ Planned (PostgreSQL)

#### Descripción General

El Database container almacena todos los datos estructurados del sistema: usuarios, gastos, categorías, y metadata. Actualmente usa SQLite para desarrollo, con plan de migración a PostgreSQL para producción.

#### Esquema de Base de Datos

##### Tabla: users

Almacena información de cuentas de usuario.

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | ID único del usuario |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email (identificador de login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Password hasheado con bcrypt |
| `first_name` | VARCHAR(100) | NULL | Nombre del usuario |
| `last_name` | VARCHAR(100) | NULL | Apellido del usuario |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Última actualización |

**Índices:**
- PRIMARY KEY en `id`
- UNIQUE INDEX en `email`

**Ejemplo de Registro:**
```sql
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES ('john@example.com', '$2a$10$...', 'John', 'Doe');
```

##### Tabla: categories

Almacena categorías de gastos (predefinidas y personalizadas por usuario).

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | ID único de categoría |
| `name` | VARCHAR(100) | NOT NULL | Nombre de la categoría |
| `description` | TEXT | NULL | Descripción opcional |
| `color` | VARCHAR(7) | NULL | Color hex (ej: #FF5733) |
| `icon` | VARCHAR(50) | NULL | Nombre del icono |
| `user_id` | INTEGER | FOREIGN KEY, NULL | ID del usuario propietario (NULL = predefinida) |
| `is_default` | BOOLEAN | DEFAULT FALSE | TRUE si es categoría del sistema |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Última actualización |

**Relaciones:**
- `user_id` → `users.id` (CASCADE DELETE)

**Índices:**
- PRIMARY KEY en `id`
- INDEX en `user_id`

**Categorías Predefinidas:**
```sql
-- Food & Dining, Transportation, Shopping, Entertainment,
-- Bills & Utilities, Healthcare, Education, Travel, Other
```

##### Tabla: expenses

Almacena registros de gastos individuales.

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | ID único del gasto |
| `amount` | DECIMAL(10,2) | NOT NULL | Monto del gasto |
| `description` | TEXT | NOT NULL | Descripción del gasto |
| `date` | DATE | NOT NULL | Fecha del gasto |
| `category_id` | INTEGER | FOREIGN KEY, NOT NULL | ID de la categoría |
| `user_id` | INTEGER | FOREIGN KEY, NOT NULL | ID del usuario propietario |
| `receipt_filename` | VARCHAR(255) | NULL | Nombre del archivo de recibo |
| `tags` | TEXT | NULL | Tags JSON array |
| `notes` | TEXT | NULL | Notas adicionales |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Última actualización |

**Relaciones:**
- `category_id` → `categories.id`
- `user_id` → `users.id` (CASCADE DELETE)

**Índices:**
- PRIMARY KEY en `id`
- INDEX en `user_id` (queries frecuentes)
- INDEX en `date` (filtros por fecha)
- INDEX en `category_id` (joins y filtros)

**Ejemplo de Registro:**
```sql
INSERT INTO expenses (amount, description, date, category_id, user_id, notes)
VALUES (50.00, 'Lunch at restaurant', '2024-11-05', 1, 1, 'Business meeting');
```

#### Diagrama de Relaciones (ERD)

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │◀────────┐
│ email (UNIQUE)  │         │
│ password_hash   │         │
│ first_name      │         │
│ last_name       │         │
│ created_at      │         │
│ updated_at      │         │
└─────────────────┘         │
                            │ 1:N
       │                    │
       │ 1:N                │
       │                    │
       ▼                    │
┌─────────────────┐         │
│   categories    │         │
│─────────────────│         │
│ id (PK)         │◀────┐   │
│ name            │     │   │
│ description     │     │   │
│ color           │     │   │
│ icon            │     │   │
│ user_id (FK)    │─────┘   │
│ is_default      │         │
│ created_at      │         │
│ updated_at      │         │
└─────────────────┘         │
       │                    │
       │ N:1                │
       │                    │
       ▼                    │
┌─────────────────┐         │
│    expenses     │         │
│─────────────────│         │
│ id (PK)         │         │
│ amount          │         │
│ description     │         │
│ date            │         │
│ category_id (FK)│─────────┘
│ user_id (FK)    │─────────┘
│ receipt_filename│
│ tags            │
│ notes           │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

#### Queries Típicos

**Crear Gasto:**
```sql
INSERT INTO expenses (amount, description, date, category_id, user_id)
VALUES (50.00, 'Lunch', '2024-11-05', 1, 1)
RETURNING *;
```

**Obtener Gastos de Usuario (con filtros):**
```sql
SELECT e.*, c.name as category_name, c.color as category_color
FROM expenses e
INNER JOIN categories c ON e.category_id = c.id
WHERE e.user_id = ?
  AND e.date BETWEEN ? AND ?
  AND e.category_id = ?
ORDER BY e.date DESC
LIMIT 50 OFFSET 0;
```

**Resumen por Categoría:**
```sql
SELECT
  c.name,
  c.color,
  COUNT(e.id) as expense_count,
  SUM(e.amount) as total_amount,
  AVG(e.amount) as avg_amount
FROM expenses e
INNER JOIN categories c ON e.category_id = c.id
WHERE e.user_id = ?
  AND e.date BETWEEN ? AND ?
GROUP BY c.id, c.name, c.color
ORDER BY total_amount DESC;
```

**Gastos Mensuales (Tendencia):**
```sql
SELECT
  strftime('%Y-%m', date) as month,
  COUNT(*) as expense_count,
  SUM(amount) as total_amount
FROM expenses
WHERE user_id = ?
GROUP BY month
ORDER BY month DESC
LIMIT 12;
```

#### Protocolo de Comunicación

**SQLite (Development):**
- Conexión directa a archivo `.db`
- No networking, local file I/O
- Single-writer, multiple-readers

**PostgreSQL (Production):**
- Protocol: PostgreSQL wire protocol (TCP/IP)
- Port: 5432 (default)
- Connection pooling: 10-20 connections
- SSL/TLS encryption

#### Migration Strategy

**SQLite → PostgreSQL:**

**Diferencias de SQL:**
```sql
-- SQLite
id INTEGER PRIMARY KEY AUTOINCREMENT

-- PostgreSQL
id SERIAL PRIMARY KEY

-- SQLite
created_at DATETIME DEFAULT CURRENT_TIMESTAMP

-- PostgreSQL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Migration Steps:**
1. Export SQLite: `sqlite3 db.db .dump > backup.sql`
2. Convert SQL dialect: sed/awk transformations
3. Import to PostgreSQL: `psql < converted.sql`
4. Verify data integrity
5. Update connection string in .env

#### Backup Strategy

**Development (SQLite):**
- Copy `.db` file
- Frequency: Manual
- Storage: Local

**Production (PostgreSQL):**
- `pg_dump` automated backups
- Frequency: Daily (full), Hourly (incremental)
- Retention: 30 days
- Storage: AWS S3 / Cloud Storage

#### Performance Tuning

**Indexes Implemented:**
```sql
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

**Query Performance:**
- Simple SELECT: < 5ms
- JOIN with indexes: < 20ms
- Aggregation (summary): < 50ms

**SQLite Optimizations:**
```sql
PRAGMA journal_mode = WAL;        -- Write-Ahead Logging
PRAGMA cache_size = 10000;        -- 10MB cache
PRAGMA synchronous = NORMAL;      -- Balance safety/speed
```

---

### 3.4 File Storage (File System)

**Tipo:** Storage Container
**Tecnología:** Local File System
**Estado:** ✅ Implementado (Local), ⏳ Planned (Cloud)

#### Descripción General

El File Storage container almacena archivos binarios subidos por usuarios, principalmente imágenes de recibos asociados a gastos.

#### Tecnología Actual

**Implementación:** Local file system
**Ubicación:** `/server/uploads/`
**Middleware:** Multer 1.4.5-lts.1

#### Estructura de Directorios

```
server/uploads/
├── receipts/
│   ├── user_1/
│   │   ├── expense_123_1699564800123.jpg
│   │   ├── expense_124_1699568400456.png
│   │   └── expense_125_1699572000789.webp
│   ├── user_2/
│   │   └── expense_201_1699575600012.jpg
│   └── .gitkeep
└── temp/                   # Temporary uploads
    └── .gitkeep
```

**Naming Convention:**
```
expense_{expense_id}_{timestamp}.{ext}
```

#### Configuración de Multer

```javascript
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = `uploads/receipts/user_${req.user.id}`
    cb(null, userDir)
  },
  filename: (req, file, cb) => {
    const expenseId = req.params.id || 'temp'
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    cb(null, `expense_${expenseId}_${timestamp}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const mimetype = allowedTypes.test(file.mimetype)
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})
```

#### Operaciones Soportadas

**1. Upload de Recibo:**
```http
POST /api/expenses/:id/receipt
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- receipt: [File Binary]
```

**Response:**
```json
{
  "message": "Receipt uploaded successfully",
  "filename": "expense_123_1699564800123.jpg",
  "url": "/uploads/receipts/user_1/expense_123_1699564800123.jpg"
}
```

**2. Retrieve de Recibo:**
```http
GET /uploads/receipts/user_1/expense_123_1699564800123.jpg
```

**Response:** Image binary data

**3. Delete de Recibo:**
- Automático al eliminar expense
- Elimina archivo del file system

#### Características

**Formatos Soportados:**
- JPEG / JPG
- PNG
- WebP

**Límites:**
- Tamaño máximo: 5 MB por archivo
- Número de archivos: Sin límite (limitado por disk space)

**Validaciones:**
- MIME type checking
- File extension validation
- Size validation
- User authorization (solo owner puede subir)

#### Serving Static Files

```javascript
// server.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
```

**URL Pública:**
```
http://localhost:3001/uploads/receipts/user_1/expense_123.jpg
```

**Authorization:**
- Actualmente: Public access (cualquiera con URL puede ver)
- Futuro: Signed URLs o authorization check

#### Storage Metrics

**Uso Actual (Development):**
- Promedio por imagen: 500KB - 2MB
- Usuarios activos: 5-10
- Total storage: < 1GB

**Proyección (Production - 1000 users):**
- Promedio 50 receipts/user
- Total files: 50,000
- Total storage: ~50GB (estimado)

#### Migration Plan to Cloud Storage

**Target:** AWS S3 / Cloudinary / Google Cloud Storage

**Benefits:**
- Scalability infinita
- CDN integration
- Built-in backup/replication
- Cost-effective para almacenamiento grande
- Image transformations (thumbnails, compression)

**Implementation (AWS S3 Example):**
```javascript
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const uploadToS3 = (file, userId, expenseId) => {
  const params = {
    Bucket: 'expensetracker-receipts',
    Key: `user_${userId}/expense_${expenseId}_${Date.now()}.jpg`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private'
  }

  return s3.upload(params).promise()
}
```

**Signed URL for Secure Access:**
```javascript
const getSignedUrl = (key) => {
  return s3.getSignedUrl('getObject', {
    Bucket: 'expensetracker-receipts',
    Key: key,
    Expires: 3600  // 1 hour
  })
}
```

#### Security Considerations

**Current:**
- Files stored in server local disk
- No encryption at rest
- Public access via URL (security concern)

**Future Improvements:**
- Move to cloud storage with private access
- Signed URLs con expiración
- Encryption at rest
- Access control list (ACL)
- Virus scanning (ClamAV)

---

## 4. Comunicación entre Contenedores

### 4.1 Mapa de Comunicación

```
┌──────────────┐
│    User      │
│  (Browser)   │
└──────┬───────┘
       │
       │ HTTPS (443)
       │ HTML/CSS/JS
       ▼
┌──────────────────────┐
│   Web Application    │
│   (React SPA)        │
│   Port: 3000         │
└──────┬───────────────┘
       │
       │ REST API
       │ HTTPS/JSON
       │ JWT Auth
       ▼
┌──────────────────────┐
│  API Application     │
│  (Express.js)        │
│  Port: 3001          │
└──┬────────┬──────────┘
   │        │
   │        │ File I/O
   │        │ Read/Write
   │        ▼
   │   ┌────────────────┐
   │   │ File Storage   │
   │   │ (Local FS)     │
   │   └────────────────┘
   │
   │ SQL Protocol
   │ Queries/Transactions
   ▼
┌────────────────┐
│   Database     │
│ (SQLite/PG)    │
└────────────────┘
```

### 4.2 Tabla de Protocolos

| Origen | Destino | Protocolo | Puerto | Formato | Autenticación | Descripción |
|--------|---------|-----------|--------|---------|---------------|-------------|
| User Browser | Web App | HTTPS | 443 (prod) / 3000 (dev) | HTML/CSS/JS | None | Load SPA assets |
| Web App | API App | HTTPS | 3001 | JSON | JWT Bearer | REST API calls |
| API App | Database | SQL | N/A (SQLite) / 5432 (PG) | SQL | DB credentials | CRUD operations |
| API App | File Storage | File I/O | N/A | Binary | File system | Store/retrieve files |

### 4.3 Detalle de Comunicaciones

#### Web App ↔ API App

**Tecnología:** Axios HTTP Client

**Request Example:**
```javascript
// GET request
const response = await axios.get('/api/expenses', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  params: {
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  }
})

// POST request
const response = await axios.post('/api/expenses', {
  amount: 50.00,
  description: 'Lunch',
  category_id: 1,
  date: '2024-11-05'
}, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

**Response Format:**
```json
{
  "message": "Success",
  "data": { ... },
  "error": null
}
```

**Error Response:**
```json
{
  "error": "Validation failed",
  "details": ["Amount must be positive"],
  "status": 400
}
```

**Retry Logic:**
- Automatic retry on network errors (Axios interceptor)
- No retry on 4xx errors (client errors)
- Exponential backoff on 5xx errors

#### API App ↔ Database

**Tecnología:** Native SQLite3 driver / pg (PostgreSQL)

**Connection Example (SQLite):**
```javascript
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./src/database/expense_tracker.db')

// Parameterized query (SQL injection safe)
db.get('SELECT * FROM expenses WHERE id = ?', [expenseId], (err, row) => {
  if (err) throw err
  return row
})
```

**Connection Pooling (PostgreSQL - Future):**
```javascript
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,          // Maximum pool size
  min: 5,           // Minimum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId])
```

#### API App ↔ File Storage

**Write Operation:**
```javascript
const fs = require('fs').promises
const path = require('path')

const savePath = path.join(__dirname, 'uploads', 'receipts', `user_${userId}`)
await fs.mkdir(savePath, { recursive: true })
await fs.writeFile(path.join(savePath, filename), fileBuffer)
```

**Read Operation:**
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
```

**Delete Operation:**
```javascript
await fs.unlink(path.join(uploadDir, filename))
```

---

## 5. Tecnologías por Contenedor

### Tabla Resumen

| Contenedor | Tecnologías Principales | Lenguaje | Runtime | Framework | Versión |
|------------|------------------------|----------|---------|-----------|---------|
| **Web Application** | React, Vite, Tailwind | JavaScript | Browser (V8) | React 18 | 18.2.0 |
| **API Application** | Express.js, Node.js | JavaScript | Node.js | Express | 4.18.2 |
| **Database** | SQLite / PostgreSQL | SQL | Native | N/A | 5.1.6 / 15+ |
| **File Storage** | Local FS | N/A | OS File System | N/A | N/A |

### Dependencias Clave

#### Web Application
```json
{
  "react": "^18.2.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.3.6",
  "axios": "^1.6.2",
  "chart.js": "^4.4.0",
  "react-router-dom": "^6.20.1"
}
```

#### API Application
```json
{
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "joi": "^17.11.0",
  "sqlite3": "^5.1.6",
  "multer": "^1.4.5-lts.1"
}
```

---

## 6. Consideraciones de Deployment

### 6.1 Deployment Options

#### Opción 1: Monolith (Single Server)

**Arquitectura:**
```
┌─────────────────────────────────┐
│     Single Server / Container   │
├─────────────────────────────────┤
│  Nginx (Reverse Proxy)          │
│    ├─ Serve Static (React)      │
│    └─ Proxy /api → Express      │
├─────────────────────────────────┤
│  Express API (Node.js)          │
├─────────────────────────────────┤
│  PostgreSQL (or external)       │
├─────────────────────────────────┤
│  File Storage (volume mount)    │
└─────────────────────────────────┘
```

**Pros:**
- Simple deployment
- Single server management
- Lower cost

**Cons:**
- No independent scaling
- Single point of failure

**Suitable for:** MVP, low traffic (<1000 users)

---

#### Opción 2: Separated (Microservices-lite)

**Arquitectura:**
```
┌────────────────┐     ┌────────────────┐
│   Frontend     │     │    Backend     │
│   (Vercel)     │────▶│   (Railway)    │
│   React SPA    │     │   Express API  │
└────────────────┘     └────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │PostgreSQL│  │  AWS S3  │  │ SendGrid │
        │  (RDS)   │  │(Receipts)│  │ (Email)  │
        └──────────┘  └──────────┘  └──────────┘
```

**Pros:**
- Independent scaling
- CDN for frontend
- Specialized hosting

**Cons:**
- More complex
- Higher cost
- CORS configuration needed

**Suitable for:** Production, high traffic (10k+ users)

---

### 6.2 Platform-Specific Deployment

#### Heroku

**Frontend:**
```yaml
# Not ideal for Heroku (prefer Vercel)
# But possible with static buildpack
```

**Backend:**
```yaml
# Procfile
web: cd server && npm start
```

**Database:**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

---

#### Railway

**Frontend:**
```yaml
# railway.json (frontend)
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd client && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npx serve -s client/dist -l $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Backend:**
```yaml
# railway.json (backend)
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd server && npm install"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "healthcheckPath": "/api/health"
  }
}
```

---

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/expensetracker
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=expensetracker
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

### 6.3 Environment Variables por Contenedor

#### Web Application

```bash
# Build-time variables (embedded in bundle)
VITE_API_URL=https://api.expensetracker.com
VITE_ENVIRONMENT=production
```

#### API Application

```bash
# Runtime variables
NODE_ENV=production
PORT=3001
JWT_SECRET=your-production-secret-minimum-64-chars
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://user:pass@host:5432/expensetracker
CORS_ORIGIN=https://expensetracker.com
```

#### Database

```bash
# PostgreSQL
POSTGRES_DB=expensetracker
POSTGRES_USER=expense_user
POSTGRES_PASSWORD=secure_password
```

---

### 6.4 Health Checks

#### API Application

**Endpoint:** `/api/health`

**Response:**
```json
{
  "status": "OK",
  "message": "Expense Tracker API is running",
  "timestamp": "2024-11-05T14:30:00.000Z",
  "database": "connected",
  "uptime": 3600
}
```

**Check Script:**
```bash
#!/bin/bash
response=$(curl -s http://localhost:3001/api/health)
status=$(echo $response | jq -r '.status')

if [ "$status" = "OK" ]; then
  exit 0
else
  exit 1
fi
```

#### Database

**Check:**
```sql
SELECT 1;
```

**Expected:** Returns `1`

---

### 6.5 Scaling Considerations

#### Horizontal Scaling

**Web Application:**
- ✅ Stateless, can scale infinitely
- Deploy to CDN (Cloudflare, CloudFront)
- Multiple edge locations

**API Application:**
- ✅ Stateless (JWT), can scale horizontally
- Load balancer required (ALB, Nginx)
- Session affinity not needed

**Database:**
- ⚠️ Vertical scaling initially
- Read replicas for read-heavy workload
- Connection pooling (PgBouncer)

**File Storage:**
- ⚠️ Migrate to cloud (S3, Cloudinary) for horizontal scaling
- Current local FS doesn't scale

#### Load Balancing

```
        ┌──────────────┐
        │Load Balancer │
        └──────┬───────┘
               │
       ┌───────┼───────┐
       │       │       │
       ▼       ▼       ▼
   ┌────┐  ┌────┐  ┌────┐
   │API1│  │API2│  │API3│
   └──┬─┘  └──┬─┘  └──┬─┘
      └───────┼───────┘
              │
              ▼
        ┌──────────┐
        │PostgreSQL│
        └──────────┘
```

---

## 7. Referencias

### 7.1 Documentación Relacionada

- [C4 Context Diagram (Level 1)](/docs/c4-model/01-context.md)
- [Tech Stack Overview](/docs/tech-stack-overview.md)
- [ADR-001: React Framework](/docs/adr/ADR-001-react-framework.md)
- [ADR-002: Vite Build Tool](/docs/adr/ADR-002-vite-build-tool.md)
- [ADR-009: Express Backend](/docs/adr/ADR-009-express-backend-framework.md)
- [ADR-005: Database Strategy](/docs/adr/ADR-005-dual-database-strategy.md)

### 7.2 Herramientas de Visualización

**Renderizar Diagrama:**
1. [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)
2. VSCode: Extension "PlantUML" by jebbs
3. CLI: `plantuml 02-container.md`

---

## 8. Changelog

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | 2025-11-05 | Creación inicial del diagrama de contenedores | Sistema de análisis |
| | | - 4 contenedores documentados | |
| | | - Protocolos de comunicación | |
| | | - Deployment considerations | |

---

## 9. Próximos Pasos

**Nivel 3: Component Diagram**

El siguiente nivel de detalle (C4 Level 3) documentará:
- Componentes internos de cada contenedor
- Clases y módulos principales
- Patrones de diseño aplicados
- Diagramas de secuencia detallados

Ubicación: `/docs/c4-model/03-component.md` (pendiente)

---

**Última actualización:** 2025-11-05
**Estado:** ✅ Aprobado para implementación
**Próxima revisión:** Post-deployment a producción
