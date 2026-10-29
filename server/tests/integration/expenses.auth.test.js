// CA-3: without valid authentication the API answers 401 and stores nothing.
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const AuthUtils = require('../../src/utils/auth');
const { useTestDatabase } = require('../helpers/db');
const { registerUser, getCategoryId } = require('../helpers/auth');

const database = useTestDatabase();

const NON_EXISTENT_USER_ID = 999999;

async function validBody() {
  // A registered user is only needed to look the global category up.
  const { token } = await registerUser(app);
  const categoryId = await getCategoryId(app, token, 'Food & Dining');
  return { amount: 25.5, description: 'Almuerzo', date: '2026-10-15', categoryId };
}

async function countExpenses() {
  const row = await database.get('SELECT COUNT(*) AS count FROM expenses');
  return row.count;
}

describe('CA-3 · usuario no autenticado', () => {
  it('3.a sin cabecera Authorization → 401', async () => {
    const body = await validBody();

    const res = await request(app).post('/api/expenses').send(body);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access token required');
  });

  it('3.b con un token inválido → 401', async () => {
    const body = await validBody();

    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', 'Bearer token-invalido')
      .send(body);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid token');
  });

  it('3.c con un JWT válido de un usuario inexistente → 401', async () => {
    const body = await validBody();
    const token = AuthUtils.generateToken(NON_EXISTENT_USER_ID);

    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not found');
  });

  it('3.e con un JWT de un usuario real firmado con otro secreto → 401', async () => {
    const { user } = await registerUser(app);
    const body = await validBody();
    const forgedToken = jwt.sign({ userId: user.id }, 'otro-secreto');

    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${forgedToken}`)
      .send(body);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid token');
  });

  it('3.d ningún intento no autenticado guarda el gasto', async () => {
    const body = await validBody();
    const before = await countExpenses();

    await request(app).post('/api/expenses').send(body);
    await request(app)
      .post('/api/expenses')
      .set('Authorization', 'Bearer token-invalido')
      .send(body);
    await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${AuthUtils.generateToken(NON_EXISTENT_USER_ID)}`)
      .send(body);

    expect(await countExpenses()).toBe(before);
  });
});
