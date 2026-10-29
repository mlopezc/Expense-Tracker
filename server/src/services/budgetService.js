// Monthly budget per category.
//
// Money is handled in integer cents so that values like 100 - 99.99 do not
// pick up floating point noise; results are converted back to units.

const BUDGET_STATUS = {
  OK: 'ok',
  EXCEEDED: 'excedido'
};

const toCents = (amount) => Math.round(amount * 100);
const fromCents = (cents) => cents / 100;

// Expense dates are stored as 'YYYY-MM-DD', so the month is the first 7 chars.
const isInMonth = (expense, month) => expense.date.slice(0, 7) === month;

const sumCents = (expenses) =>
  expenses.reduce((total, expense) => total + toCents(expense.amount), 0);

function getBudgetStatus(budget, expenses, month) {
  const countedExpenses = expenses.filter(
    (expense) => expense.categoryId === budget.categoryId && isInMonth(expense, month)
  );

  const limitCents = toCents(budget.amount);
  const spentCents = sumCents(countedExpenses);
  const remainingCents = Math.max(limitCents - spentCents, 0);
  const isExceeded = spentCents >= limitCents;

  return {
    spent: fromCents(spentCents),
    remaining: fromCents(remainingCents),
    status: isExceeded ? BUDGET_STATUS.EXCEEDED : BUDGET_STATUS.OK
  };
}

module.exports = { getBudgetStatus, BUDGET_STATUS };
