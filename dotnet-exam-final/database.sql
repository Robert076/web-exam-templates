CREATE DATABASE IF NOT EXISTS final_exam_web;
USE final_exam_web;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    price DECIMAL(10, 2) 
);

CREATE TABLE IF NOT EXISTS orders ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    totalPrice DECIMAL(10, 2),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2),
    FOREIGN KEY (orderId) REFERENCES orders(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Insert mock user for testing
INSERT INTO users (username) VALUES ('john_doe');

-- Insert sample products for testing
INSERT INTO products (name, price) VALUES 
('Laptop', 999.99),
('Mouse', 29.99),
('Keyboard', 79.99),
('Monitor', 299.99),
('Headphones', 149.99);
