// Seeds a demo user with expenses spread over the current and the two
// previous months, so reports, filters and E2E tests have data to work with.
// Usage (from server/): npm run seed:demo
// Running it again resets the demo user's expenses.
require('dotenv').config();

const database = require('./connection');
const User = require('../models/User');
const Expense = require('../models/Expense');

const DEMO_USER = {
  email: 'demo@expense-tracker.dev',
  password: 'demo1234',
  firstName: 'Demo',
  lastName: 'User'
};

// [monthsAgo, day, amount, description, category name]
const DEMO_EXPENSES = [
  [0, 2, 45.5, 'Supermercado semanal', 'Food & Dining'],
  [0, 5, 18.0, 'Almuerzo con el equipo', 'Food & Dining'],
  [0, 9, 16.5, 'Café y pan', 'Food & Dining'],
  [0, 3, 30.0, 'Gasolina', 'Transportation'],
  [0, 6, 62.0, 'Internet y teléfono', 'Bills & Utilities'],
  [0, 8, 12.99, 'Streaming', 'Entertainment'],
  [1, 3, 52.25, 'Supermercado semanal', 'Food & Dining'],
  [1, 14, 27.8, 'Cena', 'Food & Dining'],
  [1, 10, 35.0, 'Gasolina', 'Transportation'],
  [1, 12, 89.9, 'Zapatos', 'Shopping'],
  [1, 20, 40.0, 'Farmacia', 'Healthcare'],
  [1, 25, 62.0, 'Internet y teléfono', 'Bills & Utilities'],
  [2, 4, 48.75, 'Supermercado semanal', 'Food & Dining'],
  [2, 15, 120.0, 'Curso en línea', 'Education'],
  [2, 18, 210.0, 'Hotel fin de semana', 'Travel'],
  [2, 22, 9.5, 'Varios', 'Other']
];

function isoDate(monthsAgo, day) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function seedDemo() {
  await database.connect();

  let user = await User.findByEmail(DEMO_USER.email);
  if (!user) {
    user = await User.create(DEMO_USER);
  }
  await database.run('DELETE FROM expenses WHERE user_id = ?', [user.id]);

  const categories = await database.all('SELECT id, name FROM categories WHERE is_default = 1');
  const categoryId = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  for (const [monthsAgo, day, amount, description, category] of DEMO_EXPENSES) {
    await Expense.create({
      amount,
      description,
      date: isoDate(monthsAgo, day),
      categoryId: categoryId[category]
    }, user.id);
  }

  console.log(`Demo user: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  console.log(`Demo expenses created: ${DEMO_EXPENSES.length}`);
  await database.close();
}

seedDemo().catch((error) => {
  console.error('Demo seed failed:', error);
  process.exit(1);
});
