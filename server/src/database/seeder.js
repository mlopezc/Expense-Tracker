const database = require('./connection');
const fs = require('fs');
const path = require('path');

class Seeder {
  static async seedDefaultCategories() {
    try {
      // Check if default categories already exist
      const existingCategories = await database.get(
        'SELECT COUNT(*) as count FROM categories WHERE is_default = 1'
      );
      
      if (existingCategories.count > 0) {
        console.log('Default categories already exist, skipping seed');
        return;
      }

      // Read and execute seed file
      const seedPath = path.join(__dirname, 'seed.sql');
      const seedScript = fs.readFileSync(seedPath, 'utf8');
      
      await new Promise((resolve, reject) => {
        database.db.exec(seedScript, (err) => {
          if (err) {
            console.error('Error seeding default categories:', err);
            reject(err);
          } else {
            console.log('Default categories seeded successfully');
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Seed error:', error);
      throw error;
    }
  }

  static async seedAll() {
    try {
      await this.seedDefaultCategories();
      console.log('All seeding completed');
    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    }
  }
}

module.exports = Seeder;