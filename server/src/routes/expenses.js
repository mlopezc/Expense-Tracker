const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');
const { authenticateToken } = require('../middleware/auth');

// All expense routes require authentication
router.use(authenticateToken);

// GET /api/expenses
router.get('/', ExpenseController.getExpenses);

// GET /api/expenses/summary
router.get('/summary', ExpenseController.getExpensesSummary);

// GET /api/expenses/:id
router.get('/:id', ExpenseController.getExpense);

// POST /api/expenses
router.post('/', ExpenseController.createExpense);

// PUT /api/expenses/:id
router.put('/:id', ExpenseController.updateExpense);

// DELETE /api/expenses/:id
router.delete('/:id', ExpenseController.deleteExpense);

module.exports = router;