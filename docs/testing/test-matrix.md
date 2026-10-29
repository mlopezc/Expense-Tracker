# Matriz de pruebas · CA-1 a CA-6

> Generada el 2026-10-28 a partir de `docs/context.md`, `docs/prd/criterios-de-aceptacion.md` y el código (HEAD `56f3438`).
> Convenciones (ver `CLAUDE.md`): `[evidencia: ruta:línea]`, `[ASSUMPTION: motivo]`, `[NOT FOUND]`.
> Este documento **no** contiene pruebas; solo define qué probar, a qué nivel y dónde.

---

## 1. Frameworks por paquete

| Paquete | Framework elegido | Justificación | Evidencia |
|---|---|---|---|
| `server/` (unit + integración) | **Jest 29 + supertest** | Ya están instalados y `npm test` ya ejecuta Jest; no hace falta añadir dependencias. El server es CommonJS, así que Jest funciona sin transformaciones. `app.js` se exporta sin abrir la BD ni escuchar, listo para supertest. La BD admite `:memory:`. Vitest no aporta nada aquí: el server no usa Vite. | [evidencia: server/package.json:10] [evidencia: server/package.json:28-29] [evidencia: server/src/app.js:1] [evidencia: server/src/app.js:6-8] [evidencia: server/src/database/connection.js:12-14] |
| `client/` (unit / componentes) | **Vitest** (no instalado) | El client se construye con Vite 5 y es ESM; Vitest reutiliza `vite.config.js` (plugin React incluido) sin configuración extra. Hoy no hay framework ni script `test` → [NOT FOUND]. **Ningún caso de esta matriz necesita este nivel** (ver §3), así que no es requisito todavía. | [evidencia: client/package.json:4] [evidencia: client/package.json:6-12] [evidencia: client/package.json:27] [evidencia: client/vite.config.js:1-6] |
| E2E | **Cypress** (no instalado) | No hay herramienta E2E → [NOT FOUND]. Se propone Cypress [ASSUMPTION: `CLAUDE.md` menciona `cy.wait(ms)` en sus reglas de pruebas, lo que sugiere que es la herramienta prevista]. La UI ya expone `data-testid` estables. | [evidencia: CLAUDE.md "Reglas de pruebas"] [evidencia: docs/prd/criterios-de-aceptacion.md:45-53] |

---

## 2. Matriz

| Criterio | Caso de prueba | Nivel | Archivo de prueba propuesto | Datos necesarios |
|---|---|---|---|---|
| **CA-1** | **1.a** `POST /api/expenses` con token válido y `{ amount: 25.5, description, date: "2026-10-15", categoryId }` → 201; el cuerpo trae `expense` con `id`, `amount` 25.5, `date` "2026-10-15" y `categoryId` correctos | Integración | `server/tests/integration/expenses.create.test.js` | Usuario registrado vía `POST /api/auth/register` → `token`; `categoryId` de "Food & Dining" buscado por nombre en `GET /api/categories` (no fijar el id); BD `:memory:` |
| **CA-1** | **1.b** Tras 1.a, `GET /api/expenses` con el mismo token → la lista `expenses` contiene el gasto creado (mismo `id`) y `pagination.totalCount` = 1 | Integración | `server/tests/integration/expenses.create.test.js` | Mismos datos que 1.a; BD limpia por suite |
| **CA-1** | **1.c** Aislamiento: el gasto de 1.a **no** aparece en `GET /api/expenses` de un segundo usuario | Integración | `server/tests/integration/expenses.create.test.js` | Dos usuarios registrados con sus tokens |
| **CA-1** | **1.d** *(smoke, complementario)* Login → `add-expense-button` → completar `expense-amount`, `expense-date`, `expense-description`, `expense-category` → `expense-submit` → aparece un `expense-row` con la descripción | E2E | `cypress/e2e/register-expense.cy.js` ✅ | Usuario demo (`npm run seed:demo`) o creado por API en `before`; server y client levantados; descripción única por ejecución |
| **CA-2** | **2.a** `POST /api/expenses` con `amount: -10` → 400, `error: "Validation error"` y `details` menciona `amount` | Integración | `server/tests/integration/expenses.validation.test.js` | Usuario + token; `categoryId` válido; resto de campos válidos |
| **CA-2** | **2.b** `amount` ausente del cuerpo → 400 con `details` sobre `amount` | Integración | `server/tests/integration/expenses.validation.test.js` | Ídem 2.a sin `amount` |
| **CA-2** | **2.c** `amount: ""` (cadena vacía, lo que envía un input vacío) → 400 | Integración | `server/tests/integration/expenses.validation.test.js` | Ídem 2.a con `amount: ""` |
| **CA-2** | **2.d** Frontera: `amount: 0` → 400 (Joi `positive()` excluye el 0) | Integración | `server/tests/integration/expenses.validation.test.js` | Ídem 2.a con `amount: 0` |
| **CA-2** | **2.e** "No se guarda": después de 2.a–2.d, `GET /api/expenses` del usuario → `pagination.totalCount` = 0 | Integración | `server/tests/integration/expenses.validation.test.js` | Usuario sin gastos previos |
| **CA-3** | **3.a** `POST /api/expenses` **sin** cabecera `Authorization` y cuerpo válido → 401 `"Access token required"` | Integración | `server/tests/integration/expenses.auth.test.js` | Cuerpo de gasto válido; `categoryId` de una categoría global |
| **CA-3** | **3.b** Con `Authorization: Bearer token-invalido` → 401 `"Invalid token"` | Integración | `server/tests/integration/expenses.auth.test.js` | Ídem 3.a |
| **CA-3** | **3.c** Con un JWT bien firmado de un `userId` inexistente → 401 `"User not found"` | Integración | `server/tests/integration/expenses.auth.test.js` | Token generado con `AuthUtils.generateToken(9999)` y el mismo `JWT_SECRET` |
| **CA-3** | **3.e** JWT de un usuario **existente** firmado con otro secreto → 401 `"Invalid token"` (añadido tras el check de mutación de la Fase 1: sin este caso, cambiar `jwt.verify` por `jwt.decode` no hacía fallar ninguna prueba) | Integración | `server/tests/integration/expenses.auth.test.js` | Usuario registrado; token firmado con `jsonwebtoken` y un secreto distinto de `JWT_SECRET` |
| **CA-3** | **3.d** "No se guarda": tras 3.a–3.c, la tabla `expenses` sigue vacía (consulta directa `SELECT COUNT(*) FROM expenses` con `database.get`) | Integración | `server/tests/integration/expenses.auth.test.js` | Acceso al singleton `database` |
| **CA-4** | **4.a** Presupuesto 100, gastado 80 → `{ status: "ok", remaining: 20 }` | Unit | `server/tests/unit/budget.test.js` | Valores literales; sin BD |
| **CA-4** | **4.b** Frontera decimal: presupuesto 100, gastado 99.99 → `{ status: "ok", remaining: 0.01 }` (exacto, sin error de coma flotante) | Unit | `server/tests/unit/budget.test.js` | Valores literales |
| **CA-4** | **4.d** Solo cuentan los gastos de la categoría del presupuesto: 80 de "Food & Dining" + 500 de otra categoría en el mismo mes → `spent: 80`, `status: "ok"`, `remaining: 20` (sale de la redacción de CA-4: "los gastos de 'Food & Dining' del mes") | Unit | `server/tests/unit/budget.test.js` | Gastos de dos categorías en 2026-10 |
| **CA-4** | **4.c** Endpoint de estado: presupuesto 100 para "Food & Dining" en 2026-10 + gastos del mes que suman 80 (p. ej. 50 + 30) → respuesta con `status: "ok"`, `remaining: 20` | Integración | `server/tests/integration/budgets.test.js` | Usuario + token; presupuesto creado por API; 2 gastos en 2026-10; fecha de referencia fija |
| **CA-5** | **5.a** Presupuesto 100, gastado exactamente 100 → `{ status: "excedido", remaining: 0 }` | Unit | `server/tests/unit/budget.test.js` | Valores literales |
| **CA-5** | **5.b** Presupuesto 100, gastado 130 → `{ status: "excedido", remaining: 0 }` (nunca −30) | Unit | `server/tests/unit/budget.test.js` | Valores literales |
| **CA-6** | **6.a** Con gastos de "Food & Dining" en 2026-09 (60) y 2026-10 (80), el gastado de 2026-10 es 80 → `status: "ok"`, `remaining: 20` | Unit | `server/tests/unit/budget.test.js` | Lista de gastos en memoria con fechas `YYYY-MM-DD`; mes de referencia `"2026-10"` |
| **CA-6** | **6.b** Fronteras de mes: gastos el `2026-09-30` y el `2026-11-01` no cuentan; el `2026-10-01` y el `2026-10-31` sí | Unit | `server/tests/unit/budget.test.js` | Gastos en esas cuatro fechas |
| **CA-6** | **6.c** La consulta real a SQLite excluye otros meses: con gastos de "Food & Dining" en 2026-09 y 2026-10 creados por API, el endpoint de estado del presupuesto de 2026-10 solo suma los de octubre | Integración | `server/tests/integration/budgets.test.js` | Usuario + token; gastos en 2 meses; fecha de referencia fija (no `new Date()`) |

---

## 3. Por qué cada nivel (pirámide)

- **CA-1 a CA-3 → integración.** La lógica a verificar (esquema Joi, middleware JWT, persistencia) no se puede probar en unit sin tocar código de producción: `expenseSchema` no se exporta [evidencia: server/src/controllers/expenseController.js:10-18] y la autenticación vive en un middleware montado en el router [evidencia: server/src/routes/expenses.js:7]. Exportar el esquema solo para probarlo sería modificar producción, y `CLAUDE.md` exige avisar antes. Con supertest sobre `app.js` + SQLite `:memory:` se verifica el criterio completo (código HTTP + que se guarda o no) en milisegundos.
  - Códigos y mensajes esperados: 400 `Validation error` [evidencia: server/src/controllers/expenseController.js:123-129]; 401 por token ausente, inválido o usuario inexistente [evidencia: server/src/middleware/auth.js:9-25]; 201 al crear [evidencia: server/src/controllers/expenseController.js:144-147]; lista en `expenses` con `pagination.totalCount` [evidencia: server/src/controllers/expenseController.js:78-87].
- **CA-1.d → un solo E2E.** "Aparece en su lista" ya lo verifica 1.b a nivel API. El E2E es un smoke complementario de la cadena UI → context → API, que ninguna otra prueba cubre. Si se quiere una pirámide estricta, se puede omitir sin dejar el criterio sin cubrir.
- **CA-2 en el client: no se incluye.** `ExpenseForm` ya rechaza montos vacíos o ≤ 0 antes de enviar [evidencia: client/src/components/forms/ExpenseForm.jsx:44-47]. El criterio, sin embargo, habla del error de la API (400) [evidencia: docs/prd/criterios-de-aceptacion.md:14]. Una prueba de componente con Vitest sería un extra, no lo que exige el criterio.
- **CA-4 a CA-6 → unit primero.** El cálculo de estado y restante y el filtrado por mes son lógica pura: se prueban sin BD ni HTTP. Se añade **una** prueba de integración por criterio con datos reales (4.c, 6.c), porque el filtrado por mes probablemente terminará en SQL y la prueba unit no lo cubriría [ASSUMPTION: diseño aún no existe].
- **Casos de error con caso propio:** CA-2 (2.a negativo, 2.b ausente, 2.c vacío, 2.d cero) y CA-3 (3.a sin token, 3.b token inválido, 3.c usuario inexistente) tienen un caso por variante.

---

## 4. Datos y entorno compartidos

| Necesidad | Cómo | Evidencia |
|---|---|---|
| BD aislada | `SQLITE_DB_PATH=:memory:` y `await database.connect()` en `beforeAll` (crea el esquema y siembra las categorías globales); `database.close()` en `afterAll` | [evidencia: server/src/database/connection.js:12-14] [evidencia: server/src/database/connection.js:42-72] |
| Sin logs HTTP | `NODE_ENV=test` | [evidencia: server/src/app.js:12-14] |
| `JWT_SECRET` definido | Fijarlo en el entorno de prueba (no tiene valor por defecto) | [evidencia: server/src/utils/auth.js:10] |
| Usuario autenticado | `POST /api/auth/register` devuelve `token` | [evidencia: server/src/controllers/authController.js:40-45] |
| Categoría "Food & Dining" | Global sembrada; buscar su id por nombre | [evidencia: server/src/database/seed.sql:3] |
| Datos multi-mes para E2E | `npm run seed:demo` crea gastos de "Food & Dining" en el mes actual y los 2 anteriores | [evidencia: server/src/database/seed-demo.js:18-32] |
| Selectores E2E | `login-*`, `add-expense-button`, `expense-*`, `expense-row` | [evidencia: docs/prd/criterios-de-aceptacion.md:49-53] |

**Infraestructura que falta (no es código de producción):** un `jest.config.js` o un `setupFiles` que fije `NODE_ENV`, `SQLITE_DB_PATH` y `JWT_SECRET` → hoy [NOT FOUND]. Cypress y su configuración → [NOT FOUND].

---

## 5. Decisiones abiertas y advertencias

1. **"Comida" vs "Food & Dining".** Los criterios que se recibieron dicen "Comida", pero el PRD (fuente de verdad) y la semilla usan "Food & Dining" [evidencia: docs/prd/criterios-de-aceptacion.md:28] [evidencia: server/src/database/seed.sql:3]. La matriz usa "Food & Dining". No existe ninguna categoría "Comida".
2. **CA-4 a CA-6 aún no tienen API ni módulo.** No hay nada de presupuestos en el repo [evidencia: docs/prd/criterios-de-aceptacion.md:25]. Los nombres siguientes son propuestas para TDD y son [ASSUMPTION: diseño no definido]:
   - Una función pura (p. ej. `server/src/services/budgetService.js`) que reciba presupuesto, gastos y mes de referencia.
   - Un endpoint de estado (p. ej. `GET /api/budgets/status?month=YYYY-MM`).
3. **Fecha de referencia inyectable.** Con "mes actual" calculado con `new Date()`, las pruebas fallarían al cambiar de mes o cerca de medianoche UTC. La propuesta es que la función reciba el mes (`"2026-10"`) o usar `jest.useFakeTimers().setSystemTime(...)`.
4. **"Exactamente 100 → excedido".** CA-5 dice "100 o más". Por tanto, 100 no es "ok" aunque el restante sea 0. El caso 5.a fija esa regla; si producto quería otra cosa, hay que corregir el criterio, no la prueba.
5. **Montos decimales.** `amount` es `DECIMAL(10,2)` en el esquema [evidencia: server/src/database/schema.sql:29], pero en JS es `number`. El caso 4.b obliga a que el cálculo del restante no arrastre errores de coma flotante (p. ej. trabajar en centavos o redondear a 2 decimales).
