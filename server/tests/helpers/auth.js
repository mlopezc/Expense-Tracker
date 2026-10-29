const request = require('supertest');

let userCounter = 0;

// Registers a brand-new user through the API so each test owns its data.
async function registerUser(app, overrides = {}) {
  userCounter += 1;
  const payload = {
    email: `user${userCounter}.${Date.now()}@test.dev`,
    password: 'secret123',
    firstName: 'Test',
    lastName: 'User',
    ...overrides,
  };

  const res = await request(app).post('/api/auth/register').send(payload);
  if (res.status !== 201) {
    throw new Error(`registerUser failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return { token: res.body.token, user: res.body.user };
}

// Looks a category up by name so tests never hard-code seeded ids.
async function getCategoryId(app, token, name) {
  const res = await request(app)
    .get('/api/categories')
    .set('Authorization', `Bearer ${token}`);
  const category = res.body.categories.find((c) => c.name === name);
  if (!category) {
    throw new Error(`Category "${name}" not found`);
  }
  return category.id;
}

module.exports = { registerUser, getCategoryId };
