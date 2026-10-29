// Expense validation rules beyond CA-2 (Phase 2 of docs/testing/test-plan.md).
// The first two cases started as known bugs found during the Phase 1 mutation
// check (2026-10-28) and were fixed in expenseController.js.
const request = require('supertest');
const app = require('../../src/app');
const { useTestDatabase } = require('../helpers/db');
const { registerUser, getCategoryId } = require('../helpers/auth');

useTestDatabase();

async function setupUser() {
  const { token } = await registerUser(app);
  const categoryId = await getCategoryId(app, token, 'Food & Dining');
  const validBody = { amount: 25.5, description: 'Almuerzo', date: '2026-10-15', categoryId };
  return { token, validBody };
}

function postExpense(token, body) {
  return request(app)
    .post('/api/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send(body);
}

async function countExpenses(token) {
  const res = await request(app)
    .get('/api/expenses')
    .set('Authorization', `Bearer ${token}`);
  return res.body.pagination.totalCount;
}

describe('Reglas de gastos · fechas de calendario inexistentes', () => {
  // Joi.date() rolls 2026-02-30 over to 2026-03-02; the stored text must not
  // be an impossible date.
  it('rechaza date "2026-02-30" con 400 y no la guarda', async () => {
    const { token, validBody } = await setupUser();

    const res = await postExpense(token, { ...validBody, date: '2026-02-30' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(await countExpenses(token)).toBe(0);
  });
});

describe('Reglas de gastos · monto máximo', () => {
  // The client caps amounts at 999,999.99; the server enforces the same limit.
  it('rechaza amount 1e12 con 400 y no lo guarda', async () => {
    const { token, validBody } = await setupUser();

    const res = await postExpense(token, { ...validBody, amount: 1e12 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(await countExpenses(token)).toBe(0);
  });
});
