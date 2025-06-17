CREATE DATABASE IF NOT EXISTS personal_library_auth;

USE personal_library_auth;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL
);

-- Create books table (same as before but with user_id for ownership)
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    pages INT,
    lent_to VARCHAR(255) DEFAULT NULL,
    lent_date DATE DEFAULT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS hotel_room(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number INT NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL
);


CREATE TABLE IF NOT EXISTS reservation(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    number_of_guests INT NOT NULL,
    total_price INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    FOREIGN KEY (room_id) REFERENCES hotel_room(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert a test user (password: "password")
