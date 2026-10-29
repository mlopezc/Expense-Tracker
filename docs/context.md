# Contexto del proyecto: Expense Tracker

> Generado el 2026-10-27 a partir del código, la configuración y el historial de git (HEAD `56f3438`).
> Convenciones (ver `CLAUDE.md`): `[evidencia: ruta:línea]`, `[ASSUMPTION: motivo]`, `[NOT FOUND]`.
> Las rutas sin prefijo de carpeta raíz son relativas a la raíz del repositorio.

---

## 1. Resumen ejecutivo

Aplicación web full-stack para registrar y consultar gastos personales [evidencia: package.json:4]. Los usuarios se registran e inician sesión con JWT [evidencia: server/src/routes/auth.js:7-16], gestionan gastos y categorías (globales y propias) [evidencia: server/src/routes/expenses.js:10-25] [evidencia: server/src/routes/categories.js:10-25], y filtran o paginan su lista con totales y promedios [evidencia: server/src/controllers/expenseController.js:30-91]. Los reportes están sin implementar [evidencia: server/src/routes/reports.js:6-25]. Es un repositorio de entrenamiento para la Sesión 5, sobre documentación y pruebas con IA [evidencia: docs/prd/criterios-de-aceptacion.md:1-3].

---

## 2. Estructura del proyecto

| Carpeta | Función | Evidencia |
|---|---|---|
| `/` (raíz) | Orquesta client y server con scripts y `concurrently` | [evidencia: package.json:6-15] [evidencia: package.json:25-27] |
| `client/` | Frontend React + Vite | [evidencia: client/package.json:5-8] |
| `client/public/` | Archivos estáticos (`vite.svg`) | [ASSUMPTION: convención de Vite; solo contiene `vite.svg`] |
| `client/src/components/` | Componentes UI: `categories/`, `common/` (Layout, Navbar, Sidebar, ProtectedRoute, LoadingSpinner), `expenses/`, `forms/` | [evidencia: client/src/App.jsx:4] [evidencia: client/src/App.jsx:11] |
| `client/src/context/` | Estado global: `AuthContext`, `ExpenseContext` | [evidencia: client/src/App.jsx:2-3] |
| `client/src/pages/` | Pantallas: Dashboard, Login, Register, Expenses, Categories, Reports | [evidencia: client/src/App.jsx:5-10] |
| `client/src/services/` | Cliente HTTP axios (`api.js`) | [evidencia: client/src/services/api.js:5-10] |
| `client/src/styles/` | CSS global (Tailwind) | [evidencia: client/src/main.jsx:5] |
| `server/` | API REST Express | [evidencia: server/package.json:4] |
| `server/src/config/` | Configuración Knex (no se importa en ningún lado, ver §9) | [evidencia: server/src/config/database.js:3-27] |
| `server/src/controllers/` | Manejadores HTTP con validación Joi | [evidencia: server/src/controllers/expenseController.js:1-3] |
| `server/src/database/` | Conexión SQLite, `schema.sql`, seeds y script demo | [evidencia: server/src/database/connection.js:42-44] [evidencia: server/src/database/seeder.js:19] |
| `server/src/middleware/` | Autenticación JWT | [evidencia: server/src/middleware/auth.js:4] |
| `server/src/models/` | Clases de dominio con SQL (User, Category, Expense) | [evidencia: server/src/models/Expense.js:1-3] |
| `server/src/routes/` | Definición de endpoints por recurso | [evidencia: server/src/app.js:31-34] |
| `server/src/utils/` | Utilidades de auth (JWT, validaciones) | [evidencia: server/src/utils/auth.js:3-53] |
| `server/uploads/` | Directorio servido como estático en `/uploads` | [evidencia: server/src/app.js:19] |
| `docs/prd/` | Criterios de aceptación (fuente de verdad para pruebas) | [evidencia: docs/prd/criterios-de-aceptacion.md:3] |

---

## 3. Stack tecnológico

**Lenguajes:** JavaScript con CommonJS en el server [evidencia: server/src/app.js:1] [evidencia: server/src/app.js:50], ESM + JSX en el client [evidencia: client/package.json:4] [evidencia: client/src/main.jsx:1-4], y SQL [evidencia: server/src/database/schema.sql:2].
**Runtime:** Node 20 [evidencia: .nvmrc:1]. Todos los lockfiles usan `lockfileVersion` 3.

### Raíz

| Paquete | Versión exacta | Evidencia |
|---|---|---|
| concurrently (dev) | 8.2.2 | [evidencia: package-lock.json:117] |

### Server

| Paquete | Uso | Versión exacta | Evidencia |
|---|---|---|---|
| express | Framework HTTP | 4.21.2 | [evidencia: server/package-lock.json:3119] |
| sqlite3 | Base de datos | 5.1.7 | [evidencia: server/package-lock.json:6876] |
| jsonwebtoken | JWT | 9.0.2 | [evidencia: server/package-lock.json:4831] |
| bcryptjs | Hash de contraseñas | 2.4.3 | [evidencia: server/package-lock.json:1813] |
| joi | Validación | 17.13.3 | [evidencia: server/package-lock.json:4737] |
| cors | CORS | 2.8.5 | [evidencia: server/package-lock.json:2454] |
| morgan | Logs HTTP | 1.10.1 | [evidencia: server/package-lock.json:5447] |
| dotenv | Variables de entorno | 16.6.1 | [evidencia: server/package-lock.json:2667] |
| knex | Instalado, sin uso (§9) | 3.1.0 | [evidencia: server/package-lock.json:4906] |
| multer | Instalado, sin uso (§9) | 1.4.5-lts.2 | [evidencia: server/package-lock.json:5496] |
| jest (dev) | Test runner | 29.7.0 | [evidencia: server/package-lock.json:4141] |
| supertest (dev) | Pruebas HTTP | 6.3.4 | [evidencia: server/package-lock.json:7092] |
| nodemon (dev) | Recarga en desarrollo | 3.1.10 | [evidencia: server/package-lock.json:5619] |
| eslint (dev) | Lint | 8.57.1 | [evidencia: server/package-lock.json:2877] |

### Client

| Paquete | Uso | Versión exacta | Evidencia |
|---|---|---|---|
| react / react-dom | UI | 18.3.1 / 18.3.1 | [evidencia: client/package-lock.json:4646] [evidencia: client/package-lock.json:4668] |
| react-router-dom | Enrutado | 6.30.1 | [evidencia: client/package-lock.json:4713] |
| axios | HTTP | 1.11.0 | [evidencia: client/package-lock.json:1709] |
| vite (dev) | Bundler / dev server | 5.4.19 | [evidencia: client/package-lock.json:5760] |
| @vitejs/plugin-react (dev) | Plugin React | 4.7.0 | [evidencia: client/package-lock.json:1379] |
| tailwindcss (dev) | CSS | 3.4.17 | [evidencia: client/package-lock.json:5480] |
| postcss (dev) | CSS | 8.5.6 | [evidencia: client/package-lock.json:4416] |
| autoprefixer (dev) | CSS | 10.4.21 | [evidencia: client/package-lock.json:1655] |
| eslint (dev) | Lint | 8.57.1 | [evidencia: client/package-lock.json:2482] |
| chart.js | Instalado, sin uso (§9) | 4.5.0 | [evidencia: client/package-lock.json:1904] |
| react-chartjs-2 | Instalado, sin uso (§9) | 5.3.0 | [evidencia: client/package-lock.json:4658] |
| date-fns | Instalado, sin uso (§9) | 2.30.0 | [evidencia: client/package-lock.json:2099] |
| @heroicons/react | Instalado, sin uso (§9) | 2.2.0 | [evidencia: client/package-lock.json:808] |

---

## 4. Arquitectura

### Server: capas routes → controllers → models → database

- **Routes**: un router Express por recurso, montado en `app.js` [evidencia: server/src/app.js:31-34]. Las rutas de categorías y gastos aplican `authenticateToken` a todo el router [evidencia: server/src/routes/categories.js:7] [evidencia: server/src/routes/expenses.js:7].
- **Controllers**: clases con métodos estáticos. Validan con esquemas Joi y devuelven 400 con `details` [evidencia: server/src/controllers/expenseController.js:10-18] [evidencia: server/src/controllers/expenseController.js:123-129].
- **Models**: clases con métodos estáticos de búsqueda/creación y métodos de instancia `update`/`delete`/`toJSON`, con SQL parametrizado a mano. Es un estilo Active Record [ASSUMPTION: nombre del patrón inferido de la forma del código; el repo no lo nombra] [evidencia: server/src/models/Expense.js:28-45] [evidencia: server/src/models/Expense.js:180-224].
- **Database**: un singleton `Database` que envuelve `sqlite3` con promesas (`run`, `get`, `all`) [evidencia: server/src/database/connection.js:78-112] [evidencia: server/src/database/connection.js:132-134].
- **Separación app / servidor**: `app.js` construye la app sin abrir la BD ni escuchar, para poder importarla en pruebas con supertest [evidencia: server/src/app.js:6-8]. `server.js` conecta la BD y llama a `listen` [evidencia: server/server.js:9-16].
- **Inicialización de la BD en cada arranque**: ejecuta `schema.sql` (con `IF NOT EXISTS`), normaliza fechas en epoch a `YYYY-MM-DD` y siembra las categorías por defecto [evidencia: server/src/database/connection.js:42-72].
- **Errores**: hay un middleware global 500 y un manejador 404 [evidencia: server/src/app.js:37-48]. Además, cada controller captura sus propios errores [evidencia: server/src/controllers/expenseController.js:93-96].

### Client: Context + reducer + servicio HTTP

- **Estado global**: `AuthProvider` envuelve a `ExpenseProvider`, que envuelve las rutas [evidencia: client/src/App.jsx:15-44]. Cada contexto usa `useReducer` [evidencia: client/src/context/AuthContext.jsx:39] [evidencia: client/src/context/ExpenseContext.jsx:105].
- **HTTP**: una sola instancia de axios con base `VITE_API_URL` o `http://localhost:3001/api` [evidencia: client/src/services/api.js:3-10]. Un interceptor añade el `Bearer` desde `localStorage` [evidencia: client/src/services/api.js:13-20]; otro, ante un 401, borra el token y redirige a `/login` [evidencia: client/src/services/api.js:27-35].
- **Rutas protegidas**: `ProtectedRoute` muestra un spinner mientras carga y redirige a `/login` si falta `token` o `user` [evidencia: client/src/components/common/ProtectedRoute.jsx:5-16]. `Layout` renderiza Navbar, Sidebar y `<Outlet/>` [evidencia: client/src/components/common/Layout.jsx:5-17].
- **Sesión**: al montar, si existe token, se valida con `GET /auth/me` [evidencia: client/src/context/AuthContext.jsx:41-62].

### Relación client ↔ server

- El client llama a la API REST bajo `/api`. En desarrollo Vite corre en el puerto 3000 con un proxy de `/api` a `localhost:3001` [evidencia: client/vite.config.js:8-17]. El server escucha en `PORT` o 3001 [evidencia: server/server.js:6].

---

## 5. Puntos de entrada

| Componente | Archivo | Qué hace | Evidencia |
|---|---|---|---|
| Server (proceso) | `server/server.js` | Carga `.env`, conecta e inicializa la BD y llama a `app.listen` | [evidencia: server/server.js:1-23] |
| Server (app) | `server/src/app.js` | Construye la app Express (middleware, rutas, errores) y la exporta | [evidencia: server/src/app.js:8-50] |
| Server (`main`) | declarado en `server/package.json` | `"main": "server.js"` | [evidencia: server/package.json:5] |
| Client (HTML) | `client/index.html` | Monta `#root` y carga `/src/main.jsx` | [evidencia: client/index.html:10-11] |
| Client (JS) | `client/src/main.jsx` | `createRoot` + `BrowserRouter` + `<App/>` | [evidencia: client/src/main.jsx:7-13] |
| Client (rutas) | `client/src/App.jsx` | Providers y tabla de rutas | [evidencia: client/src/App.jsx:13-46] |
| Script | `server/src/database/seed-demo.js` | Crea el usuario demo con gastos de 3 meses | [evidencia: server/src/database/seed-demo.js:1-4] [evidencia: server/src/database/seed-demo.js:11-16] |

---

## 6. Funcionalidades core

### 6.1 Modelos de datos (SQLite)

**`users`** [evidencia: server/src/database/schema.sql:2-10]: `id` PK autoincrement, `email` UNIQUE NOT NULL, `password_hash` NOT NULL, `first_name`, `last_name`, `created_at`, `updated_at`.

**`categories`** [evidencia: server/src/database/schema.sql:13-24]: `id`, `name` NOT NULL, `description`, `color` (hex), `icon`, `user_id` (FK users, ON DELETE CASCADE; NULL = global), `is_default`, timestamps.

**`expenses`** [evidencia: server/src/database/schema.sql:27-41]: `id`, `amount` DECIMAL(10,2) NOT NULL, `description` NOT NULL, `date` NOT NULL, `category_id` NOT NULL (FK categories), `user_id` NOT NULL (FK users, ON DELETE CASCADE), `receipt_filename`, `tags` (array JSON en texto), `notes`, timestamps.

**Índices**: `expenses(user_id)`, `expenses(date)`, `expenses(category_id)`, `categories(user_id)` [evidencia: server/src/database/schema.sql:44-47].

**Datos semilla**: 9 categorías globales (`user_id` NULL, `is_default` 1): Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Other [evidencia: server/src/database/seed.sql:2-11]. Usuario demo `demo@expense-tracker.dev` / `demo1234` [evidencia: server/src/database/seed-demo.js:11-16].

**Mapeo a JSON**: los modelos exponen camelCase (`categoryId`, `userId`, `isDefault`…) [evidencia: server/src/models/Expense.js:209-223] [evidencia: server/src/models/Category.js:117-128]. `User.toJSON` excluye `passwordHash` [evidencia: server/src/models/User.js:81-89].

### 6.2 Endpoints

| Método | Ruta | Auth | Controlador | Evidencia |
|---|---|---|---|---|
| GET | `/api/health` | No | inline | [evidencia: server/src/app.js:22-28] |
| POST | `/api/auth/register` | No | `register` | [evidencia: server/src/routes/auth.js:7] |
| POST | `/api/auth/login` | No | `login` | [evidencia: server/src/routes/auth.js:10] |
| POST | `/api/auth/logout` | No | `logout` (solo responde 200) | [evidencia: server/src/routes/auth.js:13] [evidencia: server/src/controllers/authController.js:102-105] |
| GET | `/api/auth/me` | Sí | `getCurrentUser` | [evidencia: server/src/routes/auth.js:16] |
| GET | `/api/categories` | Sí | `getCategories` (`?include_defaults=false`) | [evidencia: server/src/routes/categories.js:10] [evidencia: server/src/controllers/categoryController.js:21] |
| GET | `/api/categories/:id` | Sí | `getCategory` | [evidencia: server/src/routes/categories.js:13] |
| GET | `/api/categories/:id/stats` | Sí | `getCategoryStats` (conteo de gastos) | [evidencia: server/src/routes/categories.js:16] |
| POST | `/api/categories` | Sí | `createCategory` | [evidencia: server/src/routes/categories.js:19] |
| PUT | `/api/categories/:id` | Sí | `updateCategory` | [evidencia: server/src/routes/categories.js:22] |
| DELETE | `/api/categories/:id` | Sí | `deleteCategory` | [evidencia: server/src/routes/categories.js:25] |
| GET | `/api/expenses` | Sí | `getExpenses` (filtros, paginación, totales) | [evidencia: server/src/routes/expenses.js:10] |
| GET | `/api/expenses/summary` | Sí | `getExpensesSummary` | [evidencia: server/src/routes/expenses.js:13] |
| GET | `/api/expenses/:id` | Sí | `getExpense` | [evidencia: server/src/routes/expenses.js:16] |
| POST | `/api/expenses` | Sí | `createExpense` | [evidencia: server/src/routes/expenses.js:19] |
| PUT | `/api/expenses/:id` | Sí | `updateExpense` | [evidencia: server/src/routes/expenses.js:22] |
| DELETE | `/api/expenses/:id` | Sí | `deleteExpense` | [evidencia: server/src/routes/expenses.js:25] |
| GET | `/api/reports/summary` | No | stub | [evidencia: server/src/routes/reports.js:5-8] |
| GET | `/api/reports/categories` | No | stub | [evidencia: server/src/routes/reports.js:11-14] |
| GET | `/api/reports/trends` | No | stub | [evidencia: server/src/routes/reports.js:17-20] |
| GET | `/api/reports/export` | No | stub | [evidencia: server/src/routes/reports.js:23-26] |

### 6.3 Lógica de negocio principal

**Autenticación**
- Registro: email válido, password de 6 caracteres o más, nombre y apellido de 1 a 100 caracteres. Devuelve 400 si el email ya existe [evidencia: server/src/controllers/authController.js:5-10] [evidencia: server/src/controllers/authController.js:31-34].
- Contraseñas con bcrypt, 10 rondas de salt [evidencia: server/src/models/User.js:19-20].
- Login: responde 401 genérico ("Invalid credentials") tanto si falla el email como la contraseña [evidencia: server/src/controllers/authController.js:67-75].
- JWT con payload `{ userId }`, expiración `JWT_EXPIRES_IN` o `7d` [evidencia: server/src/utils/auth.js:4-11]. El middleware responde 401 si falta el token, si es inválido o si el usuario no existe [evidencia: server/src/middleware/auth.js:9-25].

**Gastos**
- Validación al crear: `amount` positivo con hasta 2 decimales, `description` de 1 a 255, `date` ISO (se guarda solo `YYYY-MM-DD`), `categoryId` entero positivo, `tags` hasta 10 de máximo 50 caracteres, `notes` hasta 1000 [evidencia: server/src/controllers/expenseController.js:5-18].
- La categoría debe existir y ser global o del usuario. Si no, responde 400 [evidencia: server/src/controllers/expenseController.js:131-140].
- Solo el propietario lee, edita o borra un gasto; los demás reciben 403 [evidencia: server/src/controllers/expenseController.js:108-110] [evidencia: server/src/models/Expense.js:205-207].
- Listado: filtros `category_id`, `start_date`, `end_date`, `search` (LIKE en description/notes). Paginación con `page` y `limit` (1 a 100, por defecto 20). Orden con lista blanca (`date|amount|description|created_at`, `asc|desc`) [evidencia: server/src/controllers/expenseController.js:30-39] [evidencia: server/src/models/Expense.js:80-112].
- La respuesta incluye `pagination` y `summary` (`totalAmount`, `averageAmount`) [evidencia: server/src/controllers/expenseController.js:78-92].
- Migración automática de fechas guardadas en epoch ms a `YYYY-MM-DD` [evidencia: server/src/database/connection.js:54-62]; se introdujo en el commit `62890b8`.

**Categorías**
- Validación: `name` de 1 a 100, `color` en formato `#RRGGBB`, `icon` de hasta 50, `description` de hasta 500 [evidencia: server/src/controllers/categoryController.js:4-9].
- Las globales (`user_id` NULL) son de solo lectura. Solo el dueño modifica o borra una categoría [evidencia: server/src/models/Category.js:111-115].
- No se puede borrar una categoría usada por algún gasto; responde 400 [evidencia: server/src/models/Category.js:92-99] [evidencia: server/src/controllers/categoryController.js:130-132].
- El listado incluye las globales por defecto, ordenadas primero las default y luego por nombre [evidencia: server/src/models/Category.js:44-50].

---

## 7. Configuración

### 7.1 Variables de entorno que el código lee

| Variable | Dónde | Por defecto | Requerida | Evidencia |
|---|---|---|---|---|
| `JWT_SECRET` | server | ninguno | **Sí**: sin ella `jwt.sign`/`verify` fallan [ASSUMPTION: comportamiento de jsonwebtoken con secreto `undefined`] | [evidencia: server/src/utils/auth.js:10] [evidencia: server/src/utils/auth.js:15] |
| `JWT_EXPIRES_IN` | server | `7d` | No | [evidencia: server/src/utils/auth.js:7] |
| `PORT` | server | `3001` | No | [evidencia: server/server.js:6] |
| `NODE_ENV` | server | — | No (`test` desactiva morgan; `development` expone `err.message`) | [evidencia: server/src/app.js:12] [evidencia: server/src/app.js:41] |
| `SQLITE_DB_PATH` | server | `server/src/database/expense_tracker.db` | No (`:memory:` para pruebas) | [evidencia: server/src/database/connection.js:7-16] |
| `VITE_API_URL` | client | `http://localhost:3001/api` | No | [evidencia: client/src/services/api.js:3] |
| `DATABASE_URL` | server | — | No (solo en `config/database.js`, que no se usa) | [evidencia: server/src/config/database.js:19] |

Plantilla: `cp server/.env.example server/.env` [evidencia: server/.env.example:1-2].

**Variables de `.env.example` que el código no lee** (búsqueda con `grep` en `server/src` y `server/server.js`, sin resultados): `JWT_REFRESH_SECRET` [evidencia: server/.env.example:16], `MAX_FILE_SIZE` [evidencia: server/.env.example:19], `UPLOAD_PATH` [evidencia: server/.env.example:20], `CLIENT_URL` [evidencia: server/.env.example:23], `RATE_LIMIT_WINDOW_MS` y `RATE_LIMIT_MAX_REQUESTS` [evidencia: server/.env.example:26-27] → [NOT FOUND] en el código.

### 7.2 Scripts de build y run

| Script | Comando real | Evidencia |
|---|---|---|
| `npm run install:all` | `npm install` en raíz, client y server | [evidencia: package.json:14] |
| `npm run dev` | `concurrently` de `dev:server` (nodemon) + `dev:client` (vite) | [evidencia: package.json:7-9] [evidencia: server/package.json:8] [evidencia: client/package.json:7] |
| `npm run build` | `vite build` en client → `client/dist`, con sourcemaps | [evidencia: package.json:10] [evidencia: client/package.json:8] [evidencia: client/vite.config.js:19-21] |
| `npm start` | `node server.js` | [evidencia: package.json:11] [evidencia: server/package.json:7] |
| `npm test` | `jest --passWithNoTests` en server | [evidencia: package.json:12] [evidencia: server/package.json:10] |
| `npm run seed:demo` | `node src/database/seed-demo.js` | [evidencia: package.json:13] [evidencia: server/package.json:9] |
| `cd server && npm run lint` | `eslint .` | [evidencia: server/package.json:11] |
| `cd client && npm run lint` | `eslint . --ext js,jsx --max-warnings 0` | [evidencia: client/package.json:10] |
| `cd client && npm run preview` | `vite preview` | [evidencia: client/package.json:9] |

Puertos: client 3000 (abre el navegador) [evidencia: client/vite.config.js:9-10], server 3001 [evidencia: server/server.js:6].

---

## 8. Estado de las pruebas

| Aspecto | Estado | Evidencia |
|---|---|---|
| Archivos de prueba (`*.test.*`, `*.spec.*`) | **Ninguno**: [NOT FOUND] | búsqueda con `find` en todo el repo (excluyendo `node_modules`) |
| Framework instalado | Jest 29.7.0 + supertest 6.3.4 (server) | [evidencia: server/package-lock.json:4141] [evidencia: server/package-lock.json:7092] |
| Config de Jest (`jest.config.*`) | [NOT FOUND] | búsqueda con `find` |
| Resultado de `npm test` | Exit 0 con "No tests found": pasa solo por `--passWithNoTests` | [evidencia: server/package.json:10] (ejecutado el 2026-10-27) |
| Pruebas del client | [NOT FOUND]: no hay script `test` | [evidencia: client/package.json:6-12] |
| Herramienta E2E (Cypress/Playwright) | [NOT FOUND] en ningún `package.json` | — |
| Cobertura | 0 % de hecho; no hay script ni config de cobertura → [NOT FOUND] | — |

**Lo que ya está preparado para probar:**
- `app.js` es importable sin levantar el servidor [evidencia: server/src/app.js:6-7].
- BD en memoria con `SQLITE_DB_PATH=:memory:` [evidencia: server/src/database/connection.js:12-14] [evidencia: README.md:73].
- morgan se desactiva con `NODE_ENV=test` [evidencia: server/src/app.js:12-14].
- Selectores `data-testid` estables en Login [evidencia: client/src/pages/Login.jsx:93] [evidencia: client/src/pages/Login.jsx:105] [evidencia: client/src/pages/Login.jsx:126] [evidencia: client/src/pages/Login.jsx:145], Gastos [evidencia: client/src/pages/Expenses.jsx:81] [evidencia: client/src/components/expenses/ExpenseList.jsx:90] [evidencia: client/src/components/expenses/ExpenseList.jsx:173] y Formulario [evidencia: client/src/components/forms/ExpenseForm.jsx:188] [evidencia: client/src/components/forms/ExpenseForm.jsx:344]. El catálogo completo está en [evidencia: docs/prd/criterios-de-aceptacion.md:45-53].
- Criterios de aceptación CA-1 a CA-3 (registrar un gasto, funcionalidad existente) y CA-4 a CA-6 (presupuesto mensual, funcionalidad nueva) [evidencia: docs/prd/criterios-de-aceptacion.md:5-39].
- Datos demo para pruebas [evidencia: docs/prd/criterios-de-aceptacion.md:41-43].

---

## 9. Hallazgos

### 9.1 Código incompleto

- Los 4 endpoints de `/api/reports` son stubs con `TODO` que devuelven solo un mensaje [evidencia: server/src/routes/reports.js:5-26]. Además no aplican `authenticateToken` [evidencia: server/src/routes/reports.js:1-3].
- La página Reports muestra "coming soon" [evidencia: client/src/pages/Reports.jsx:10].
- Presupuesto mensual por categoría (CA-4 a CA-6): **no existe todavía**, según el propio PRD [evidencia: docs/prd/criterios-de-aceptacion.md:23-25].
- `optionalAuth` se define y exporta pero no se usa en ninguna ruta [evidencia: server/src/middleware/auth.js:28] [evidencia: server/src/middleware/auth.js:50].
- Hay un campo `receiptFilename` y un directorio `uploads`, pero no hay endpoint de subida (multer no se usa) [evidencia: server/src/controllers/expenseController.js:15] [evidencia: server/src/app.js:19].

### 9.2 Bugs y riesgos

**Bugs verificados**

Se reprodujeron el 2026-10-27 con un script contra una BD `:memory:`, sin modificar código:

1. **Un PUT parcial devuelve 500.** `Expense.update` y `Category.update` escriben todas las columnas con lo que reciben, aunque los esquemas Joi de update permiten enviar solo algunos campos [evidencia: server/src/controllers/expenseController.js:20-28] [evidencia: server/src/controllers/categoryController.js:11-16].
   - Un `PUT` con solo `{ notes }` pasa `undefined` a la consulta y falla con `NOT NULL constraint failed: expenses.amount`; el cliente recibe 500 [evidencia: server/src/models/Expense.js:180-192].
   - En categorías pasa lo mismo, con `categories.name` [evidencia: server/src/models/Category.js:76-84].
2. **Editar un gasto desde la UI borra el recibo.** El formulario no envía `receiptFilename` [evidencia: client/src/components/forms/ExpenseForm.jsx:126-133], así que `update` lo pone en `NULL` (consecuencia del bug 1).
3. **`ON DELETE CASCADE` no se aplica.** El código nunca ejecuta `PRAGMA foreign_keys = ON` [NOT FOUND en `server/src`]. Al borrar un usuario, sus gastos quedan huérfanos (comprobado: 2 gastos quedaron tras borrar al usuario).

**Riesgos**

- `GET /api/expenses/summary` no valida su query con Joi, a diferencia del listado [evidencia: server/src/controllers/expenseController.js:223-231].
- CORS abierto a cualquier origen (`cors()` sin opciones) [evidencia: server/src/app.js:11], aunque `.env.example` define `CLIENT_URL` [evidencia: server/.env.example:23].
- No hay rate limiting: no existe el middleware aunque `.env.example` lo configura [evidencia: server/.env.example:25-27] → [NOT FOUND] en el código.
- `JWT_SECRET` no tiene valor por defecto ni validación al arrancar [evidencia: server/src/utils/auth.js:10]. La plantilla trae `change-me` [evidencia: server/.env.example:14], que es inseguro si no se cambia.
- Token JWT guardado en `localStorage` [evidencia: client/src/services/api.js:15] [evidencia: client/src/context/AuthContext.jsx:70]. Queda expuesto a XSS [ASSUMPTION: riesgo general de la técnica, no un ataque demostrado].
- El logout no invalida el token en el servidor [evidencia: server/src/controllers/authController.js:102-105].
- Si fallan el seed o la normalización de fechas, el error se registra y el servidor arranca igual [evidencia: server/src/database/connection.js:60-70].
- Validación duplicada: `AuthUtils.validateEmail/Password/Name` existe en paralelo a Joi y no se usa en los controllers [evidencia: server/src/utils/auth.js:28-52] [evidencia: server/src/controllers/authController.js:5-15].

### 9.3 Código muerto y dependencias sin uso

- `server/src/config/database.js` (Knex: SQLite `dev.db` en desarrollo, PostgreSQL en producción) no se importa en ningún lado [evidencia: server/src/config/database.js:1-29]. Su `client: 'postgresql'` requiere el driver `pg`, que no está instalado [evidencia: server/src/config/database.js:18] [evidencia: server/package.json:14-25].
- `knex` y `multer` (server) no se importan en `server/src` ni en `server/server.js` (búsqueda con `grep`) [evidencia: server/package.json:22-23].
- `chart.js`, `react-chartjs-2`, `date-fns` y `@heroicons/react` (client) no se importan en `client/src` (búsqueda con `grep`) [evidencia: client/package.json:18-21].
- El README referencia `Roadmap.md` [evidencia: README.md:169], que se eliminó en el commit `b66f1b7` ("remove roadmap").

### 9.4 Dependencias vulnerables (`npm audit`, 2026-10-27)

| Paquete npm | Total | Crítica | Alta | Moderada | Baja |
|---|---|---|---|---|---|
| raíz | 2 | 1 | 1 | 0 | 0 |
| server | 35 | 2 | 20 | 4 | 9 |
| client | 23 | 0 | 17 | 5 | 1 |

Las de la raíz son transitivas (no hay dependencias directas afectadas). Dependencias **directas** afectadas:

| Paquete | Severidad | ¿Se arregla sin cambio de versión mayor? |
|---|---|---|
| express (server) | alta | Sí |
| joi (server) | alta | Sí |
| sqlite3 (server) | alta | No (requiere 6.x) |
| morgan (server) | moderada | Sí |
| jest (server, dev) | baja | No (audit propone un cambio de versión mayor) |
| axios (client) | alta | Sí |
| vite (client, dev) | alta | Sí |
| react-router-dom (client) | alta | Sí |
| postcss (client, dev) | alta | Sí |

### 9.5 Dependencias desactualizadas (`npm outdated`, 2026-10-27, selección)

| Paquete | Actual | Wanted (rango) | Latest |
|---|---|---|---|
| express | 4.21.2 | 4.22.3 | 5.3.0 |
| sqlite3 | 5.1.7 | 5.1.7 | 6.0.1 |
| multer | 1.4.5-lts.2 | 1.4.5-lts.2 | 2.5.0 |
| joi | 17.13.3 | 17.13.8 | 18.3.0 |
| jest | 29.7.0 | 29.7.0 | 30.5.2 |
| eslint (ambos) | 8.57.1 | 8.57.1 | 10.13.0 |
| react / react-dom | 18.3.1 | 18.3.1 | 19.3.1 |
| react-router-dom | 6.30.1 | 6.30.6 | 7.18.5 |
| vite | 5.4.19 | 5.4.21 | 8.3.5 |
| tailwindcss | 3.4.17 | 3.4.19 | 4.3.3 |
| axios | 1.11.0 | 1.21.0 | 1.21.0 |
| date-fns | 2.30.0 | 2.30.0 | 4.4.0 |
| concurrently | 8.2.2 | 8.2.2 | 9.2.5 |

ESLint 8 usa el formato `.eslintrc` [evidencia: server/.eslintrc.js:1] [evidencia: client/.eslintrc.cjs:1]. Ese formato ya no es el predeterminado en versiones posteriores [ASSUMPTION: conocimiento externo de ESLint, no verificable en el repo].

---

## 10. Lista de ASSUMPTION y NOT FOUND

### ASSUMPTION

| # | Sección | Afirmación | Motivo |
|---|---|---|---|
| A1 | §2 | `client/public/` sirve archivos estáticos | Convención de Vite; la carpeta solo contiene `vite.svg` |
| A2 | §4 | Los modelos siguen un estilo Active Record | Nombre del patrón inferido de la forma del código |
| A3 | §7.1 | Sin `JWT_SECRET`, la firma y la verificación fallan | Comportamiento de jsonwebtoken con secreto `undefined`, no ejecutado |
| A4 | §9.2 | El token en `localStorage` queda expuesto a XSS | Riesgo general de la técnica, no demostrado |
| A5 | §9.5 | `.eslintrc` ya no es el formato predeterminado en ESLint 9+ | Conocimiento externo, no verificable en el repo |

### NOT FOUND

| # | Sección | Qué se buscó |
|---|---|---|
| N1 | §7.1 | Uso en el código de `JWT_REFRESH_SECRET`, `MAX_FILE_SIZE`, `UPLOAD_PATH`, `CLIENT_URL`, `RATE_LIMIT_*` |
| N2 | §8 | Archivos de prueba (`*.test.*`, `*.spec.*`) |
| N3 | §8 | Configuración de Jest |
| N4 | §8 | Script `test` en el client |
| N5 | §8 | Herramienta E2E (Cypress/Playwright) |
| N6 | §8 | Script o configuración de cobertura |
| N7 | §9.2 | `PRAGMA foreign_keys = ON` |
| N8 | §9.2 | Middleware de rate limiting |
| N9 | §9.3 | Imports de knex, multer, chart.js, react-chartjs-2, date-fns, @heroicons/react |
| N10 | §9.3 | `Roadmap.md` (referenciado por el README, borrado en `b66f1b7`) |
