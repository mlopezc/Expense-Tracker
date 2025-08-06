const jwt = require('jsonwebtoken');

class AuthUtils {
  static generateToken(userId) {
    const payload = { userId };
    const options = { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, options);
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // Password must be at least 6 characters long
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    
    return { valid: true };
  }

  static validateName(name) {
    if (!name || name.trim().length === 0) {
      return { valid: false, message: 'Name cannot be empty' };
    }
    
    if (name.trim().length > 100) {
      return { valid: false, message: 'Name cannot exceed 100 characters' };
    }
    
    return { valid: true };
  }
}

module.exports = AuthUtils;