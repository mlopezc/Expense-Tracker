const Category = require('../models/Category');
const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(500).allow('').optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required(),
  icon: Joi.string().trim().max(50).required()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional(),
  description: Joi.string().trim().max(500).allow('').optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: Joi.string().trim().max(50).optional()
});

class CategoryController {
  static async getCategories(req, res) {
    try {
      const includeDefaults = req.query.include_defaults !== 'false';
      const categories = await Category.findByUserId(req.user.id, includeDefaults);
      
      res.json({
        categories: categories.map(category => category.toJSON())
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getCategory(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Check if user can access this category
      if (category.userId !== null && category.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ 
        category: category.toJSON() 
      });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createCategory(req, res) {
    try {
      const { error, value } = categorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
      }

      const category = await Category.create(value, req.user.id);
      
      res.status(201).json({
        message: 'Category created successfully',
        category: category.toJSON()
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateCategory(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      if (!category.canBeModifiedBy(req.user.id)) {
        return res.status(403).json({ error: 'Cannot modify this category' });
      }

      const { error, value } = updateCategorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
      }

      const updatedCategory = await category.update(value);
      
      res.json({
        message: 'Category updated successfully',
        category: updatedCategory.toJSON()
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      if (!category.canBeModifiedBy(req.user.id)) {
        return res.status(403).json({ error: 'Cannot delete this category' });
      }

      await category.delete();
      
      res.json({
        message: 'Category deleted successfully'
      });
    } catch (error) {
      if (error.message.includes('Cannot delete category that is being used')) {
        return res.status(400).json({ error: error.message });
      }
      
      console.error('Delete category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getCategoryStats(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Check if user can access this category
      if (category.userId !== null && category.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const expenseCount = await category.getExpenseCount();
      
      res.json({
        category: category.toJSON(),
        stats: {
          expenseCount
        }
      });
    } catch (error) {
      console.error('Get category stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = CategoryController;