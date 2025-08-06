const database = require('../database/connection');

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.color = data.color;
    this.icon = data.icon;
    this.userId = data.user_id;
    this.isDefault = Boolean(data.is_default);
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(categoryData, userId = null) {
    const { name, description, color, icon, isDefault = false } = categoryData;
    
    const query = `
      INSERT INTO categories (name, description, color, icon, user_id, is_default)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await database.run(query, [
        name, description, color, icon, userId, isDefault ? 1 : 0
      ]);
      return await Category.findById(result.id);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = ?';
    const categoryData = await database.get(query, [id]);
    return categoryData ? new Category(categoryData) : null;
  }

  static async findByUserId(userId, includeDefaults = true) {
    let query = '';
    let params = [];
    
    if (includeDefaults) {
      query = `
        SELECT * FROM categories 
        WHERE user_id = ? OR user_id IS NULL
        ORDER BY is_default DESC, name ASC
      `;
      params = [userId];
    } else {
      query = `
        SELECT * FROM categories 
        WHERE user_id = ?
        ORDER BY name ASC
      `;
      params = [userId];
    }
    
    const categoriesData = await database.all(query, params);
    return categoriesData.map(categoryData => new Category(categoryData));
  }

  static async findDefaults() {
    const query = 'SELECT * FROM categories WHERE is_default = 1 AND user_id IS NULL ORDER BY name';
    const categoriesData = await database.all(query);
    return categoriesData.map(categoryData => new Category(categoryData));
  }

  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY is_default DESC, name ASC';
    const categoriesData = await database.all(query);
    return categoriesData.map(categoryData => new Category(categoryData));
  }

  async update(updateData) {
    const { name, description, color, icon } = updateData;
    const query = `
      UPDATE categories 
      SET name = ?, description = ?, color = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await database.run(query, [name, description, color, icon, this.id]);
    
    // Refresh the instance
    const updated = await Category.findById(this.id);
    Object.assign(this, updated);
    return this;
  }

  async delete() {
    // Check if this category is being used by any expenses
    const expenseQuery = 'SELECT COUNT(*) as count FROM expenses WHERE category_id = ?';
    const result = await database.get(expenseQuery, [this.id]);
    
    if (result.count > 0) {
      throw new Error('Cannot delete category that is being used by expenses');
    }

    const query = 'DELETE FROM categories WHERE id = ?';
    await database.run(query, [this.id]);
  }

  async getExpenseCount() {
    const query = 'SELECT COUNT(*) as count FROM expenses WHERE category_id = ?';
    const result = await database.get(query, [this.id]);
    return result.count;
  }

  canBeModifiedBy(userId) {
    // Default categories (user_id is null) can only be viewed, not modified
    // User categories can only be modified by their owner
    return this.userId === userId;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      color: this.color,
      icon: this.icon,
      userId: this.userId,
      isDefault: this.isDefault,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Category;