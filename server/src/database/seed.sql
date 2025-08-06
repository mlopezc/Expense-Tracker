-- Insert default categories (global categories with no user_id)
INSERT OR IGNORE INTO categories (name, description, color, icon, user_id, is_default) VALUES
('Food & Dining', 'Restaurants, groceries, takeout', '#FF6B6B', '🍽️', NULL, 1),
('Transportation', 'Gas, public transport, parking', '#4ECDC4', '🚗', NULL, 1),
('Shopping', 'Clothes, electronics, general purchases', '#45B7D1', '🛍️', NULL, 1),
('Entertainment', 'Movies, games, hobbies', '#96CEB4', '🎬', NULL, 1),
('Bills & Utilities', 'Rent, electricity, phone, internet', '#FFEAA7', '💡', NULL, 1),
('Healthcare', 'Medical, pharmacy, insurance', '#DDA0DD', '🏥', NULL, 1),
('Education', 'Books, courses, training', '#98D8C8', '📚', NULL, 1),
('Travel', 'Flights, hotels, vacation expenses', '#F7DC6F', '✈️', NULL, 1),
('Other', 'Miscellaneous expenses', '#BDC3C7', '📦', NULL, 1);