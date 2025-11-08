# ADR-006: Arquitectura MVC en Backend

**Estado**: Aceptado

**Fecha**: 2024-11 (Estimado según análisis de código)

**Autores**: Equipo de desarrollo ExpenseTracker

---

## Contexto

El backend de ExpenseTracker necesita una estructura de código que proporcione:

1. **Separación de Responsabilidades**
   - Lógica de negocio separada de acceso a datos
   - Routing separado de processing
   - Presentación separada de persistencia

2. **Mantenibilidad**
   - Código fácil de localizar
   - Changes aislados a una capa
   - Testing independiente de capas

3. **Escalabilidad**
   - Fácil agregar nuevos endpoints
   - Reutilización de código
   - Múltiples desarrolladores sin conflictos

4. **Curva de Aprendizaje**
   - Pattern familiar y estándar
   - Estructura predecible
   - Navegación intuitiva del código

El proyecto es educativo, por lo que patterns claros y establecidos son preferibles sobre arquitecturas novedosas.

## Decisión

Decidimos implementar el patrón **Model-View-Controller (MVC) adaptado para APIs REST**, con la siguiente estructura:

**Capas:**

1. **Models** (`/server/src/models/`) - Capa de datos
   - Encapsulan acceso a base de datos
   - Validación de datos
   - Business logic relacionada con entidades
   - Active Record pattern

2. **Controllers** (`/server/src/controllers/`) - Capa de lógica
   - Request handling
   - Validación de input
   - Orquestación de models
   - Response formatting

3. **Routes** (`/server/src/routes/`) - Capa de enrutamiento
   - Definición de endpoints
   - Mapeo HTTP methods → controller methods
   - Middleware application

4. **Middleware** (`/server/src/middleware/`) - Cross-cutting concerns
   - Authentication
   - Error handling
   - Logging
   - Validation

**Nota**: En APIs REST, no hay "View" tradicional (HTML rendering). El "View" es el JSON response format.

**Evidencia en el código:**
- `/server/src/models/*` - User.js, Category.js, Expense.js
- `/server/src/controllers/*` - authController.js, categoryController.js, expenseController.js
- `/server/src/routes/*` - auth.js, categories.js, expenses.js, reports.js
- `/server/src/middleware/*` - auth.js

```
server/src/
├── models/              # Data layer
│   ├── User.js
│   ├── Category.js
│   └── Expense.js
├── controllers/         # Business logic layer
│   ├── authController.js
│   ├── categoryController.js
│   └── expenseController.js
├── routes/              # Routing layer
│   ├── auth.js
│   ├── categories.js
│   ├── expenses.js
│   └── reports.js
└── middleware/          # Cross-cutting
    └── auth.js
```

## Consecuencias

### Positivas

1. **Separación Clara de Responsabilidades**
   - Models: Solo acceso a datos
   - Controllers: Solo lógica de negocio
   - Routes: Solo routing
   - Fácil localizar dónde hacer cambios

2. **Testabilidad Excelente**
   - Models testables independientemente (unit tests)
   - Controllers testables con models mockeados
   - Routes testables con controllers mockeados
   - Integration tests claros

3. **Mantenibilidad**
   - Estructura predecible
   - Nuevos developers encuentran código rápidamente
   - Changes aislados a una capa
   - Merge conflicts reducidos

4. **Escalabilidad de Código**
   - Fácil agregar nuevos recursos (model + controller + routes)
   - Reutilización de models en múltiples controllers
   - Reutilización de controllers en múltiples routes
   - Middleware compartido

5. **Pattern Estándar**
   - MVC es conocido universalmente
   - Muchos recursos y tutoriales
   - Transferible a otros frameworks
   - Ideal para proyecto educativo

6. **DRY (Don't Repeat Yourself)**
   - Model methods reutilizables (findById, create, etc.)
   - Middleware compartido (auth en múltiples routes)
   - Utility functions centralizadas

7. **RESTful API Natural**
   - Mapeo directo de recursos a models
   - CRUD operations claras
   - HTTP verbs → controller methods

### Negativas

1. **Boilerplate Moderado**
   - Cada recurso requiere 3 archivos (model, controller, routes)
   - Setup inicial más largo
   - Algunos archivos pueden ser pequeños
   - **Mitigación**: Generators/templates para scaffolding

2. **Overhead para APIs Simples**
   - Algunos endpoints son pass-through simple
   - Controller puede parecer redundante
   - **Impacto**: Mínimo, la consistencia vale la pena

3. **No Hay Separación Controller/Service**
   - Business logic mezclada con orchestration
   - Para lógica compleja, puede volverse grande
   - **Mitigación futura**: Capa Service si controllers crecen

4. **Acoplamiento Model-Database**
   - Models acceden directamente a database
   - No hay Repository layer separado
   - **Impacto**: Aceptable para este proyecto

5. **Fat Models Possible**
   - Models pueden crecer con mucha lógica
   - Active Record pattern puede ser antipattern en apps grandes
   - **Mitigación**: Refactor a Service layer si es necesario

## Alternativas Consideradas

### 1. Layered Architecture (Controller-Service-Repository)

**Estructura:**
```
├── controllers/    # HTTP handling
├── services/       # Business logic
├── repositories/   # Data access
└── models/         # Data structures (DTOs)
```

**Pros:**
- Separación aún más granular
- Business logic completamente aislada
- Testabilidad máxima
- Repository abstrae database completamente

**Contras:**
- Mucho más boilerplate (4 capas)
- Overkill para API simple
- Más archivos que mantener
- Indirection puede confundir a principiantes

**Razón de rechazo:** Complejidad excesiva para el alcance del proyecto. MVC es suficiente y más simple de entender para proyecto educativo.

---

### 2. Vertical Slice Architecture

**Estructura:**
```
├── features/
│   ├── expenses/
│   │   ├── create-expense.js
│   │   ├── list-expenses.js
│   │   └── delete-expense.js
│   └── auth/
│       ├── login.js
│       └── register.js
```

**Pros:**
- Cada feature es self-contained
- Menos coupling entre features
- Fácil localizar código para una funcionalidad
- Escalable para microservicios

**Contras:**
- Menos familiar que MVC
- Duplicación de código entre features
- Difícil compartir utilities
- No es pattern estándar enseñado

**Razón de rechazo:** Menos familiar para estudiantes. MVC es más estándar en industria y educación.

---

### 3. Functional/Procedural (Flat Structure)

**Estructura:**
```
├── handlers/
│   ├── expenses.js      # All expense handlers
│   ├── categories.js    # All category handlers
│   └── auth.js          # All auth handlers
```

**Pros:**
- Muy simple
- Menos archivos
- Menos indirection
- Rápido de escribir

**Contras:**
- No separa responsabilidades
- Archivos se vuelven grandes
- Difícil testear
- No reutilización de lógica
- No escalable

**Razón de rechazo:** No escala bien. A medida que proyecto crece, archivos se vuelven inmanejables.

---

### 4. Domain-Driven Design (DDD)

**Estructura:**
```
├── domain/
│   ├── expense/
│   │   ├── expense.entity.js
│   │   ├── expense.repository.js
│   │   ├── expense.service.js
│   │   └── expense.aggregate.js
│   └── user/
```

**Pros:**
- Muy apropiado para dominios complejos
- Encapsulación máxima
- Business logic en entidades
- Escalabilidad extrema

**Contras:**
- Muy complejo para API simple
- Curva de aprendizaje empinada
- Mucho más código
- Overkill para CRUD simple

**Razón de rechazo:** Complejidad absurda para este dominio simple. DDD brilla en dominios complejos con muchas reglas de negocio.

---

### 5. CQRS (Command Query Responsibility Segregation)

**Estructura:**
```
├── commands/       # Write operations
│   ├── create-expense.js
│   └── update-expense.js
├── queries/        # Read operations
│   ├── get-expenses.js
│   └── get-expense-by-id.js
```

**Pros:**
- Separa reads de writes
- Optimización independiente
- Escalabilidad (read/write databases separados)

**Contras:**
- Complejidad alta
- Duplicación de código
- Overkill para mayoría de aplicaciones
- Difícil justificar sin requirements específicos

**Razón de rechazo:** Innecesariamente complejo. No hay requisitos de separar read/write models.

## Notas de Implementación

### Flujo de Request

```
HTTP Request
    ↓
Express Router (/server/server.js)
    ↓
Route Handler (/server/src/routes/expenses.js)
    ↓
Middleware Chain (/server/src/middleware/auth.js)
    ↓
Controller Method (/server/src/controllers/expenseController.js)
    ↓
Model Methods (/server/src/models/Expense.js)
    ↓
Database (SQLite)
    ↓
Response back up the chain
```

### Ejemplo Completo: Create Expense

**1. Route Definition**
```javascript
// server/src/routes/expenses.js
const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const expenseController = require('../controllers/expenseController')

const router = express.Router()

router.use(authenticateToken)  // Apply middleware
router.post('/', expenseController.createExpense)  // Map to controller

module.exports = router
```

**2. Controller Logic**
```javascript
// server/src/controllers/expenseController.js
const Expense = require('../models/Expense')
const Joi = require('joi')

const createExpense = async (req, res) => {
  try {
    // 1. Validate input
    const schema = Joi.object({
      amount: Joi.number().positive().required(),
      description: Joi.string().required(),
      category_id: Joi.number().required(),
      date: Joi.date().required()
    })

    const { error, value } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    // 2. Create via model
    const expense = await Expense.create({
      ...value,
      user_id: req.user.id  // From auth middleware
    })

    // 3. Format response
    res.status(201).json({
      message: 'Expense created successfully',
      expense: expense.toJSON()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { createExpense }
```

**3. Model Data Access**
```javascript
// server/src/models/Expense.js
const database = require('../database/connection')

class Expense {
  static async create(expenseData) {
    const { amount, description, category_id, user_id, date } = expenseData

    const query = `
      INSERT INTO expenses (amount, description, category_id, user_id, date)
      VALUES (?, ?, ?, ?, ?)
    `

    const result = await database.run(query, [
      amount, description, category_id, user_id, date
    ])

    return await Expense.findById(result.id)
  }

  static async findById(id) {
    const query = 'SELECT * FROM expenses WHERE id = ?'
    const expenseData = await database.get(query, [id])
    return expenseData ? new Expense(expenseData) : null
  }

  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      description: this.description,
      categoryId: this.category_id,
      userId: this.user_id,
      date: this.date,
      createdAt: this.created_at
    }
  }
}

module.exports = Expense
```

### Naming Conventions

**Files:**
- Models: `User.js`, `Expense.js` (PascalCase, singular)
- Controllers: `authController.js`, `expenseController.js` (camelCase + Controller)
- Routes: `auth.js`, `expenses.js` (lowercase, plural for resources)
- Middleware: `auth.js`, `validation.js` (lowercase, descriptive)

**Functions:**
- Controllers: `createExpense`, `getExpenses`, `updateExpense` (verb + noun)
- Models: `static create`, `static findById`, `update` (CRUD verbs)

### Error Handling Pattern

```javascript
// Controller pattern
const controllerMethod = async (req, res) => {
  try {
    // Validation
    if (!req.body.field) {
      return res.status(400).json({ error: 'Field required' })
    }

    // Business logic
    const result = await Model.operation()

    // Success response
    res.status(200).json({ data: result })
  } catch (error) {
    // Error response
    console.error('Error in controllerMethod:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

### Testing Strategy

**Unit Tests - Models:**
```javascript
describe('Expense Model', () => {
  test('create should insert expense into database', async () => {
    const expense = await Expense.create({
      amount: 50.00,
      description: 'Test expense',
      category_id: 1,
      user_id: 1,
      date: '2024-01-01'
    })

    expect(expense.id).toBeDefined()
    expect(expense.amount).toBe(50.00)
  })
})
```

**Integration Tests - Controllers:**
```javascript
const request = require('supertest')
const app = require('../server')

describe('POST /api/expenses', () => {
  test('should create expense', async () => {
    const response = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        amount: 50.00,
        description: 'Lunch',
        category_id: 1,
        date: '2024-01-01'
      })

    expect(response.status).toBe(201)
    expect(response.body.expense).toBeDefined()
  })
})
```

## Estructura de Archivos Detallada

```
server/
├── src/
│   ├── models/                    # Data layer
│   │   ├── User.js               # 91 lines
│   │   ├── Category.js           # ~80 lines
│   │   └── Expense.js            # ~100 lines
│   │
│   ├── controllers/               # Business logic layer
│   │   ├── authController.js     # Login, register, logout
│   │   ├── categoryController.js # CRUD categories
│   │   └── expenseController.js  # CRUD expenses
│   │
│   ├── routes/                    # Routing layer
│   │   ├── auth.js               # POST /login, /register, /logout
│   │   ├── categories.js         # GET, POST, PUT, DELETE /categories
│   │   ├── expenses.js           # GET, POST, PUT, DELETE /expenses
│   │   └── reports.js            # GET /reports/*
│   │
│   ├── middleware/                # Cross-cutting concerns
│   │   └── auth.js               # authenticateToken, optionalAuth
│   │
│   ├── utils/                     # Utilities
│   │   └── auth.js               # generateToken, verifyToken
│   │
│   ├── config/                    # Configuration
│   │   └── database.js
│   │
│   └── database/                  # Database setup
│       ├── connection.js
│       ├── schema.sql
│       └── seed.sql
│
└── server.js                      # Entry point, Express setup
```

## Métricas del Código

| Capa | Archivos | Lines of Code | Responsabilidad |
|------|----------|---------------|-----------------|
| Models | 3 | ~270 | Data access |
| Controllers | 3 | ~400 | Business logic |
| Routes | 4 | ~120 | Routing |
| Middleware | 1 | ~50 | Auth |
| **Total** | **11** | **~840** | Backend logic |

## Referencias

1. [MVC Pattern - Microsoft Docs](https://dotnet.microsoft.com/apps/aspnet/mvc)
2. [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
3. [Node.js REST API Design](https://www.restapitutorial.com/)
4. [User.js](/server/src/models/User.js) - Example model
5. [expenseController.js](/server/src/controllers/expenseController.js) - Example controller
6. [expenses.js](/server/src/routes/expenses.js) - Example routes

## Estado del ADR

Este ADR está **ACEPTADO** y ha demostrado ser efectivo:

**Beneficios observados:**
- Código fácil de navegar
- Onboarding rápido de nuevos developers
- Testing straightforward
- Cambios localizados a una capa

**Posibles mejoras futuras:**
1. **Service Layer** - Si controllers crecen > 200 líneas
2. **Repository Pattern** - Si queremos abstraer database completamente
3. **DTO Layer** - Para transformación de datos compleja

**Umbral de refactoring**:
- Controllers > 300 líneas → Extraer Service layer
- Models con mucha lógica → Repository pattern
- Duplicación entre controllers → Shared services

Por ahora: **No refactor needed**. La arquitectura es apropiada para el tamaño actual del proyecto.

---

**Última actualización**: 2025-11-05
