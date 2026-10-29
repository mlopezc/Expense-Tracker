// CA-2: an authenticated user sending a negative or empty amount gets a
// validation error (400) and nothing is stored.
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

function withoutAmount(body) {
  const copy = { ...body };
  delete copy.amount;
  return copy;
}

function expectAmountValidationError(res) {
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Validation error');
  expect(res.body.details.join(' ')).toMatch(/amount/);
}

describe('CA-2 · monto inválido', () => {
  it('2.a monto negativo → 400', async () => {
    const { token, validBody } = await setupUser();

    const res = await postExpense(token, { ...validBody, amount: -10 });

    expectAmountValidationError(res);
  });

  it('2.b monto ausente → 400', async () => {
    const { token, validBody } = await setupUser();

    const res = await postExpense(token, withoutAmount(validBody));

    expectAmountValidationError(res);
  });

  it('2.c monto como cadena vacía → 400', async () => {
    const { token, validBody } = await setupUser();

    const res = await postExpense(token, { ...validBody, amount: '' });

    expectAmountValidationError(res);
  });

  it('2.d monto 0 (frontera) → 400', async () => {
    const { token, validBody } = await setupUser();

    const res = await postExpense(token, { ...validBody, amount: 0 });

    expectAmountValidationError(res);
  });

  it('2.e ningún monto inválido llega a guardarse', async () => {
    const { token, validBody } = await setupUser();

    await postExpense(token, { ...validBody, amount: -10 });
    await postExpense(token, withoutAmount(validBody));
    await postExpense(token, { ...validBody, amount: '' });
    await postExpense(token, { ...validBody, amount: 0 });

    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.pagination.totalCount).toBe(0);
  });
});
