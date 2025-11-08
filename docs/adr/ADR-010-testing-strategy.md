# ADR-010: Estrategia de Testing

**Estado**: Propuesto (Implementación Pendiente)

**Fecha**: 2025-11-05

**Autores**: Equipo de desarrollo ExpenseTracker

---

## Contexto

ExpenseTracker es un proyecto educativo diseñado para enseñar prácticas de documentación y testing. Actualmente, el framework de testing está configurado pero **no hay tests implementados**.

**Requisitos de testing:**

1. **Unit Tests**
   - Modelos de datos (User, Category, Expense)
   - Utility functions
   - Reducers (AuthContext, ExpenseContext)

2. **Integration Tests**
   - Endpoints de API REST
   - Flujos completos (register → login → create expense)
   - Middleware (authentication)

3. **Component Tests (Frontend)**
   - Componentes React individuales
   - Forms y validación
   - User interactions

4. **End-to-End Tests**
   - User flows críticos
   - Cross-browser testing
   - Mobile responsive

5. **Criterios de Calidad**
   - Coverage mínimo: 70-80%
   - Fast feedback (< 30 segundos)
   - Reliable (no flaky tests)
   - Fácil de escribir y mantener

**Contexto del proyecto:**
- Proyecto educativo → Tests serán escritos por estudiantes
- Frameworks ya configurados (Jest, Supertest)
- CI/CD pendiente de implementación

## Decisión

Decidimos implementar una **estrategia de testing piramidal** con las siguientes herramientas:

### Backend Testing

1. **Jest 29.7.0** - Test runner y assertion library
2. **Supertest 6.3.3** - HTTP integration testing
3. **SQLite in-memory** - Database testing

### Frontend Testing (Propuesto)

1. **Vitest** - Test runner compatible con Vite (alternativa a Jest)
2. **React Testing Library** - Component testing
3. **MSW (Mock Service Worker)** - API mocking

### E2E Testing (Propuesto)

1. **Playwright** - Cross-browser E2E testing

**Pirámide de Testing:**
```
         /\
        /  \  E2E Tests (10%)
       /────\
      /      \  Integration Tests (30%)
     /────────\
    /          \  Unit Tests (60%)
   /────────────\
```

**Evidencia en el código:**
- `/server/package.json:9,27-28` - Jest y Supertest configurados
- `/tests/` - Directorio vacío preparado para tests

## Consecuencias

### Positivas

1. **Confianza en Cambios**
   - Refactoring seguro
   - Regression prevention
   - Documentation as tests

2. **Developer Experience**
   - Fast feedback loop
   - Clear error messages
   - Watch mode para desarrollo

3. **Valor Educativo**
   - Estudiantes aprenden testing
   - Prácticas de industria
   - TDD/BDD patterns

4. **CI/CD Ready**
   - Automated testing en pipeline
   - Pull request validation
   - Deployment confidence

5. **Jest Ecosystem**
   - Snapshot testing
   - Coverage reports
   - Mocking utilities
   - Parallel execution

### Negativas

1. **Implementación Pendiente**
   - Actualmente: 0% coverage
   - Requiere tiempo significativo
   - **Plan**: Fase 5 del roadmap

2. **Learning Curve para Estudiantes**
   - Testing concepts nuevos
   - Mocking, spies, stubs
   - Async testing
   - **Mitigación**: Templates y ejemplos

3. **Mantenimiento de Tests**
   - Tests pueden quedar obsoletos
   - False positives/negatives
   - **Mitigación**: Regular review

4. **Tiempo de Ejecución**
   - Suite completa puede tardar
   - E2E tests son lentos
   - **Mitigación**: Parallelization

## Alternativas Consideradas

### 1. Mocha + Chai (Backend)

**Pros:**
- Flexible (BDD/TDD)
- Muchos reporters
- Plugins ecosystem

**Contras:**
- Más configuración que Jest
- No coverage built-in
- Menos opinado

**Razón de rechazo:** Jest es más completo out-of-the-box. Ya está configurado en el proyecto.

---

### 2. Vitest para Backend (en lugar de Jest)

**Pros:**
- Compatible con Vite
- Más rápido que Jest
- API compatible con Jest

**Contras:**
- Más nuevo (menos maduro)
- Jest ya configurado

**Decisión:** Considerar para frontend, mantener Jest en backend.

---

### 3. Cypress (E2E)

**Pros:**
- Developer experience excelente
- Time travel debugging
- Screenshots/videos automáticos

**Contras:**
- Chromium-only inicialmente
- Más lento que Playwright
- Flaky tests conocidos

**Razón de rechazo:** Playwright tiene mejor cross-browser support y es más rápido.

---

### 4. Enzyme (React Testing)

**Pros:**
- Testing de implementación
- Shallow rendering
- Enzyme matchers

**Contras:**
- Deprecated (no React 18 support)
- Testing implementation details
- No recomendado oficialmente

**Razón de rechazo:** React Testing Library es el estándar recomendado oficialmente.

## Implementación Propuesta

### Phase 1: Unit Tests (Backend Models)

**Prioridad:** Alta
**Esfuerzo:** 2-3 días
**Coverage objetivo:** Modelos 90%

**Ejemplo:**
```javascript
// tests/unit/models/User.test.js
const User = require('../../server/src/models/User')

describe('User Model', () => {
  beforeEach(async () => {
    // Setup in-memory database
    await setupTestDatabase()
  })

  afterEach(async () => {
    await teardownTestDatabase()
  })

  describe('create', () => {
    it('should create user with hashed password', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })

      expect(user.id).toBeDefined()
      expect(user.email).toBe('test@example.com')
      expect(user.passwordHash).not.toBe('password123') // Hashed
    })

    it('should throw error for duplicate email', async () => {
      await User.create({ email: 'test@example.com', password: 'pass' })

      await expect(
        User.create({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Email already exists')
    })
  })

  describe('validatePassword', () => {
    it('should return true for correct password', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123'
      })

      const isValid = await user.validatePassword('password123')
      expect(isValid).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123'
      })

      const isValid = await user.validatePassword('wrongpassword')
      expect(isValid).toBe(false)
    })
  })
})
```

---

### Phase 2: Integration Tests (API Endpoints)

**Prioridad:** Alta
**Esfuerzo:** 3-4 días
**Coverage objetivo:** Controllers 80%, Routes 100%

**Ejemplo:**
```javascript
// tests/integration/expenses.test.js
const request = require('supertest')
const app = require('../../server/server')
const { generateTestToken } = require('../helpers/auth')

describe('Expense API', () => {
  let authToken
  let userId

  beforeAll(async () => {
    await setupTestDatabase()
    const user = await createTestUser()
    userId = user.id
    authToken = generateTestToken(user)
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  describe('POST /api/expenses', () => {
    it('should create expense with valid data', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50.00,
          description: 'Lunch',
          category_id: 1,
          date: '2024-01-15'
        })

      expect(response.status).toBe(201)
      expect(response.body.expense).toMatchObject({
        amount: 50.00,
        description: 'Lunch',
        userId: userId
      })
    })

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          amount: 50.00,
          description: 'Lunch'
        })

      expect(response.status).toBe(401)
      expect(response.body.error).toBeDefined()
    })

    it('should return 400 with invalid data', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -50.00, // Invalid: negative
          description: ''
        })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/expenses', () => {
    it('should return user expenses', async () => {
      // Create test expenses
      await createTestExpense({ userId, amount: 50 })
      await createTestExpense({ userId, amount: 100 })

      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.expenses).toHaveLength(2)
    })

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/expenses?category_id=1')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.expenses.every(e => e.category_id === 1)).toBe(true)
    })
  })
})
```

---

### Phase 3: Component Tests (Frontend)

**Prioridad:** Media
**Esfuerzo:** 4-5 días
**Coverage objetivo:** Components 70%

**Setup:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

**Ejemplo:**
```javascript
// client/src/components/forms/ExpenseForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExpenseForm from './ExpenseForm'

describe('ExpenseForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('should render all form fields', () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/amount/i), '50.00')
    await userEvent.type(screen.getByLabelText(/description/i), 'Lunch')
    await userEvent.selectOptions(screen.getByLabelText(/category/i), '1')
    await userEvent.type(screen.getByLabelText(/date/i), '2024-01-15')

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 50.00,
        description: 'Lunch',
        category_id: 1,
        date: '2024-01-15'
      })
    })
  })

  it('should show validation error for negative amount', async () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} />)

    await userEvent.type(screen.getByLabelText(/amount/i), '-50')
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(/amount must be positive/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})
```

---

### Phase 4: E2E Tests

**Prioridad:** Baja
**Esfuerzo:** 3-4 días
**Coverage objetivo:** Critical paths

**Setup:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Ejemplo:**
```javascript
// tests/e2e/expense-flow.spec.js
const { test, expect } = require('@playwright/test')

test.describe('Expense Management Flow', () => {
  test('should allow user to create and view expense', async ({ page }) => {
    // 1. Navigate to login
    await page.goto('http://localhost:3000/login')

    // 2. Login
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // 3. Wait for dashboard
    await expect(page).toHaveURL('http://localhost:3000/')

    // 4. Navigate to expenses
    await page.click('text=Expenses')
    await expect(page).toHaveURL('http://localhost:3000/expenses')

    // 5. Click "Add Expense"
    await page.click('button:has-text("Add Expense")')

    // 6. Fill form
    await page.fill('input[name="amount"]', '50.00')
    await page.fill('input[name="description"]', 'Lunch at cafe')
    await page.selectOption('select[name="category"]', '1')
    await page.fill('input[name="date"]', '2024-01-15')

    // 7. Submit
    await page.click('button[type="submit"]')

    // 8. Verify expense appears in list
    await expect(page.locator('text=Lunch at cafe')).toBeVisible()
    await expect(page.locator('text=$50.00')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await loginAsUser(page)
    await page.goto('http://localhost:3000/expenses')

    await page.click('button:has-text("Add Expense")')
    await page.click('button[type="submit"]') // Submit empty form

    // Expect validation errors
    await expect(page.locator('text=Amount is required')).toBeVisible()
    await expect(page.locator('text=Description is required')).toBeVisible()
  })
})
```

## Test Helpers y Utilities

### Database Setup

```javascript
// tests/helpers/database.js
const sqlite3 = require('sqlite3')
const fs = require('fs')

let testDb

async function setupTestDatabase() {
  testDb = new sqlite3.Database(':memory:')

  const schema = fs.readFileSync('./server/src/database/schema.sql', 'utf8')
  await testDb.exec(schema)

  return testDb
}

async function teardownTestDatabase() {
  if (testDb) {
    await testDb.close()
  }
}

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
  getTestDb: () => testDb
}
```

### Auth Helpers

```javascript
// tests/helpers/auth.js
const jwt = require('jsonwebtoken')

function generateTestToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  )
}

async function createTestUser(overrides = {}) {
  const User = require('../../server/src/models/User')

  return await User.create({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    ...overrides
  })
}

module.exports = {
  generateTestToken,
  createTestUser
}
```

## CI/CD Integration

**GitHub Actions workflow:**
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm run install:all

      - name: Run linter
        run: |
          cd server && npm run lint
          cd ../client && npm run lint

      - name: Run backend tests
        run: cd server && npm test

      - name: Run frontend tests
        run: cd client && npm test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Coverage Goals

| Tipo | Objetivo | Crítico |
|------|----------|---------|
| Models | 90% | Sí |
| Controllers | 80% | Sí |
| Routes | 100% | Sí |
| Middleware | 90% | Sí |
| Components | 70% | No |
| Utils | 80% | Sí |
| **Overall** | **75%** | - |

## Referencias

1. [Jest Documentation](https://jestjs.io/docs/getting-started)
2. [Supertest Documentation](https://github.com/visionmedia/supertest)
3. [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
4. [Playwright Documentation](https://playwright.dev/)
5. [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Estado del ADR

Este ADR está **PROPUESTO** pero no implementado.

**Estado actual:** 0% test coverage

**Plan de implementación:**
- **Fase 5 (Roadmap)**: Implementar tests
- **Responsible**: Estudiantes como ejercicio de aprendizaje
- **Timeline**: 3-4 semanas

**Criterios de aceptación:**
- [ ] Unit tests para todos los modelos
- [ ] Integration tests para todos los endpoints
- [ ] Component tests para formularios críticos
- [ ] E2E tests para flujos principales
- [ ] CI/CD pipeline con tests automáticos
- [ ] Coverage ≥ 75%

**Bloqueadores:**
- Ninguno, frameworks configurados
- Requiere tiempo de desarrollo

---

**Última actualización**: 2025-11-05
