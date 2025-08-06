const database = require('../database/connection');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(userData) {
    const { email, password, firstName, lastName } = userData;
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      const result = await database.run(query, [email, passwordHash, firstName, lastName]);
      return await User.findById(result.id);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const userData = await database.get(query, [id]);
    return userData ? new User(userData) : null;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const userData = await database.get(query, [email]);
    return userData ? new User(userData) : null;
  }

  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const usersData = await database.all(query);
    return usersData.map(userData => new User(userData));
  }

  async update(updateData) {
    const { firstName, lastName } = updateData;
    const query = `
      UPDATE users 
      SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await database.run(query, [firstName, lastName, this.id]);
    
    // Refresh the instance
    const updated = await User.findById(this.id);
    Object.assign(this, updated);
    return this;
  }

  async delete() {
    const query = 'DELETE FROM users WHERE id = ?';
    await database.run(query, [this.id]);
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;