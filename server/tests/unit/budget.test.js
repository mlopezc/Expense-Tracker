// CA-4, CA-5, CA-6: monthly budget per category (TDD, feature not built yet).
//
// Expected interface (to be implemented in src/services/budgetService.js):
//
//   getBudgetStatus(budget, expenses, month) -> { spent, remaining, status }
//
//   budget   { categoryId: number, amount: number }
//   expenses [{ amount: number, date: 'YYYY-MM-DD', categoryId: number }]
//            (same fields as Expense#toJSON)
//   month    'YYYY-MM', the reference month. Passed in instead of read from
//            the clock so results do not depend on when the tests run.
//
//   spent     sum of the expenses of budget.categoryId within `month`
//   remaining budget.amount - spent, rounded to cents, never below 0
//   status    'ok' while spent < budget.amount, 'excedido' from budget.amount on
const { getBudgetStatus } = require('../../src/services/budgetService');

const FOOD = 1;
const TRANSPORT = 2;
const OCTOBER = '2026-10';

const foodBudget = { categoryId: FOOD, amount: 100 };

function expense(amount, date, categoryId = FOOD) {
  return { amount, date, categoryId };
}

describe('CA-4 · presupuesto con margen', () => {
  it('4.a gastado 80 de 100 → ok, restante 20', () => {
    const expenses = [expense(50, '2026-10-05'), expense(30, '2026-10-20')];

    const result = getBudgetStatus(foodBudget, expenses, OCTOBER);

    expect(result).toMatchObject({ spent: 80, remaining: 20, status: 'ok' });
  });

  it('4.b frontera decimal: gastado 99.99 de 100 → ok, restante 0.01 exacto', () => {
    const expenses = [expense(99.99, '2026-10-10')];

    const result = getBudgetStatus(foodBudget, expenses, OCTOBER);

    // 100 - 99.99 in plain floating point is 0.010000000000005116.
    expect(result).toMatchObject({ spent: 99.99, remaining: 0.01, status: 'ok' });
  });

  it('4.d solo cuentan los gastos de la categoría del presupuesto', () => {
    const expenses = [
      expense(80, '2026-10-05', FOOD),
      expense(500, '2026-10-06', TRANSPORT),
    ];

    const result = getBudgetStatus(foodBudget, expenses, OCTOBER);

    expect(result).toMatchObject({ spent: 80, remaining: 20, status: 'ok' });
  });
});

describe('CA-5 · presupuesto excedido', () => {
  it('5.a gastado exactamente 100 de 100 → excedido, restante 0', () => {
    const expenses = [expense(60, '2026-10-02'), expense(40, '2026-10-25')];

    const result = getBudgetStatus(foodBudget, expenses, OCTOBER);

    expect(result).toMatchObject({ spent: 100, remaining: 0, status: 'excedido' });
  });

  it('5.b gastado 130 de 100 → excedido, restante 0 (nunca negativo)', () => {
    const expenses = [expense(100, '2026-10-02'), expense(30, '2026-10-25')];

    const result = getBudgetStatus(foodBudget, expenses, OCTOBER);

    expect(result).toMatchObject({ spent: 130, remaining: 0, status: 'excedido' });
  });
});

describe('CA-6 · solo cuenta el mes de referencia', () => {
  it('6.a los gastos de septiembre no cuentan para octubre', () => {
    const expenses = [expense(60, '2026-09-15'), expense(80, '2026-10-15')];

    const result = getBudgetStatus(foodBudget, expenses, OCTOBER);

    expect(result).toMatchObject({ spent: 80, remaining: 20, status: 'ok' });
  });

  it('6.b fronteras: cuentan el 1 y el 31 de octubre, no el 30-sep ni el 1-nov', () => {
    const expenses = [
      expense(10, '2026-09-30'),
      expense(20, '2026-10-01'),
      expense(30, '2026-10-31'),
      expense(40, '2026-11-01'),
    ];

    const result = getBudgetStatus(foodBudget, expenses, OCTOBER);

    expect(result).toMatchObject({ spent: 50, remaining: 50, status: 'ok' });
  });
});
