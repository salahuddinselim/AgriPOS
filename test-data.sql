-- ============================================================
-- TEST DATA FOR AGRI POS
-- Run this in Supabase SQL Editor to populate test data
-- ============================================================

-- Insert shop settings
INSERT INTO shop_settings (name, address, phone)
VALUES 
  ('Agricultural Shop', 'Village: Dhaka, District: Chittagong', '018XXXXXXXXX')
ON CONFLICT DO NOTHING;

-- Insert products
INSERT INTO products (name, category, unit, price, stock_quantity) VALUES
  ('Furadan 5G', 'pesticide', 'KG', 450, 50),
  ('Dursban 20EC', 'pesticide', 'Liter', 320, 25),
  ('Radar', 'pesticide', 'Liter', 280, 30),
  ('Confidor', 'pesticide', 'ML', 850, 100),
  ('Urea', 'fertilizer', 'KG', 40, 500),
  ('TSP', 'fertilizer', 'KG', 65, 200),
  ('MP', 'fertilizer', 'KG', 85, 150),
  ('DAP', 'fertilizer', 'KG', 55, 180),
  ('Boric Acid', 'fertilizer', 'KG', 120, 50),
  ('Mustard Seeds', 'seed', 'KG', 250, 35),
  ('Wheat Seeds', 'seed', 'KG', 180, 100),
  ('Rice Seeds', 'seed', 'KG', 150, 200)
ON CONFLICT DO NOTHING;

-- Insert customers
INSERT INTO customers (name, phone, address, total_purchase, total_paid, total_due) VALUES
  ('Rahim Ahmed', '01712345678', 'Village: Bogra, Post: Kashimpur', 25000, 20000, 5000),
  ('Karim Hassan', '01812345678', 'Village: Rangpur, Post: Durgapur', 15000, 15000, 0),
  ('Mohammad Ali', '01912345678', 'Village: Sylhet, Post: Bholagonj', 8500, 5000, 3500),
  ('Abu Bakar', '01612345678', 'Village: Khulna, Post: Dumuria', 42000, 35000, 7000),
  ('Salman Khan', '01512345678', 'Village: Barisal, Post: Banaripara', 12000, 12000, 0)
ON CONFLICT (phone) DO NOTHING;

-- Insert invoices (linked to customers)
INSERT INTO invoices (customer_id, customer_name, customer_phone, customer_address, total_amount, paid_amount, due_amount)
SELECT 
  id, name, phone, address, total_purchase, total_paid, total_due
FROM customers
WHERE phone IN ('01712345678', '01812345678', '01912345678', '01612345678', '01512345678')
LIMIT 3;

-- Insert invoice items (sample)
INSERT INTO invoice_items (invoice_id, product_id, product_name, product_unit, quantity, price, item_total)
SELECT 
  i.id,
  p.id,
  p.name,
  p.unit,
  5,
  p.price,
  5 * p.price
FROM invoices i
CROSS JOIN (SELECT id, name, unit, price FROM products WHERE name = 'Urea' LIMIT 1) p
WHERE i.id IS NOT NULL
LIMIT 3;

-- Verify data
SELECT 'Shop Settings' as table_name, COUNT(*) as count FROM shop_settings
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Invoice Items', COUNT(*) FROM invoice_items;