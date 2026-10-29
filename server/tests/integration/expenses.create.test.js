// CA-1: an authenticated user registers a valid expense and it shows up in
// their own expense list (and nobody else's).
const request = require('supertest');
const app = require('../../src/app');
const { useTestDatabase } = require('../helpers/db');
const { registerUser, getCategoryId } = require('../helpers/auth');

useTestDatabase();

async function createExpense(token, categoryId) {
  return request(app)
    .post('/api/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send({
      amount: 25.5,
      description: 'Almuerzo',
      date: '2026-10-15',
      categoryId,
    });
}

describe('CA-1 · registrar un gasto válido', () => {
  it('1.a responde 201 con el gasto guardado', async () => {
    const { token, user } = await registerUser(app);
    const categoryId = await getCategoryId(app, token, 'Food & Dining');

    const res = await createExpense(token, categoryId);

    expect(res.status).toBe(201);
    expect(res.body.expense).toMatchObject({
      id: expect.any(Number),
      amount: 25.5,
      description: 'Almuerzo',
      date: '2026-10-15',
      categoryId,
      userId: user.id,
    });
  });

  it('1.b el gasto creado aparece en GET /api/expenses del mismo usuario', async () => {
    const { token } = await registerUser(app);
    const categoryId = await getCategoryId(app, token, 'Food & Dining');
    const created = await createExpense(token, categoryId);

    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination.totalCount).toBe(1);
    expect(res.body.expenses.map((e) => e.id)).toEqual([created.body.expense.id]);
  });

  it('1.c el gasto no aparece en la lista de otro usuario', async () => {
    const owner = await registerUser(app);
    const other = await registerUser(app);
    const categoryId = await getCategoryId(app, owner.token, 'Food & Dining');
    await createExpense(owner.token, categoryId);

    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${other.token}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination.totalCount).toBe(0);
    expect(res.body.expenses).toEqual([]);
  });
});
