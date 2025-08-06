const Expense = require('../models/Expense');
const Category = require('../models/Category');
const Joi = require('joi');

const expenseSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  description: Joi.string().trim().min(1).max(255).required(),
  date: Joi.date().iso().required(),
  categoryId: Joi.number().integer().positive().required(),
  receiptFilename: Joi.string().trim().max(255).allow(null).optional(),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional(),
  notes: Joi.string().trim().max(1000).allow('').optional()
});

const updateExpenseSchema = Joi.object({
  amount: Joi.number().positive().precision(2).optional(),
  description: Joi.string().trim().min(1).max(255).optional(),
  date: Joi.date().iso().optional(),
  categoryId: Joi.number().integer().positive().optional(),
  receiptFilename: Joi.string().trim().max(255).allow(null).optional(),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional(),
  notes: Joi.string().trim().max(1000).allow('').optional()
});

const querySchema = Joi.object({
  category_id: Joi.number().integer().positive().optional(),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  search: Joi.string().trim().max(100).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort_by: Joi.string().valid('date', 'amount', 'description', 'created_at').default('date'),
  sort_order: Joi.string().valid('asc', 'desc').insensitive().default('desc')
});

class ExpenseController {
  static async getExpenses(req, res) {
    try {
      const { error, value } = querySchema.validate(req.query);
      if (error) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
      }

      const { 
        category_id, start_date, end_date, search, 
        page, limit, sort_by, sort_order 
      } = value;
      
      const offset = (page - 1) * limit;
      
      const options = {
        categoryId: category_id,
        startDate: start_date,
        endDate: end_date,
        search,
        limit,
        offset,
        sortBy: sort_by,
        sortOrder: sort_order
      };

      const [expenses, totalCount, totalAmount] = await Promise.all([
        Expense.findByUserId(req.user.id, options),
        Expense.countByUserId(req.user.id, options),
        Expense.getTotalByUserId(req.user.id, options)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        expenses: expenses.map(expense => expense.toJSON()),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        summary: {
          totalAmount,
          averageAmount: totalCount > 0 ? totalAmount / totalCount : 0
        }
      });
    } catch (error) {
      console.error('Get expenses error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getExpense(req, res) {
    try {
      const expenseId = parseInt(req.params.id);
      const expense = await Expense.findById(expenseId);
      
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      if (!expense.belongsToUser(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ 
        expense: expense.toJSON() 
      });
    } catch (error) {
      console.error('Get expense error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createExpense(req, res) {
    try {
      const { error, value } = expenseSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
      }

      // Verify category exists and user can access it
      const category = await Category.findById(value.categoryId);
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }

      // Check if user can use this category (either their own or default)
      if (category.userId !== null && category.userId !== req.user.id) {
        return res.status(400).json({ error: 'Cannot use this category' });
      }

      const expense = await Expense.create(value, req.user.id);
      
      res.status(201).json({
        message: 'Expense created successfully',
        expense: expense.toJSON()
      });
    } catch (error) {
      console.error('Create expense error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateExpense(req, res) {
    try {
      const expenseId = parseInt(req.params.id);
      const expense = await Expense.findById(expenseId);
      
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      if (!expense.belongsToUser(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { error, value } = updateExpenseSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
      }

      // If category is being updated, verify it exists and user can access it
      if (value.categoryId) {
        const category = await Category.findById(value.categoryId);
        if (!category) {
          return res.status(400).json({ error: 'Category not found' });
        }

        if (category.userId !== null && category.userId !== req.user.id) {
          return res.status(400).json({ error: 'Cannot use this category' });
        }
      }

      const updatedExpense = await expense.update(value);
      
      res.json({
        message: 'Expense updated successfully',
        expense: updatedExpense.toJSON()
      });
    } catch (error) {
      console.error('Update expense error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteExpense(req, res) {
    try {
      const expenseId = parseInt(req.params.id);
      const expense = await Expense.findById(expenseId);
      
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      if (!expense.belongsToUser(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await expense.delete();
      
      res.json({
        message: 'Expense deleted successfully'
      });
    } catch (error) {
      console.error('Delete expense error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getExpensesSummary(req, res) {
    try {
      const { category_id, start_date, end_date } = req.query;
      
      const options = {
        categoryId: category_id ? parseInt(category_id) : null,
        startDate: start_date,
        endDate: end_date
      };

      const [totalCount, totalAmount] = await Promise.all([
        Expense.countByUserId(req.user.id, options),
        Expense.getTotalByUserId(req.user.id, options)
      ]);

      res.json({
        summary: {
          totalExpenses: totalCount,
          totalAmount,
          averageAmount: totalCount > 0 ? totalAmount / totalCount : 0
        }
      });
    } catch (error) {
      console.error('Get expenses summary error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ExpenseController;