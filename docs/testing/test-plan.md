# Plan de pruebas

> Generado el 2026-10-28 a partir de `docs/testing/test-matrix.md`, `docs/context.md` y el código (HEAD `56f3438`).
> Convenciones (ver `CLAUDE.md`): `[evidencia: ruta:línea]`, `[ASSUMPTION: motivo]`, `[NOT FOUND]`.
> Sin timeline: una fase termina cuando cumple su criterio de salida, no en una fecha.

**Criterio de salida común a todas las fases:**

1. El comando de la fase termina con exit 0 y todas sus pruebas pasan.
2. Los comandos de las fases anteriores siguen en verde (no hay regresión).
3. El check de mutación manual de la fase (§3) se completa: cada mutación pone en rojo al menos una prueba concreta.

---

## 1. Configuración de herramientas

### 1.1 Server: Jest + supertest

| Pieza | Decisión | Evidencia |
|---|---|---|
| Framework / runner | Jest 29, ya instalado | [evidencia: server/package.json:28] |
| HTTP | supertest sobre `app.js`, sin `listen` | [evidencia: server/package.json:29] [evidencia: server/src/app.js:6-8] |
| Módulos | CommonJS, Jest lo ejecuta sin transformaciones | [evidencia: server/src/app.js:1] [evidencia: server/src/app.js:50] |
| Entorno | `testEnvironment: 'node'` | — |

**Archivos de configuración a crear.** Son infraestructura de pruebas, no código de producción.

`server/jest.config.js`:

```js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/setup/env.js'],
};
```

`server/tests/setup/env.js`:

```js
process.env.NODE_ENV = 'test';          // desactiva morgan
process.env.SQLITE_DB_PATH = ':memory:'; // BD aislada
process.env.JWT_SECRET = 'test-secret';  // no tiene valor por defecto
```

- `NODE_ENV=test` desactiva morgan [evidencia: server/src/app.js:12-14].
- `SQLITE_DB_PATH=:memory:` se respeta al conectar [evidencia: server/src/database/connection.js:12-14].
- `JWT_SECRET` se lee en cada firma y verificación [evidencia: server/src/utils/auth.js:10] [evidencia: server/src/utils/auth.js:15].

**ESLint.** Añadir un `overrides` en `server/.eslintrc.js` para `tests/**` con `env: { jest: true }`. Hoy solo declara `node` y `es2021` [evidencia: server/.eslintrc.js:2-5], así que `describe`/`it`/`expect` darían `no-undef`.

### 1.2 Base de datos de pruebas aislada

| Nivel de aislamiento | Cómo se consigue | Evidencia |
|---|---|---|
| Por archivo de prueba | Cada archivo hace `beforeAll(() => database.connect())` y `afterAll(() => database.close())`. Jest da a cada archivo su propio registro de módulos, así que el singleton `database` y su BD `:memory:` son distintos por archivo [ASSUMPTION: comportamiento documentado de Jest, no verificado en este repo]. | [evidencia: server/src/database/connection.js:132-134] [evidencia: server/src/database/connection.js:114] |
| Esquema y datos base | `connect()` ejecuta `schema.sql` y siembra las 9 categorías globales, incluida "Food & Dining" | [evidencia: server/src/database/connection.js:42-72] [evidencia: server/src/database/seed.sql:3] |
| Por prueba | Cada prueba registra **su propio usuario** con un email único (helper `tests/helpers/auth.js` → `registerUser(app)` devuelve `{ token, user }`). Ninguna prueba depende del orden ni de datos de otra. | [evidencia: server/src/controllers/authController.js:40-45] |
| Sin archivos en disco | `:memory:` no crea `.db`. Además `*.db` ya está en `.gitignore`. | [evidencia: .gitignore:14] |

Los ids de categoría se buscan **por nombre** (`GET /api/categories`); nunca se fijan a mano.

### 1.3 Client: Vitest + Testing Library (solo Fase 3)

| Pieza | Decisión | Evidencia |
|---|---|---|
| Framework / runner | Vitest. El client es Vite 5 + ESM; Vitest reutiliza el plugin React de `vite.config.js` | [evidencia: client/package.json:4] [evidencia: client/package.json:27] [evidencia: client/vite.config.js:6] |
| DOM | `jsdom` | — |
| Render / interacción | `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` | — |
| Estado actual | Nada instalado; no hay script `test` → [NOT FOUND] | [evidencia: client/package.json:6-12] |

Instalación:

```bash
cd client && npm install -D vitest@^2 jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
```

Las versiones son [ASSUMPTION: Vitest 2.x es compatible con Vite 5 y Testing Library 16 con React 18; conocimiento externo, verificar al instalar].

Para no tocar `vite.config.js`, crear `client/vitest.config.js` aparte:

```js
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(viteConfig, defineConfig({
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.js'], css: false },
}))
```

Además:
- `client/src/test/setup.js` importa `@testing-library/jest-dom/vitest` y registra `afterEach(cleanup)`.
- Añadir `"test": "vitest run"` en `client/package.json`.
- Importar `describe/it/expect/vi` desde `vitest` de forma explícita: el ESLint del client usa `--max-warnings 0` y solo declara `browser` [evidencia: client/package.json:10] [evidencia: client/.eslintrc.cjs:3].

### 1.4 Advertencia sobre `npm test`

`npm test` usa `jest --passWithNoTests` [evidencia: server/package.json:10], así que sale en verde aunque el patrón no encuentre ningún archivo. Por eso los comandos de fase (§3) llaman a `npx jest <rutas>` **sin** esa bandera: si los archivos no existen, Jest sale con error.

---

## 2. Fases

### Fase 1: configuración + caracterización de CA-1 a CA-3

**Objetivo:** dejar lista la infraestructura de §1.1 y §1.2, y fijar con pruebas el comportamiento actual de "registrar un gasto". Son pruebas de **caracterización**: el código ya existe y se espera que pasen al primer intento. Si alguna falla porque el código no cumple el criterio, es un bug que se reporta; **no** se ajusta la prueba (`CLAUDE.md`, reglas de pruebas).

| Archivo | Casos (ver matriz) |
|---|---|
| `server/tests/integration/expenses.create.test.js` | 1.a, 1.b, 1.c |
| `server/tests/integration/expenses.validation.test.js` | 2.a, 2.b, 2.c, 2.d, 2.e |
| `server/tests/integration/expenses.auth.test.js` | 3.a, 3.b, 3.c, 3.d, 3.e |
| `server/tests/helpers/auth.js`, `server/tests/helpers/db.js` | Helpers (sin casos) |

**Total:** 13 pruebas. El caso 1.d (E2E) queda fuera; ver §4.

**Bugs encontrados en la Fase 1 (corregidos el 2026-10-28).** El check de mutación descubrió dos bugs. Se escribieron como pruebas en rojo, se corrigieron en `expenseController.js` y sus pruebas viven ahora en `server/tests/integration/expenses.rules.test.js` (Fase 2):

| Caso | Antes | Ahora |
|---|---|---|
| `date: "2026-02-30"` | 201; se guardaba `"2026-02-30"` | 400; `dateOnly` comprueba la fecha contra el calendario real [evidencia: server/src/controllers/expenseController.js:8-19] |
| `amount: 1e12` | 201; el server no tenía máximo | 400; `MAX_AMOUNT = 999999.99`, igual que el client [evidencia: server/src/controllers/expenseController.js:21-25] [evidencia: client/src/components/forms/ExpenseForm.jsx:48-49] |

### Fase 2: funciones críticas restantes del servidor

**Objetivo:** cubrir autenticación, el resto de validaciones y el control de propiedad. Son las reglas que, si se rompen, exponen datos o corrompen la BD.

| Archivo | Caso | Esperado | Evidencia |
|---|---|---|---|
| `server/tests/integration/auth.test.js` | Registro válido | 201 + `token`; `user` sin `passwordHash` | [evidencia: server/src/controllers/authController.js:40-45] [evidencia: server/src/models/User.js:81-89] |
| | Email duplicado | 400 `Email already registered` | [evidencia: server/src/controllers/authController.js:31-34] |
| | Email inválido / password de 5 caracteres / `firstName` vacío | 400 por caso (frontera: 6 caracteres sí pasa) | [evidencia: server/src/controllers/authController.js:5-10] |
| | Login correcto | 200 + `token` | [evidencia: server/src/controllers/authController.js:77-83] |
| | Password incorrecta **y** email inexistente | 401 con el **mismo** cuerpo `Invalid credentials` (no revela qué falló) | [evidencia: server/src/controllers/authController.js:66-75] |
| | Login sin password | 400 | [evidencia: server/src/controllers/authController.js:12-15] |
| | `GET /api/auth/me` con y sin token | 200 con `user` / 401 | [evidencia: server/src/routes/auth.js:16] |
| | Token expirado (firmado con `expiresIn` negativo) | 401 `Invalid token` | [evidencia: server/src/middleware/auth.js:23-25] |
| `server/tests/unit/authUtils.test.js` | `generateToken` → `verifyToken` devuelve `userId`; token alterado lanza `Invalid token` | — | [evidencia: server/src/utils/auth.js:4-19] |
| | `extractTokenFromHeader`: `undefined`, `"Token x"`, `"Bearer x"` | `null`, `null`, `"x"` | [evidencia: server/src/utils/auth.js:21-26] |
| `server/tests/integration/expenses.rules.test.js` | ✅ **Ya escritos:** `date: "2026-02-30"` y `amount: 1e12` | 400 y no se guarda | [evidencia: server/src/controllers/expenseController.js:8-25] |
| | `description` vacía / de 256 caracteres; `date` inválida; `categoryId` ausente; 11 `tags` | 400 por caso | [evidencia: server/src/controllers/expenseController.js:10-18] |
| | `date: "2026-10-15T23:30:00Z"` | se guarda `"2026-10-15"` (regresión del commit `62890b8`) | [evidencia: server/src/controllers/expenseController.js:5-8] |
| | `amount: 10.123` | **caracterizar** lo que pasa hoy (¿400 o redondeo a 10.12?) y documentarlo [ASSUMPTION: depende de `convert` en Joi; no verificado] | [evidencia: server/src/controllers/expenseController.js:11] |
| | Categoría inexistente / categoría de otro usuario | 400 `Category not found` / 400 `Cannot use this category` | [evidencia: server/src/controllers/expenseController.js:132-140] |
| | `GET /api/expenses?limit=101` | 400 | [evidencia: server/src/controllers/expenseController.js:36] |
| `server/tests/integration/expenses.ownership.test.js` | `GET`/`PUT`/`DELETE` del gasto de otro usuario | 403 `Access denied` | [evidencia: server/src/controllers/expenseController.js:108-110] [evidencia: server/src/controllers/expenseController.js:163-165] [evidencia: server/src/controllers/expenseController.js:208-210] |
| | Id inexistente | 404 | [evidencia: server/src/controllers/expenseController.js:104-106] |
| `server/tests/integration/categories.test.js` | Crear con `color: "red"` | 400 | [evidencia: server/src/controllers/categoryController.js:7] |
| | `PUT` / `DELETE` de una categoría global | 403 | [evidencia: server/src/controllers/categoryController.js:88] [evidencia: server/src/controllers/categoryController.js:121] [evidencia: server/src/models/Category.js:111-115] |
| | `DELETE` de una categoría propia con gastos | 400 | [evidencia: server/src/models/Category.js:92-99] [evidencia: server/src/controllers/categoryController.js:131] |

**Bugs conocidos.** `docs/context.md` §9.2 ya documenta tres bugs reproducidos. Sus pruebas se escriben contra el comportamiento **correcto**, en una carpeta aparte, y estarán en rojo hasta que se corrijan:

| Archivo | Caso | Hoy |
|---|---|---|
| `server/tests/known-bugs/partial-update.test.js` | `PUT /api/expenses/:id` con solo `{ notes }` → 200 y el resto de campos intactos | 500 [evidencia: server/src/models/Expense.js:180-192] |
| | `PUT /api/categories/:id` con solo `{ color }` → 200 | 500 [evidencia: server/src/models/Category.js:76-84] |
| `server/tests/known-bugs/cascade.test.js` | Borrar un usuario borra sus gastos | Quedan huérfanos (`PRAGMA foreign_keys` → [NOT FOUND]) |

- No se usa `.skip` ni se debilitan para que pasen (`CLAUDE.md`).
- **Quedan fuera del comando de la Fase 2**, pero **sí** se ejecutan con `npm test`, que seguirá en rojo mientras los bugs existan. Esto es intencional.
- **Decisión abierta:** la alternativa es `test.failing` de Jest, que pasa mientras el bug exista y avisa cuando se corrige. Requiere aprobación porque cambia el significado de "verde".

### Fase 3: componentes clave del cliente

**Objetivo:** cubrir la lógica del client que decide qué se envía a la API y quién ve qué. Los contextos se **mockean** con `vi.mock`, para probar cada componente sin red.

| Archivo | Caso | Esperado | Evidencia |
|---|---|---|---|
| `client/src/components/forms/ExpenseForm.test.jsx` | Monto vacío y submit | Muestra `Amount is required`; `addExpense` no se llama | [evidencia: client/src/components/forms/ExpenseForm.jsx:44-45] [evidencia: client/src/components/forms/ExpenseForm.jsx:118-120] |
| | Monto `-5` y monto `0` | `Amount must be a positive number`; no se llama a la API | [evidencia: client/src/components/forms/ExpenseForm.jsx:46-47] |
| | Monto `1000000` | `Amount cannot exceed $999,999.99` | [evidencia: client/src/components/forms/ExpenseForm.jsx:48-49] |
| | Formulario válido | `addExpense` recibe `amount` como número y `categoryId` como entero | [evidencia: client/src/components/forms/ExpenseForm.jsx:126-133] |
| | Con prop `expense` (edición) | Llama a `updateExpense(expense.id, …)`, no a `addExpense` | [evidencia: client/src/components/forms/ExpenseForm.jsx:136-140] |
| `client/src/components/common/ProtectedRoute.test.jsx` | `loading: true` | Spinner | [evidencia: client/src/components/common/ProtectedRoute.jsx:8-10] |
| | Sin `token`, o con `token` pero sin `user` | Redirige a `/login` (dos casos) | [evidencia: client/src/components/common/ProtectedRoute.jsx:12-14] |
| | Con ambos | Renderiza `children` | [evidencia: client/src/components/common/ProtectedRoute.jsx:16] |
| `client/src/services/api.test.js` | Con `token` en `localStorage` | La petición lleva `Authorization: Bearer <token>`; sin token no lleva cabecera | [evidencia: client/src/services/api.js:13-20] |
| | Respuesta 401 | Borra `token` y navega a `/login`; un 400 no lo hace | [evidencia: client/src/services/api.js:27-35] |
| `client/src/pages/Login.test.jsx` | Email inválido | Error de campo; `login` no se llama | [evidencia: client/src/pages/Login.jsx:28-41] |
| | `error` en el contexto | Se muestra `login-error` | [evidencia: client/src/pages/Login.jsx:92-93] |
| `client/src/components/expenses/ExpenseList.test.jsx` | 2 gastos | 2 `expense-row` | [evidencia: client/src/components/expenses/ExpenseList.jsx:90] |
| | Lista vacía y `loading: false` | `No expenses found` | [evidencia: client/src/components/expenses/ExpenseList.jsx:48-53] |

Detalles de implementación:
- **`api.js`:** se prueba sustituyendo `api.defaults.adapter` por una función falsa. No se usan los internos `interceptors.handlers`. `window.location` se reemplaza con `Object.defineProperty`, porque jsdom no implementa la navegación.
- **`ExpenseList`:** jsdom no aplica CSS, así que se renderizan a la vez las filas de escritorio y las tarjetas de móvil. Las pruebas cuentan solo `expense-row` [ASSUMPTION: las dos vistas se ocultan con clases responsive, no con renderizado condicional].

---

## 3. Comandos y checks de mutación

### 3.1 Comandos exactos

| Fase | Comando | Debe terminar |
|---|---|---|
| 1 | `cd server && npx jest tests/integration/expenses.create tests/integration/expenses.validation tests/integration/expenses.auth` | Exit 0, 13 pruebas |
| 2 | `cd server && npx jest tests/integration/auth tests/unit/authUtils tests/integration/expenses.rules tests/integration/expenses.ownership tests/integration/categories` | Exit 0 |
| 2 (bugs conocidos) | `cd server && npx jest tests/known-bugs` | **Rojo** mientras los bugs existan (informativo, no es criterio de salida) |
| 3 | `cd client && npx vitest run` | Exit 0 |
| Todo el server | `npm test` (desde la raíz) | Rojo solo por `known-bugs` |

### 3.2 Procedimiento del check de mutación manual

Para cada mutación de la tabla de su fase:

1. Aplicar **una** mutación a mano en el archivo de producción indicado.
2. Correr el comando de la fase y confirmar que falla **la prueba esperada**, no otra por accidente.
3. Revertir con `git checkout -- <archivo>` y confirmar que el comando vuelve a verde.
4. Anotar el resultado (mutación → prueba que la detectó) en la descripción del PR de la fase.

Si una mutación **sobrevive** (todo sigue en verde), falta una prueba: se añade el caso y la fase no se cierra. Las mutaciones son temporales y nunca se commitean. No es "modificar producción para que una prueba pase".

### 3.3 Mutaciones por fase

**Fase 1**

| # | Mutación | Debe fallar |
|---|---|---|
| M1.1 | `expenseController.js:11`: `.positive()` → `.min(0)` | 2.d (monto 0) |
| M1.2 | `expenseController.js:11`: quitar `.required()` | 2.b (llega a la BD y responde 500 ≠ 400) |
| M1.3 | `routes/expenses.js:7`: comentar `router.use(authenticateToken)` | 3.a |
| M1.4 | `middleware/auth.js:16-18`: quitar el `if (!user)` | 3.c (500 ≠ 401) |
| M1.5 | `expenseController.js:144`: `201` → `200` | 1.a |
| M1.6 | `models/Expense.js` (consulta de listado, `:80-112`): quitar el filtro por `user_id` | 1.c |
| M1.7 | `utils/auth.js:15`: `jwt.verify(...)` → `jwt.decode(token)` | 3.e |

**Fase 2**

| # | Mutación | Debe fallar |
|---|---|---|
| M2.1 | `authController.js:7`: `.min(6)` → `.min(5)` | Password de 5 caracteres |
| M2.2 | `authController.js:31-34`: quitar la comprobación de email duplicado | Email duplicado (500 ≠ 400) |
| M2.3 | `authController.js:74`: `Invalid credentials` → `Wrong password` | Mismo mensaje en los dos 401 |
| M2.4 | `User.js:81-89`: añadir `passwordHash` a `toJSON` | Registro sin `passwordHash` |
| M2.5 | `expenseController.js:8`: quitar el `.custom(...)` de `dateOnly` | Fecha con hora guardada como `YYYY-MM-DD` |
| M2.6 | `expenseController.js:108-110`: quitar el check de `belongsToUser` | `GET` de un gasto ajeno → 403 |
| M2.7 | `Category.js:114`: `return true` | `PUT` de una categoría global → 403 |
| M2.8 | `expenseController.js:36`: `.max(100)` → `.max(1000)` | `limit=101` |

**Fase 3**

| # | Mutación | Debe fallar |
|---|---|---|
| M3.1 | `ExpenseForm.jsx:46`: `<= 0` → `< 0` | Monto 0 |
| M3.2 | `ExpenseForm.jsx:127`: quitar `parseFloat` | `amount` como número |
| M3.3 | `ProtectedRoute.jsx:12`: `!token \|\| !user` → `!token` | Token sin user → redirige |
| M3.4 | `api.js:30`: `401` → `403` | Respuesta 401 borra el token |
| M3.5 | `api.js:16-18`: quitar el `if (token)` | Sin token no hay cabecera |

---

## 4. Qué NO vamos a probar y por qué

| Qué | Por qué | Evidencia |
|---|---|---|
| CA-4 a CA-6 (presupuesto mensual) | La funcionalidad no existe. Se construye en clase con TDD a partir de la matriz (casos 4.a–6.c), escribiendo cada prueba **en rojo primero**. No encaja en fases de caracterización de código existente. | [evidencia: docs/prd/criterios-de-aceptacion.md:25] |
| E2E (caso 1.d y cualquier otro) | CA-1 ya queda cubierto a nivel API (1.a–1.b). Cypress no está instalado → [NOT FOUND] y exige levantar server y client. Se reevalúa al cerrar la Fase 3. | [evidencia: docs/testing/test-matrix.md:26] |
| `/api/reports/*` y la página Reports | Son stubs sin lógica | [evidencia: server/src/routes/reports.js:5-26] [evidencia: client/src/pages/Reports.jsx:10] |
| `AuthUtils.validateEmail/Password/Name` | Código muerto: los controllers validan con Joi | [evidencia: server/src/utils/auth.js:28-52] [evidencia: server/src/controllers/authController.js:5-15] |
| `server/src/config/database.js` (Knex), multer, subida de recibos | No se importan; no hay endpoint de subida | [evidencia: server/src/config/database.js:1-29] [evidencia: server/src/app.js:19] |
| `POST /api/auth/logout` | Solo responde 200, no tiene lógica | [evidencia: server/src/controllers/authController.js:102-105] |
| Migración de fechas epoch → `YYYY-MM-DD` | Solo afecta a BDs anteriores a `62890b8`. La regla vigente (guardar `YYYY-MM-DD`) sí se prueba en la Fase 2 (M2.5). | [evidencia: server/src/database/connection.js:54-62] |
| Reducers de `AuthContext` y `ExpenseContext` | No se exportan; probarlos de forma aislada exige exportarlos, que es un cambio en producción que requiere aviso previo. En la Fase 3 los contextos se mockean, así que **quedan sin cobertura**; es un hueco conocido. | [evidencia: client/src/context/AuthContext.jsx:13] [evidencia: client/src/context/ExpenseContext.jsx:31] |
| Componentes de presentación (`Navbar`, `Sidebar`, `Layout`, `LoadingSpinner`), estilos Tailwind | No tienen lógica de negocio; una prueba solo duplicaría el JSX | [evidencia: client/src/components/common/Layout.jsx:5-17] |
| CORS abierto, rate limiting, XSS por `localStorage` | Son riesgos de configuración o diseño (`docs/context.md` §9.2), no comportamientos que una prueba unit o de integración pueda fijar. El rate limiting no existe → [NOT FOUND]. | [evidencia: server/src/app.js:11] |
| Internos de Joi, bcrypt, jsonwebtoken, sqlite3 | Son librerías de terceros; se prueba nuestro uso, no su implementación | — |
| Vulnerabilidades de dependencias, rendimiento y carga | Fuera del alcance de pruebas funcionales; las vulnerabilidades se siguen con `npm audit` | `docs/context.md` §9.4 |
