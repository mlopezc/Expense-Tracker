# Tech Stack Overview - ExpenseTracker

**Versión del Documento:** 1.0
**Fecha de Generación:** 2025-11-05
**Tipo de Proyecto:** Full-Stack Web Application
**Arquitectura:** Client-Server (SPA + REST API)

---

## Resumen Ejecutivo

ExpenseTracker es una aplicación web full-stack para el seguimiento de gastos personales, construida siguiendo una arquitectura moderna de separación cliente-servidor. El proyecto adopta el patrón MERN Stack modificado (MongoDB reemplazado por SQLite/PostgreSQL), utilizando React 18+ para el frontend y Node.js con Express para el backend.

**Características Destacadas del Stack:**
- **Frontend Moderno:** React 18 con hooks y Context API para gestión de estado
- **Build Tool de Nueva Generación:** Vite para desarrollo y construcción optimizada
- **Estilos Utility-First:** Tailwind CSS para desarrollo rápido y consistente
- **Backend Escalable:** Express.js con arquitectura MVC
- **Base de Datos Flexible:** SQLite para desarrollo, preparado para PostgreSQL en producción
- **Autenticación Segura:** JWT con bcrypt para hash de contraseñas
- **Desarrollo Concurrente:** Monorepo con scripts para ejecutar cliente y servidor simultáneamente

---

## 1. Tabla de Tecnologías por Categoría

### 1.1 Frontend

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| **Core Framework** | React | ^18.2.0 | Framework UI principal con arquitectura basada en componentes |
| | React DOM | ^18.2.0 | Renderizado DOM para aplicaciones web |
| **Routing** | React Router DOM | ^6.20.1 | Navegación y enrutamiento del lado del cliente |
| **Build Tool** | Vite | ^5.0.0 | Build tool y dev server de alta velocidad |
| | @vitejs/plugin-react | ^4.1.1 | Plugin de React para Vite con Fast Refresh |
| **Estilos** | Tailwind CSS | ^3.3.6 | Framework CSS utility-first |
| | PostCSS | ^8.4.32 | Procesamiento y transformación de CSS |
| | Autoprefixer | ^10.4.16 | Prefijos CSS automáticos para compatibilidad de navegadores |
| **HTTP Client** | Axios | ^1.6.2 | Cliente HTTP para comunicación con API REST |
| **Visualización** | Chart.js | ^4.4.0 | Biblioteca de gráficos para visualización de datos |
| | React-ChartJS-2 | ^5.2.0 | Wrapper React para Chart.js |
| **Iconos** | Heroicons React | ^2.0.18 | Biblioteca de iconos SVG |
| **Utilidades** | date-fns | ^2.30.0 | Biblioteca moderna para manipulación de fechas |
| **Code Quality** | ESLint | ^8.53.0 | Linter de código JavaScript/React |
| | eslint-plugin-react | ^7.33.2 | Reglas específicas de React |
| | eslint-plugin-react-hooks | ^4.6.0 | Reglas para React Hooks |
| | eslint-plugin-react-refresh | ^0.4.4 | Plugin para Fast Refresh |
| **Type Safety** | @types/react | ^18.2.37 | Definiciones TypeScript para React |
| | @types/react-dom | ^18.2.15 | Definiciones TypeScript para React DOM |

### 1.2 Backend

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| **Runtime** | Node.js | - | Entorno de ejecución JavaScript del lado del servidor |
| **Framework** | Express.js | ^4.18.2 | Framework web minimalista y flexible |
| **Base de Datos** | SQLite3 | ^5.1.6 | Base de datos embebida para desarrollo |
| | Knex.js | ^3.0.1 | Query builder SQL y gestor de migraciones |
| **Autenticación** | jsonwebtoken | ^9.0.2 | Generación y verificación de tokens JWT |
| | bcryptjs | ^2.4.3 | Hashing seguro de contraseñas |
| **Validación** | Joi | ^17.11.0 | Validación de esquemas de datos |
| **Middleware** | CORS | ^2.8.5 | Control de Cross-Origin Resource Sharing |
| | Morgan | ^1.10.0 | Logger de peticiones HTTP |
| **File Upload** | Multer | ^1.4.5-lts.1 | Middleware para manejo de multipart/form-data |
| **Configuración** | dotenv | ^16.3.1 | Carga de variables de entorno desde .env |
| **Development** | Nodemon | ^3.0.1 | Auto-restart del servidor en cambios |
| **Testing** | Jest | ^29.7.0 | Framework de testing |
| | Supertest | ^6.3.3 | Testing de endpoints HTTP |
| **Code Quality** | ESLint | ^8.54.0 | Linter de código JavaScript |

### 1.3 DevOps y Tooling

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| **Control de Versiones** | Git | - | Sistema de control de versiones |
| **Package Manager** | npm | - | Gestor de paquetes y dependencias |
| **Monorepo** | Concurrently | ^8.2.2 | Ejecución paralela de scripts (cliente/servidor) |
| **Code Formatting** | Prettier | - | Formateador de código consistente |
| **AI Assistant** | Claude Code | - | Asistente de desarrollo integrado |

### 1.4 Base de Datos

| Categoría | Tecnología | Versión | Entorno | Propósito |
|-----------|-----------|---------|---------|-----------|
| **Desarrollo** | SQLite | ^5.1.6 | Development | Base de datos relacional embebida sin servidor |
| **Producción** | PostgreSQL | TBD | Production | Base de datos relacional escalable (planificado) |
| **ORM/Query Builder** | Knex.js | ^3.0.1 | Both | Constructor de queries SQL y migraciones |

---

## 2. Justificación Técnica de las Elecciones

### 2.1 Frontend

#### **React 18.2.0**
- **Elección:** Framework UI líder de la industria con amplia adopción
- **Justificación:**
  - Ecosistema maduro con abundantes recursos y bibliotecas
  - Performance optimizado con Concurrent Features
  - Hooks API para lógica reutilizable sin clases
  - Context API integrada para gestión de estado simple
- **Evidencia en el código:** `/client/src/App.jsx:1-48` - Uso de componentes funcionales, hooks y Context Providers

#### **Vite 5.0.0**
- **Elección:** Build tool de siguiente generación
- **Justificación:**
  - Hot Module Replacement (HMR) extremadamente rápido
  - Build optimizado con Rollup
  - Configuración mínima lista para producción
  - Mejor experiencia de desarrollo que webpack
- **Evidencia en el código:** `/client/vite.config.js:1-28` - Configuración con proxy API y optimizaciones de build
- **Ventaja sobre Create React App:** Tiempo de inicio de servidor ~10x más rápido

#### **Tailwind CSS 3.3.6**
- **Elección:** Framework CSS utility-first
- **Justificación:**
  - Desarrollo rápido con clases de utilidad
  - Consistencia de diseño sin CSS personalizado
  - Tree-shaking automático en producción (CSS no usado eliminado)
  - Responsive design simplificado
  - Mantenimiento reducido comparado con CSS tradicional
- **Evidencia en el código:** Configuración en `/client/tailwind.config.js` y uso extensivo en componentes

#### **React Router DOM 6.20.1**
- **Elección:** Biblioteca de routing estándar para React
- **Justificación:**
  - Routing declarativo con componentes
  - Nested routes para layouts compartidos
  - Protected routes para control de acceso
  - URL params y query strings integrados
- **Evidencia en el código:** `/client/src/App.jsx:17-42` - Estructura de rutas anidadas con protección de autenticación

#### **Axios 1.6.2**
- **Elección:** Cliente HTTP sobre fetch nativo
- **Justificación:**
  - Interceptores para manejo centralizado de autenticación
  - Cancelación de requests automática
  - Transformación de datos request/response
  - Mejor manejo de errores que fetch
  - Compatibilidad con navegadores antiguos
- **Evidencia en el código:** `/client/src/services/api.js` - Configuración de interceptores para tokens JWT

#### **Chart.js 4.4.0 + React-ChartJS-2 5.2.0**
- **Elección:** Biblioteca de visualización de datos
- **Justificación:**
  - Gráficos interactivos y responsivos
  - Amplia variedad de tipos de gráficos
  - Altamente personalizable
  - Rendimiento optimizado para datasets grandes
  - Wrapper React con hooks integrados
- **Uso previsto:** Dashboard de análisis de gastos y reportes

### 2.2 Backend

#### **Express.js 4.18.2**
- **Elección:** Framework web minimalista
- **Justificación:**
  - Flexibilidad total sin opiniones fuertes
  - Middleware ecosystem extenso
  - Performance excelente para APIs REST
  - Fácil integración con cualquier base de datos
  - Estándar de la industria para Node.js APIs
- **Evidencia en el código:** `/server/server.js:1-65` - Configuración modular con middleware y rutas separadas

#### **SQLite3 5.1.6 (Desarrollo) / PostgreSQL (Producción)**
- **Elección:** Base de datos dual-mode
- **Justificación SQLite (Dev):**
  - Cero configuración - archivo local
  - Portabilidad total del proyecto
  - Perfecto para desarrollo y testing
  - Transacciones ACID completas
- **Justificación PostgreSQL (Prod):**
  - Escalabilidad horizontal y vertical
  - Características avanzadas (JSON, full-text search)
  - Concurrencia robusta
  - Soporte empresarial
- **Evidencia en el código:** `/server/src/database/schema.sql:1-47` - SQL estándar compatible con ambos motores

#### **Knex.js 3.0.1**
- **Elección:** Query builder y migración manager
- **Justificación:**
  - Queries SQL tipadas y seguras (prevención SQL injection)
  - Migraciones versionadas de esquema
  - Soporte multi-base de datos (SQLite, PostgreSQL, MySQL)
  - API chainable fluida
- **Ventaja sobre ORM:** Menor overhead, queries SQL transparentes y optimizables

#### **JWT (jsonwebtoken 9.0.2)**
- **Elección:** Autenticación stateless basada en tokens
- **Justificación:**
  - Stateless - no requiere almacenamiento en servidor
  - Escalable horizontalmente
  - Cross-domain authentication
  - Información de usuario embebida en token
  - Expiración automática configurable
- **Evidencia en el código:**
  - `/server/src/middleware/auth.js:1-51` - Verificación de tokens
  - `/server/src/utils/auth.js` - Generación de tokens
  - Token expiration: 7 días (168h)

#### **bcryptjs 2.4.3**
- **Elección:** Hashing de contraseñas
- **Justificación:**
  - Algoritmo probado y seguro
  - Salt automático generado
  - Resistance a rainbow table attacks
  - Trabajo computacional ajustable (salt rounds: 10)
  - Versión JavaScript pura (sin dependencias nativas)
- **Evidencia en el código:** `/server/src/models/User.js:18-20` - Hash con 10 salt rounds

#### **Joi 17.11.0**
- **Elección:** Validación de esquemas
- **Justificación:**
  - Validación declarativa de datos de entrada
  - Mensajes de error descriptivos
  - Prevención de ataques de inyección
  - Validación de tipos complejos (email, URL, fecha)
- **Uso:** Validación de request bodies en controladores

#### **Multer 1.4.5-lts.1**
- **Elección:** File upload middleware
- **Justificación:**
  - Manejo seguro de multipart/form-data
  - Validación de tipo de archivo
  - Límite de tamaño de archivo
  - Almacenamiento en disco o memoria
- **Uso previsto:** Upload de recibos de gastos

### 2.3 DevOps y Tooling

#### **Concurrently 8.2.2**
- **Elección:** Ejecución paralela de procesos
- **Justificación:**
  - Desarrollo simultáneo de cliente y servidor
  - Logs consolidados de ambos procesos
  - Shutdown coordinado de procesos
- **Evidencia en el código:** `/package.json:7` - Script `dev` ejecuta servidor y cliente en paralelo

#### **Nodemon 3.0.1**
- **Elección:** Auto-restart durante desarrollo
- **Justificación:**
  - Recompilación automática en cambios
  - Detección de crashes y auto-reinicio
  - Configuración de archivos watched
- **Mejora productividad:** Elimina ciclos manuales de restart

#### **ESLint 8.x**
- **Elección:** Linter JavaScript estándar
- **Justificación:**
  - Detección temprana de errores
  - Consistencia de código en equipo
  - Reglas configurables por proyecto
  - Integración con IDEs
- **Evidencia en el código:** Configuración en `.eslintrc.js` (server) y `.eslintrc.cjs` (client)

#### **Prettier**
- **Elección:** Code formatter
- **Justificación:**
  - Formato de código automático y consistente
  - Elimina debates de estilo en equipo
  - Integración con VSCode y otros IDEs
- **Evidencia en el código:** `.prettierrc` en raíz del proyecto

---

## 3. Patrones de Diseño y Arquitectura

### 3.1 Arquitectura General

#### **Monorepo con Client-Server Separation**
```
ExpenseTracker/
├── client/          # Frontend React SPA
├── server/          # Backend Express API
└── package.json     # Root scripts orchestration
```

**Beneficios:**
- Separación clara de responsabilidades
- Despliegue independiente de frontend/backend
- Repositorio único para control de versiones
- Scripts compartidos de desarrollo

---

### 3.2 Patrones de Frontend

#### **3.2.1 Component-Based Architecture**
- **Patrón:** Arquitectura basada en componentes React
- **Estructura de carpetas:**
  ```
  src/components/
  ├── common/       # Componentes reutilizables (Layout, Navbar, Sidebar)
  ├── forms/        # Formularios especializados
  ├── expenses/     # Componentes específicos de gastos
  └── categories/   # Componentes específicos de categorías
  ```
- **Evidencia:** `/client/src/components/` - 16 componentes modulares

#### **3.2.2 Context API + useReducer (State Management)**
- **Patrón:** Flux-like state management sin Redux
- **Implementación:**
  - `AuthContext`: Estado global de autenticación
  - `ExpenseContext`: Estado global de gastos
- **Ventajas:**
  - Sin biblioteca externa (reduce bundle size)
  - Actions tipadas con reducers
  - Estado predecible con switch statements
- **Evidencia en el código:**
  ```javascript
  // /client/src/context/AuthContext.jsx:13-35
  function authReducer(state, action) {
    switch (action.type) {
      case 'AUTH_START':
      case 'AUTH_SUCCESS':
      case 'AUTH_ERROR':
      case 'LOGOUT':
      // ...
    }
  }
  ```

#### **3.2.3 Protected Routes Pattern**
- **Patrón:** HOC (Higher-Order Component) para protección de rutas
- **Implementación:** `ProtectedRoute` wrapper que verifica autenticación
- **Flujo:**
  1. Verifica token en localStorage
  2. Valida token con API
  3. Redirige a login si no autenticado
- **Evidencia:** `/client/src/components/common/ProtectedRoute.jsx`

#### **3.2.4 Custom Hooks Pattern**
- **Patrón:** Hooks personalizados para lógica reutilizable
- **Implementación actual:**
  - `useAuth()`: Hook para acceder a contexto de autenticación
- **Evidencia en el código:**
  ```javascript
  // /client/src/context/AuthContext.jsx:131-136
  export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
  }
  ```

#### **3.2.5 API Service Layer**
- **Patrón:** Capa de abstracción para llamadas HTTP
- **Implementación:** Instancia centralizada de Axios con interceptores
- **Características:**
  - Base URL configurada
  - Interceptores de request (inyección de token)
  - Interceptores de response (manejo de errores centralizado)
- **Evidencia:** `/client/src/services/api.js`

---

### 3.3 Patrones de Backend

#### **3.3.1 MVC Architecture (Model-View-Controller)**
- **Patrón:** Separación de capas lógicas
- **Estructura:**
  ```
  server/src/
  ├── models/       # Capa de datos (Model)
  ├── controllers/  # Lógica de negocio (Controller)
  ├── routes/       # Definición de endpoints (Router)
  └── middleware/   # Middleware chain
  ```
- **Justificación:**
  - Separación de responsabilidades
  - Testabilidad mejorada
  - Reutilización de código
  - Mantenibilidad a largo plazo

#### **3.3.2 Active Record Pattern (Models)**
- **Patrón:** Modelos con métodos estáticos y de instancia
- **Implementación:**
  ```javascript
  class User {
    static async create(userData) { }
    static async findById(id) { }
    static async findByEmail(email) { }
    async update(updateData) { }
    async delete() { }
    async validatePassword(password) { }
  }
  ```
- **Evidencia:** `/server/src/models/User.js:4-93`
- **Ventajas:**
  - Encapsulación de lógica de base de datos
  - API fluida y orientada a objetos
  - Validación en modelo

#### **3.3.3 Middleware Chain Pattern**
- **Patrón:** Procesamiento secuencial de requests
- **Implementación:**
  ```javascript
  // /server/server.js:12-19
  app.use(cors())
  app.use(morgan('combined'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
  ```
- **Orden de ejecución:**
  1. CORS handling
  2. Request logging
  3. Body parsing
  4. Static files
  5. Route handlers
  6. Error handling

#### **3.3.4 Authentication Middleware**
- **Patrón:** Middleware de autenticación reutilizable
- **Implementación:**
  - `authenticateToken`: Requiere token válido
  - `optionalAuth`: Token opcional
- **Flujo:**
  ```
  Request → Extract Token → Verify JWT → Load User → Attach to req.user → Next
  ```
- **Evidencia:** `/server/src/middleware/auth.js:4-26`

#### **3.3.5 Repository Pattern (Implicit)**
- **Patrón:** Modelos actúan como repositorios de datos
- **Métodos CRUD estándar:**
  - `create()` - INSERT
  - `findById()` / `findByEmail()` - SELECT
  - `update()` - UPDATE
  - `delete()` - DELETE
- **Abstracción:** Oculta detalles de SQLite, permite migrar a PostgreSQL sin cambios en controladores

#### **3.3.6 Error Handling Middleware**
- **Patrón:** Manejo centralizado de errores
- **Implementación:**
  ```javascript
  // /server/server.js:36-43
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
      error: 'Something went wrong!',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    })
  })
  ```
- **Características:**
  - Logging de stack trace
  - Respuesta diferenciada por entorno (dev vs prod)
  - Catch-all para errores no manejados

---

### 3.4 Patrones de Seguridad

#### **3.4.1 Password Hashing**
- **Algoritmo:** bcrypt con 10 salt rounds
- **Implementación:** `/server/src/models/User.js:19-20`
- **Prevención:** Rainbow table attacks, brute force

#### **3.4.2 JWT Stateless Authentication**
- **Token structure:**
  ```javascript
  {
    userId: <user_id>,
    email: <email>,
    iat: <issued_at>,
    exp: <expiration>
  }
  ```
- **Expiración:** 7 días (168 horas)
- **Storage:** localStorage en cliente

#### **3.4.3 Input Validation**
- **Biblioteca:** Joi
- **Validación en:** Controllers antes de procesamiento
- **Prevención:** SQL injection, XSS, type coercion attacks

#### **3.4.4 CORS Configuration**
- **Middleware:** cors package
- **Configuración:** Permite cross-origin requests de frontend
- **Evidencia:** `/server/server.js:13`

---

### 3.5 Patrones de Base de Datos

#### **3.5.1 Database Schema Design**
- **Tablas:**
  1. **users** - Información de usuarios
  2. **categories** - Categorías de gastos (predefinidas y personalizadas)
  3. **expenses** - Registro de transacciones
- **Relaciones:**
  - `expenses.user_id → users.id` (CASCADE DELETE)
  - `expenses.category_id → categories.id`
  - `categories.user_id → users.id` (CASCADE DELETE)
- **Evidencia:** `/server/src/database/schema.sql:1-47`

#### **3.5.2 Indexes for Performance**
```sql
CREATE INDEX idx_expenses_user_id ON expenses (user_id);
CREATE INDEX idx_expenses_date ON expenses (date);
CREATE INDEX idx_expenses_category_id ON expenses (category_id);
CREATE INDEX idx_categories_user_id ON categories (user_id);
```
- **Justificación:**
  - Búsqueda rápida de gastos por usuario
  - Filtrado por rango de fechas optimizado
  - Joins eficientes con categorías

#### **3.5.3 Soft Delete vs Hard Delete**
- **Implementación actual:** Hard delete con CASCADE
- **Consideración futura:** Soft delete para auditoría

---

## 4. Diagrama de Dependencias Principales

### 4.1 Flujo de Datos de Autenticación

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌─────────────────┐   ┌────────────────┐ │
│  │  Login Page  │───▶│  AuthContext    │◀──│  useAuth Hook  │ │
│  └──────────────┘    │  (useReducer)   │   └────────────────┘ │
│         │             └────────┬────────┘            ▲         │
│         │                      │                     │         │
│         ▼                      ▼                     │         │
│  ┌──────────────────────────────────────────────────┴──────┐  │
│  │              Axios API Service                          │  │
│  │  - baseURL: http://localhost:3001/api                   │  │
│  │  - Request Interceptor: Inject JWT token                │  │
│  │  - Response Interceptor: Handle 401 errors              │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                     HTTP POST /api/auth/login
                     Authorization: Bearer <token>
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                      SERVER (Express)                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────┐      ┌──────────────────┐                │
│  │  Auth Routes   │─────▶│ Auth Controller  │                │
│  │  /api/auth/*   │      └────────┬─────────┘                │
│  └────────────────┘               │                           │
│                                   ▼                           │
│                          ┌─────────────────┐                  │
│                          │  User Model     │                  │
│                          │  - findByEmail  │                  │
│                          │  - create       │                  │
│                          │  - validate pwd │                  │
│                          └────────┬────────┘                  │
│                                   │                           │
│                                   ▼                           │
│                          ┌─────────────────┐                  │
│                          │  Auth Utils     │                  │
│                          │  - generateToken│                  │
│                          │  - verifyToken  │                  │
│                          └────────┬────────┘                  │
│                                   │                           │
│                                   ▼                           │
│                          ┌─────────────────┐                  │
│                          │   bcryptjs      │                  │
│                          │ + jsonwebtoken  │                  │
│                          └────────┬────────┘                  │
│                                   │                           │
└───────────────────────────────────┼───────────────────────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │  SQLite Database │
                          │  expense_tracker │
                          │    .db           │
                          └──────────────────┘
```

---

### 4.2 Flujo de Datos de Expenses

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐    ┌──────────────────┐   ┌──────────────┐ │
│  │  Expenses Page │───▶│ ExpenseContext   │◀──│ ExpenseList  │ │
│  └────────────────┘    │  (useReducer)    │   │ ExpenseForm  │ │
│                        └────────┬─────────┘   └──────────────┘ │
│                                 │                               │
│                                 ▼                               │
│                        ┌──────────────────┐                     │
│                        │  Axios API       │                     │
│                        │  GET /expenses   │                     │
│                        │  POST /expenses  │                     │
│                        └────────┬─────────┘                     │
│                                 │                               │
└─────────────────────────────────┼───────────────────────────────┘
                                  │
                       HTTP Requests (JWT Auth)
                                  │
┌─────────────────────────────────▼───────────────────────────────┐
│                       SERVER (Express)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐    ┌──────────────────┐                   │
│  │ Expense Routes │───▶│ authenticateToken│                   │
│  │ /api/expenses  │    │   Middleware     │                   │
│  └────────────────┘    └────────┬─────────┘                   │
│                                 │                              │
│                                 ▼                              │
│                        ┌──────────────────┐                    │
│                        │ Expense          │                    │
│                        │  Controller      │                    │
│                        └────────┬─────────┘                    │
│                                 │                              │
│                                 ▼                              │
│                        ┌──────────────────┐                    │
│                        │  Joi Validation  │                    │
│                        └────────┬─────────┘                    │
│                                 │                              │
│                                 ▼                              │
│                        ┌──────────────────┐                    │
│                        │  Expense Model   │                    │
│                        │  - create        │                    │
│                        │  - findByUser    │                    │
│                        │  - update/delete │                    │
│                        └────────┬─────────┘                    │
│                                 │                              │
└─────────────────────────────────┼──────────────────────────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │  SQLite Database │
                        │    expenses      │
                        │    categories    │
                        └──────────────────┘
```

---

### 4.3 Árbol de Dependencias npm

#### **Frontend (Client)**
```
expense-tracker-client@1.0.0
├─┬ react@18.2.0
│ └── react-dom@18.2.0
├─┬ react-router-dom@6.20.1
│ └── react-router@6.x
├─┬ axios@1.6.2
│ └── follow-redirects
├─┬ chart.js@4.4.0
│ └── react-chartjs-2@5.2.0
├── @heroicons/react@2.0.18
├── date-fns@2.30.0
├─┬ tailwindcss@3.3.6
│ ├── postcss@8.4.32
│ └── autoprefixer@10.4.16
└─┬ vite@5.0.0
  ├── @vitejs/plugin-react@4.1.1
  ├── rollup@4.x
  └── esbuild@0.x

Dev Dependencies:
├── eslint@8.53.0
├── eslint-plugin-react@7.33.2
├── eslint-plugin-react-hooks@4.6.0
└── @types/react@18.2.37
```

#### **Backend (Server)**
```
expense-tracker-server@1.0.0
├── express@4.18.2
├─┬ sqlite3@5.1.6
│ └── node-gyp (native bindings)
├─┬ knex@3.0.1
│ └── tarn (connection pooling)
├── bcryptjs@2.4.3
├── jsonwebtoken@9.0.2
├── joi@17.11.0
├── cors@2.8.5
├── morgan@1.10.0
├── multer@1.4.5-lts.1
└── dotenv@16.3.1

Dev Dependencies:
├── nodemon@3.0.1
├── jest@29.7.0
├── supertest@6.3.3
└── eslint@8.54.0
```

---

## 5. Consideraciones de Compatibilidad y Versiones

### 5.1 Requisitos del Entorno

| Componente | Versión Mínima | Versión Recomendada | Notas |
|------------|---------------|---------------------|-------|
| **Node.js** | 18.0.0 | 18.x LTS | Requerido para top-level await y features ES2022 |
| **npm** | 8.0.0 | 9.x | Incluido con Node.js |
| **Navegadores Soportados** | - | Últimas 2 versiones | Vite usa ES modules nativos |

### 5.2 Compatibilidad de Navegadores

**Basado en configuración de Vite y Tailwind:**

| Navegador | Versión Mínima |
|-----------|---------------|
| Chrome | 87+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge | 88+ |

**Features modernas utilizadas:**
- ES2020+ (Optional chaining, Nullish coalescing)
- ES Modules nativos
- CSS Grid y Flexbox
- Async/Await
- Fetch API

### 5.3 Consideraciones de Migración

#### **SQLite → PostgreSQL**
**Cambios necesarios:**
1. **Tipos de datos:**
   - `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
   - `DATETIME` → `TIMESTAMP`
   - `BOOLEAN` → Nativo en PostgreSQL
2. **Configuración Knex:**
   ```javascript
   // Cambio en knexfile.js
   client: 'pg',
   connection: process.env.DATABASE_URL
   ```
3. **Connection pooling:** Configurar pool size apropiado
4. **No hay cambios en queries:** Knex abstrae diferencias

#### **Versiones semánticas (semver)**
- **Caret (^)**: Permite actualizaciones de minor y patch
  - `^18.2.0` → Acepta 18.2.1, 18.3.0, pero NO 19.0.0
- **Tilde (~)**: Solo actualizaciones de patch
  - `~18.2.0` → Acepta 18.2.1, pero NO 18.3.0

**Recomendación:** Las dependencias actuales usan `^` apropiadamente para balance entre actualizaciones y estabilidad.

### 5.4 Dependencias con Consideraciones Especiales

#### **sqlite3@5.1.6**
- **Tipo:** Dependencia nativa (C++ bindings)
- **Consideración:** Requiere compilación en instalación
- **Solución:** Pre-built binaries disponibles para plataformas comunes
- **Alternativa:** `better-sqlite3` (más rápida, síncrona)

#### **bcryptjs vs bcrypt**
- **Elección actual:** bcryptjs (JavaScript puro)
- **Ventaja:** Sin compilación nativa, portabilidad total
- **Desventaja:** ~30% más lento que bcrypt nativo
- **Justificación:** Portabilidad > velocidad en este caso de uso

#### **Chart.js@4.4.0**
- **Breaking change de v3:** Tree-shakeable, requiere imports explícitos de componentes
- **Compatibilidad:** react-chartjs-2@5.x compatible con Chart.js 4.x

### 5.5 Actualizaciones de Seguridad

**Recomendaciones:**
1. **Auditoría regular:**
   ```bash
   npm audit
   npm audit fix
   ```
2. **Dependabot/Renovate:** Configurar para updates automáticos de seguridad
3. **Versiones específicas críticas:**
   - `jsonwebtoken`: Vulnerabilidades conocidas en <9.0.0 (versión segura ✓)
   - `express`: <4.17.3 tiene vulnerabilidades (versión segura ✓)

---

## 6. Deuda Técnica y Áreas de Mejora

### 6.1 Testing

**Estado actual:** Framework configurado, sin tests implementados

**Recomendaciones:**
1. **Unit tests:** Modelos y utilidades del backend
2. **Integration tests:** Endpoints de API con Supertest
3. **Component tests:** React components con React Testing Library
4. **E2E tests:** Flujos críticos con Playwright/Cypress

**Prioridad:** Alta

### 6.2 TypeScript Migration

**Consideración:** Proyecto usa JavaScript con JSDoc types limitados

**Beneficios de migración a TypeScript:**
- Type safety en compilación
- Better IDE autocomplete
- Refactoring más seguro
- Documentación integrada

**Esfuerzo estimado:** Medio (2-3 semanas)
**Prioridad:** Media

### 6.3 Docker Containerization

**Estado actual:** Sin configuración Docker

**Recomendaciones:**
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
services:
  frontend:
    build: ./client
    ports:
      - "3000:80"
  backend:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://...
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=expense_tracker
```

**Prioridad:** Alta para producción

### 6.4 CI/CD Pipeline

**Estado actual:** Sin pipeline configurado

**Recomendaciones para GitHub Actions:**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm run install:all
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

**Prioridad:** Alta

### 6.5 Environment Configuration

**Mejora recomendada:**
- Crear `.env.example` en server/
- Documentar todas las variables de entorno requeridas
- Validación de env vars al inicio con `envalid` o similar

**Prioridad:** Media

### 6.6 Error Tracking

**Recomendación:** Integrar Sentry o similar para producción

**Prioridad:** Media

---

## 7. Métricas del Proyecto

### 7.1 Tamaño del Proyecto

| Métrica | Frontend | Backend | Total |
|---------|----------|---------|-------|
| **Archivos de código** | 22 | 19 | 41 |
| **Componentes React** | 16 | - | 16 |
| **Rutas API** | - | 4 archivos | ~20 endpoints |
| **Modelos de datos** | - | 3 | 3 |
| **Tablas de BD** | - | 3 | 3 |

### 7.2 Dependencias

| Tipo | Frontend | Backend |
|------|----------|---------|
| **Dependencias producción** | 7 | 9 |
| **DevDependencies** | 11 | 4 |
| **Total** | 18 | 13 |

### 7.3 Bundle Size (Estimado)

**Frontend (Vite build):**
- **index.js:** ~150 KB (gzipped)
- **vendor.js:** ~180 KB (gzipped) - React + React Router + Chart.js
- **Total:** ~330 KB (gzipped)

**Optimizaciones aplicadas:**
- Tree-shaking automático (Vite)
- Code splitting por ruta (React Router)
- Tailwind CSS purge (solo clases usadas)

---

## 8. Referencias y Recursos

### 8.1 Documentación Oficial

| Tecnología | Documentación |
|------------|---------------|
| React | https://react.dev |
| Vite | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com/docs |
| Express | https://expressjs.com |
| Knex.js | https://knexjs.org |
| Chart.js | https://www.chartjs.org |
| React Router | https://reactrouter.com |

### 8.2 Archivos de Configuración Clave

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `package.json` | `/` | Scripts raíz y concurrently |
| `package.json` | `/client` | Dependencias frontend |
| `package.json` | `/server` | Dependencias backend |
| `vite.config.js` | `/client` | Configuración build y dev server |
| `tailwind.config.js` | `/client` | Configuración Tailwind |
| `.env` | `/server` | Variables de entorno (no versionado) |
| `schema.sql` | `/server/src/database` | Esquema de base de datos |

---

## 9. Conclusiones

### 9.1 Fortalezas del Stack

1. **Moderno y actualizado:** Uso de versiones recientes de todas las tecnologías
2. **Bien estructurado:** Separación clara de responsabilidades
3. **Escalable:** Preparado para migración a PostgreSQL y despliegue distribuido
4. **Developer Experience:** Vite + Hot Reload + Tailwind = desarrollo rápido
5. **Seguridad:** Implementación correcta de autenticación JWT y hashing bcrypt
6. **Portabilidad:** SQLite permite desarrollo sin dependencias externas

### 9.2 Recomendaciones Prioritarias

1. **Implementar testing completo** (Unit + Integration + E2E)
2. **Configurar CI/CD pipeline** para automatizar calidad de código
3. **Docker containerization** para deployment consistente
4. **Documentar API** con Swagger/OpenAPI
5. **Migrar a TypeScript** para mayor robustez

### 9.3 Adecuación al Propósito

El stack tecnológico es **altamente adecuado** para:
- Aplicación de rastreo de gastos personales
- Plataforma de aprendizaje para estudiantes
- Escalamiento futuro a producción

**Puntuación global:** 8.5/10

**Áreas de excelencia:**
- Arquitectura limpia
- Tecnologías modernas
- Buenas prácticas de seguridad

**Áreas de mejora:**
- Coverage de testing
- Infraestructura DevOps
- Documentación técnica

---

## 10. Historial de Versiones del Documento

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-11-05 | Versión inicial generada automáticamente |

---

## 11. Contacto y Contribuciones

Este documento es parte del proyecto **ExpenseTracker** y está diseñado para ser utilizado como:
- Referencia técnica para desarrolladores
- Material educativo para estudiantes
- Base para documentación de API

**Licencia:** MIT
**Repositorio:** [URL del repositorio]
**Mantenedor:** [Pendiente asignar]

---

**Generado automáticamente por Claude Code**
**Fecha de generación:** 2025-11-05
