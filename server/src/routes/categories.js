const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');

// All category routes require authentication
router.use(authenticateToken);

// GET /api/categories
router.get('/', CategoryController.getCategories);

// GET /api/categories/:id
router.get('/:id', CategoryController.getCategory);

// GET /api/categories/:id/stats
router.get('/:id/stats', CategoryController.getCategoryStats);

// POST /api/categories
router.post('/', CategoryController.createCategory);

// PUT /api/categories/:id
router.put('/:id', CategoryController.updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;