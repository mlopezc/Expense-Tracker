# Flujo de datos de un gasto

> Desde que se captura en el cliente hasta que se guarda y se muestra en un reporte.
> Fuente: `docs/context.md` y código en HEAD `56f3438`. Convenciones de `CLAUDE.md`: `[evidencia: ruta:línea]`, `[ASSUMPTION: motivo]`, `[NOT FOUND]`.
> Nombres compartidos con `c4-context.md` y `c4-container.md`: **Usuario**, **Cliente React (SPA)**, **localStorage del navegador**, **API Express**, **Base de datos SQLite**. Dentro de cada contenedor se muestran sus componentes (archivos reales).

**Importante:** la pantalla Reports y los endpoints `/api/reports/*` son stubs [evidencia: client/src/pages/Reports.jsx:10] [evidencia: server/src/routes/reports.js:5-26]. Hoy el gasto solo se "reporta" en la lista de Expenses (total y conteo) y en el Dashboard (tarjetas de resumen, mes actual/anterior, top categorías). El diagrama termina ahí y marca Reports como no implementado.

```plantuml
@startuml data-flow
title Expense Tracker — Flujo de datos de un gasto

autonumber
actor "Usuario" as usuario

box "Cliente React (SPA)" #EEF4FF
  participant "ExpenseForm" as form
  participant "Expenses (página)" as expenses_page
  participant "Dashboard (página)" as dashboard
  participant "Reports (página)" as reports_page
  participant "ExpenseContext" as ctx
  participant "api.js (axios)" as axios
end box

database "localStorage del navegador" as local_storage

box "API Express" #EEFFEE
  participant "authenticateToken" as auth_mw
  participant "ExpenseController" as controller
  participant "Category / Expense (models)" as models
  participant "Database (connection.js)" as dbconn
end box

database "Base de datos SQLite" as db

== 1. Captura ==
usuario -> form : llena monto, descripción, fecha,\ncategoría, notas y tags; envía
form -> form : validateForm()\nmonto > 0 y <= 999999.99, descripción 1..255, fecha requerida
form -> ctx : addExpense({ amount: parseFloat, description, date: "YYYY-MM-DD",\ncategoryId: parseInt, notes, tags })
ctx -> axios : post('/expenses', expenseData)
axios -> local_storage : getItem('token')
local_storage --> axios : JWT

== 2. Guardado ==
axios -> auth_mw : POST /api/expenses\nAuthorization: Bearer <JWT>
auth_mw -> models : User.findById(decoded.userId)
alt token ausente, inválido o usuario inexistente
  auth_mw --> axios : 401
  axios -> local_storage : removeItem('token')
  axios --> usuario : redirige a /login
else token válido
  auth_mw -> controller : createExpense(req) con req.user
  controller -> controller : expenseSchema.validate (Joi)\ndate se recorta a YYYY-MM-DD
  alt validación falla
    controller --> axios : 400 { error, details }
  else
    controller -> models : Category.findById(categoryId)
    models -> dbconn : get(SELECT ...)
    dbconn -> db : SELECT categories
    alt categoría inexistente o de otro usuario
      controller --> axios : 400
    else categoría global o propia
      controller -> models : Expense.create(value, req.user.id)
      models -> dbconn : run(INSERT INTO expenses ..., tags como JSON)
      dbconn -> db : INSERT
      db --> dbconn : lastID
      models -> dbconn : get(SELECT e.* ... LEFT JOIN categories)
      dbconn -> db : SELECT
      db --> models : fila + category_name/color/icon
      controller --> axios : 201 { message, expense: toJSON() }
    end
  end
end
axios --> ctx : response.data.expense
ctx -> ctx : dispatch ADD_EXPENSE
ctx --> form : { success: true }
form -> expenses_page : onSuccess()

== 3. Consulta y visualización ==
expenses_page -> ctx : fetchExpenses()  (handleFormSuccess)
ctx -> axios : get('/expenses', { params: page, limit, filtros })
axios -> auth_mw : GET /api/expenses + Bearer
auth_mw -> controller : getExpenses(req)
controller -> controller : querySchema.validate (Joi)
controller -> models : findByUserId / countByUserId / getTotalByUserId\n(Promise.all)
models -> dbconn : all / get
dbconn -> db : SELECT ... LIMIT/OFFSET, COUNT(*), SUM(amount)
db --> controller : filas, conteo, total
controller --> axios : 200 { expenses, pagination, summary: { totalAmount, averageAmount } }
axios --> ctx : response.data
ctx -> ctx : dispatch SET_EXPENSES
ctx --> expenses_page : expenses, pagination, summary
expenses_page --> usuario : "Total: $X • N expenses" + ExpenseList

usuario -> dashboard : abre /
dashboard -> ctx : fetchExpenses({ limit: 5 })
note right of dashboard
  Mismo camino GET /api/expenses (pasos anteriores).
  Tarjetas Total Spent / Avg per Expense: summary del servidor.
  This Month / Last Month / Top Categories: se calculan
  en el cliente solo con los 5 gastos recibidos.
end note
ctx --> dashboard : expenses, summary, pagination
dashboard -> dashboard : calculateDashboardStats()
dashboard --> usuario : resumen y gastos recientes

usuario -> reports_page : abre /reports
reports_page --> usuario : "Reports and analytics interface coming soon..."
note right of reports_page
  [NOT FOUND] reporte real: la página no llama a la API
  y /api/reports/* solo devuelve un mensaje "to be implemented".
end note
@enduml
```

![Flujo de datos de un gasto en Expense Tracker](img/data-flow.png)

> Imagen generada con `plantuml -tpng -o img docs/diagrams/*.md`. Si cambias el bloque PlantUML, vuelve a generarla.

## Elementos

| Elemento | Contenedor | Rol en el flujo | Evidencia |
|---|---|---|---|
| Usuario | — | Captura el gasto y consulta resultados | [evidencia: client/src/pages/Expenses.jsx:78-84] |
| ExpenseForm | Cliente React (SPA) | Validación local | [evidencia: client/src/components/forms/ExpenseForm.jsx:41-71] |
| ExpenseForm | Cliente React (SPA) | Arma `expenseData` y llama a `addExpense` | [evidencia: client/src/components/forms/ExpenseForm.jsx:115-139] |
| ExpenseForm | Cliente React (SPA) | Fecha por defecto en `YYYY-MM-DD` | [evidencia: client/src/components/forms/ExpenseForm.jsx:9] |
| ExpenseContext | Cliente React (SPA) | `addExpense`: POST y `ADD_EXPENSE` | [evidencia: client/src/context/ExpenseContext.jsx:133-143] |
| ExpenseContext | Cliente React (SPA) | `fetchExpenses`: GET y `SET_EXPENSES` | [evidencia: client/src/context/ExpenseContext.jsx:108-131] |
| ExpenseContext | Cliente React (SPA) | Reducer guarda `expenses`, `pagination`, `summary` | [evidencia: client/src/context/ExpenseContext.jsx:39-64] |
| api.js (axios) | Cliente React (SPA) | Base URL e interceptor `Bearer` | [evidencia: client/src/services/api.js:3-20] |
| api.js (axios) | Cliente React (SPA) | 401 → borra token y redirige a `/login` | [evidencia: client/src/services/api.js:27-35] |
| localStorage del navegador | (contenedor propio) | Origen del token | [evidencia: client/src/services/api.js:15] |
| authenticateToken | API Express | Verifica JWT y carga `req.user`; 401 si falla | [evidencia: server/src/middleware/auth.js:4-25] |
| authenticateToken | API Express | Aplicado a todo el router de gastos | [evidencia: server/src/routes/expenses.js:7] |
| ExpenseController | API Express | `createExpense`: Joi + categoría permitida + 201 | [evidencia: server/src/controllers/expenseController.js:121-152] |
| ExpenseController | API Express | Esquema y recorte de fecha a `YYYY-MM-DD` | [evidencia: server/src/controllers/expenseController.js:5-18] |
| ExpenseController | API Express | `getExpenses`: filtros, paginación y `summary` | [evidencia: server/src/controllers/expenseController.js:42-92] |
| Category / Expense (models) | API Express | `Category.findById` para validar acceso | [evidencia: server/src/controllers/expenseController.js:132-140] |
| Category / Expense (models) | API Express | `Expense.create` (INSERT, tags como JSON) y relectura | [evidencia: server/src/models/Expense.js:28-45] |
| Category / Expense (models) | API Express | `findById` con `LEFT JOIN categories` | [evidencia: server/src/models/Expense.js:47-56] |
| Category / Expense (models) | API Express | `findByUserId` / `countByUserId` / `getTotalByUserId` | [evidencia: server/src/models/Expense.js:58-116] [evidencia: server/src/models/Expense.js:118-119] [evidencia: server/src/models/Expense.js:149-152] |
| Category / Expense (models) | API Express | `toJSON` en camelCase con `category` | [evidencia: server/src/models/Expense.js:209-224] |
| Database (connection.js) | API Express | Envoltorios con promesas `run/get/all` | [evidencia: server/src/database/connection.js:78-112] |
| Base de datos SQLite | (contenedor propio) | Tabla `expenses` | [evidencia: server/src/database/schema.sql:27-41] |
| Expenses (página) | Cliente React (SPA) | `handleFormSuccess` refresca la lista | [evidencia: client/src/pages/Expenses.jsx:53-57] |
| Expenses (página) | Cliente React (SPA) | Muestra total y conteo | [evidencia: client/src/pages/Expenses.jsx:73-75] |
| Dashboard (página) | Cliente React (SPA) | Pide solo 5 gastos | [evidencia: client/src/pages/Dashboard.jsx:25] |
| Dashboard (página) | Cliente React (SPA) | Calcula mes actual/anterior y top categorías en el cliente | [evidencia: client/src/pages/Dashboard.jsx:36-90] |
| Dashboard (página) | Cliente React (SPA) | Tarjetas con `summary` del servidor | [evidencia: client/src/pages/Dashboard.jsx:140] [evidencia: client/src/pages/Dashboard.jsx:186] |
| Reports (página) | Cliente React (SPA) | Stub "coming soon" | [evidencia: client/src/pages/Reports.jsx:10] |
| `/api/reports/*` | API Express | Stubs con `TODO` | [evidencia: server/src/routes/reports.js:5-26] |

## Observaciones del flujo

- **Dashboard con datos parciales:** "This Month", "Last Month" y "Top Categories" se calculan sobre los 5 gastos que pide el Dashboard, no sobre todos [evidencia: client/src/pages/Dashboard.jsx:25] [evidencia: client/src/pages/Dashboard.jsx:44-75]. En cambio, "Total Spent" y "Avg per Expense" usan el `summary` del servidor, que cubre todos los gastos del usuario [evidencia: server/src/controllers/expenseController.js:70-74]. [ASSUMPTION: probablemente no es intencional; no se encontró documentación que lo explique].
- **Archivos adjuntos:** el formulario no envía `receiptFilename` [evidencia: client/src/components/forms/ExpenseForm.jsx:126-133], así que en este flujo no interviene **Almacenamiento de archivos (uploads)**.
- **URL de la API:** sin `VITE_API_URL`, axios llama directo a `http://localhost:3001/api` y no usa el proxy de Vite [evidencia: client/src/services/api.js:3] [evidencia: client/vite.config.js:11-16].
