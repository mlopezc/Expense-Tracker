const database = require('../database/connection');

class Expense {
  constructor(data) {
    this.id = data.id;
    this.amount = parseFloat(data.amount);
    this.description = data.description;
    this.date = data.date;
    this.categoryId = data.category_id;
    this.userId = data.user_id;
    this.receiptFilename = data.receipt_filename;
    this.tags = data.tags ? JSON.parse(data.tags) : [];
    this.notes = data.notes;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    
    // If category data is joined
    if (data.category_name) {
      this.category = {
        id: data.category_id,
        name: data.category_name,
        color: data.category_color,
        icon: data.category_icon
      };
    }
  }

  static async create(expenseData, userId) {
    const { amount, description, date, categoryId, receiptFilename, tags = [], notes } = expenseData;
    
    const query = `
      INSERT INTO expenses (amount, description, date, category_id, user_id, receipt_filename, tags, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await database.run(query, [
        amount, description, date, categoryId, userId, receiptFilename, 
        JSON.stringify(tags), notes
      ]);
      return await Expense.findById(result.id);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
    `;
    const expenseData = await database.get(query, [id]);
    return expenseData ? new Expense(expenseData) : null;
  }

  static async findByUserId(userId, options = {}) {
    const { 
      categoryId, 
      startDate, 
      endDate, 
      search, 
      limit = 50, 
      offset = 0,
      sortBy = 'date',
      sortOrder = 'DESC'
    } = options;
    
    let query = `
      SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
    `;
    
    const params = [userId];
    
    // Add filters
    if (categoryId) {
      query += ' AND e.category_id = ?';
      params.push(categoryId);
    }
    
    if (startDate) {
      query += ' AND e.date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND e.date <= ?';
      params.push(endDate);
    }
    
    if (search) {
      query += ' AND (e.description LIKE ? OR e.notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Add sorting
    const validSortFields = ['date', 'amount', 'description', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY e.${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ' ORDER BY e.date DESC';
    }
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const expensesData = await database.all(query, params);
    return expensesData.map(expenseData => new Expense(expenseData));
  }

  static async countByUserId(userId, options = {}) {
    const { categoryId, startDate, endDate, search } = options;
    
    let query = 'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?';
    const params = [userId];
    
    // Add filters (same as findByUserId)
    if (categoryId) {
      query += ' AND category_id = ?';
      params.push(categoryId);
    }
    
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    
    if (search) {
      query += ' AND (description LIKE ? OR notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const result = await database.get(query, params);
    return result.count;
  }

  static async getTotalByUserId(userId, options = {}) {
    const { categoryId, startDate, endDate, search } = options;
    
    let query = 'SELECT SUM(amount) as total FROM expenses WHERE user_id = ?';
    const params = [userId];
    
    // Add filters (same as findByUserId)
    if (categoryId) {
      query += ' AND category_id = ?';
      params.push(categoryId);
    }
    
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    
    if (search) {
      query += ' AND (description LIKE ? OR notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const result = await database.get(query, params);
    return parseFloat(result.total) || 0;
  }

  async update(updateData) {
    const { amount, description, date, categoryId, receiptFilename, tags, notes } = updateData;
    const query = `
      UPDATE expenses 
      SET amount = ?, description = ?, date = ?, category_id = ?, 
          receipt_filename = ?, tags = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await database.run(query, [
      amount, description, date, categoryId, receiptFilename, 
      JSON.stringify(tags || []), notes, this.id
    ]);
    
    // Refresh the instance
    const updated = await Expense.findById(this.id);
    Object.assign(this, updated);
    return this;
  }

  async delete() {
    const query = 'DELETE FROM expenses WHERE id = ?';
    await database.run(query, [this.id]);
  }

  belongsToUser(userId) {
    return this.userId === userId;
  }

  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      description: this.description,
      date: this.date,
      categoryId: this.categoryId,
      userId: this.userId,
      receiptFilename: this.receiptFilename,
      tags: this.tags,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      category: this.category
    };
  }
}

module.exports = Expense;