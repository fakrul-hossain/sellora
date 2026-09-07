-- ====================================================================
-- SELLORA Multi-Vendor E-Commerce Platform Database Baseline
-- Compatible with XAMPP MySQL & Neon Coders MultiVendor Report
-- Generated: 2026-09-07
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS `sellora_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sellora_db`;

-- --------------------------------------------------------------------
-- 1. Table Definitions
-- --------------------------------------------------------------------

DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `vendor_withdrawals`;
DROP TABLE IF EXISTS `revenue`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_status_history`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `product_questions`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `user_addresses`;
DROP TABLE IF EXISTS `vendors`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `site_settings`;

-- Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `mobile` VARCHAR(20) DEFAULT '',
  `role` ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'ORDER_MANAGER') NOT NULL DEFAULT 'CUSTOMER',
  `address` VARCHAR(255) DEFAULT '',
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `is_email_verified` TINYINT(1) DEFAULT 1,
  `vendor_id` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Addresses Table
CREATE TABLE `user_addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `street` VARCHAR(500) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `area` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_addresses_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendors Table
CREATE TABLE `vendors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `owner_id` INT NOT NULL UNIQUE,
  `store_name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `banner_url` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `email` VARCHAR(255) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'APPROVED',
  `commission_rate` DECIMAL(5,2) DEFAULT 5.00,
  `balance` DECIMAL(12,2) DEFAULT 0.00,
  `street` VARCHAR(255) DEFAULT '',
  `city` VARCHAR(100) DEFAULT 'Dhaka',
  `area` VARCHAR(100) DEFAULT 'Central',
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_vendors_slug` (`slug`),
  INDEX `idx_vendors_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `icon` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  INDEX `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vendor_id` INT NOT NULL,
  `category_id` INT DEFAULT NULL,
  `category` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(255) NOT NULL DEFAULT 'Generic',
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `original_price` DECIMAL(12,2) DEFAULT NULL,
  `discount_percentage` DECIMAL(5,2) DEFAULT 0.00,
  `stock` INT NOT NULL DEFAULT 0,
  `image_url` VARCHAR(500) NOT NULL,
  `video_url` VARCHAR(500) DEFAULT NULL,
  `specifications_json` JSON DEFAULT NULL,
  `in_the_box` TEXT DEFAULT NULL,
  `warranty` VARCHAR(255) DEFAULT NULL,
  `features_json` JSON DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT 4.80,
  `review_count` INT DEFAULT 12,
  `is_published` TINYINT(1) DEFAULT 1,
  `is_approved` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  INDEX `idx_products_vendor` (`vendor_id`),
  INDEX `idx_products_category` (`category`),
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Images Table
CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_images_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Variants Table
CREATE TABLE `product_variants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `price_delta` DECIMAL(12,2) DEFAULT 0.00,
  `stock` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_variants_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Questions Table
CREATE TABLE `product_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT DEFAULT NULL,
  `answered_by` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_questions_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shopping Cart Table (Report Specification)
CREATE TABLE `cart` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_cart_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Items Table (Report Specification)
CREATE TABLE `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cart_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_cart_items_cart` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(100) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `shipping_fee` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'CASH_ON_DELIVERY',
  `payment_status` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `order_status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `shipping_address_json` JSON NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_orders_customer` (`customer_id`),
  INDEX `idx_orders_number` (`order_number`),
  INDEX `idx_orders_status` (`order_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `vendor_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `quantity` INT NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  INDEX `idx_order_items_order` (`order_id`),
  INDEX `idx_order_items_vendor` (`vendor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Status History Table
CREATE TABLE `order_status_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `note` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  INDEX `idx_history_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table (Report Extension)
CREATE TABLE `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_method` ENUM('CASH', 'BKASH', 'NAGAD', 'CARD', 'CASH_ON_DELIVERY') DEFAULT 'CASH',
  `payment_status` ENUM('PENDING', 'PAID', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  INDEX `idx_payments_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Revenue Table (Report Extension)
CREATE TABLE `revenue` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `owner_id` INT NOT NULL UNIQUE,
  `total_revenue` DECIMAL(12,2) DEFAULT 0.00,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Withdrawals Table
CREATE TABLE `vendor_withdrawals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vendor_id` INT NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `account_details` VARCHAR(255) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
  `transaction_ref` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  INDEX `idx_withdrawals_vendor` (`vendor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupons Table
CREATE TABLE `coupons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(100) NOT NULL UNIQUE,
  `discount_type` ENUM('PERCENTAGE', 'FIXED') NOT NULL DEFAULT 'PERCENTAGE',
  `discount_value` DECIMAL(12,2) NOT NULL,
  `min_spend` DECIMAL(12,2) DEFAULT 0.00,
  `max_discount` DECIMAL(12,2) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `valid_till` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_coupons_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings Table
CREATE TABLE `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_name` VARCHAR(255) DEFAULT 'SELLORA Bangladesh',
  `site_logo` VARCHAR(500) DEFAULT NULL,
  `support_phone` VARCHAR(50) DEFAULT '+880 9612-345678',
  `support_email` VARCHAR(255) DEFAULT 'support@sellora.com',
  `announcement_text` TEXT DEFAULT NULL,
  `default_commission_rate` DECIMAL(5,2) DEFAULT 5.00,
  `banners_json` JSON DEFAULT NULL,
  `hero_config_json` JSON DEFAULT NULL,
  `brand_week_config_json` JSON DEFAULT NULL,
  `categories_config_json` JSON DEFAULT NULL,
  `brands_config_json` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Logs Table
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `user_name` VARCHAR(255) DEFAULT 'System',
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `target_id` VARCHAR(100) DEFAULT NULL,
  `details_json` JSON DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_activity_action` (`action`),
  INDEX `idx_activity_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Stored Procedures (As Required by Neon Coders Project Report)
-- --------------------------------------------------------------------

DROP PROCEDURE IF EXISTS `RegisterUser`;
DROP PROCEDURE IF EXISTS `SearchProducts`;
DROP PROCEDURE IF EXISTS `Checkout`;
DROP PROCEDURE IF EXISTS `AddProduct`;
DROP PROCEDURE IF EXISTS `ViewOrdersByOwner`;

DELIMITER $$

-- Procedure 1: RegisterUser
CREATE PROCEDURE `RegisterUser`(
  IN p_username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_role VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
  INSERT INTO `users` (`name`, `username`, `email`, `password_hash`, `role`)
  VALUES (p_username, p_username, p_email, p_password, p_role);
END$$

-- Procedure 2: SearchProducts
CREATE PROCEDURE `SearchProducts`(IN p_keyword VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci)
BEGIN
  SELECT p.id AS product_id, p.title AS product_name, p.description, p.price,
         p.stock AS stock_qty, c.name AS category_name, v.store_name AS store_owner
  FROM `products` p
  LEFT JOIN `categories` c ON p.category_id = c.id
  LEFT JOIN `vendors` v ON p.vendor_id = v.id
  WHERE p.title LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci
     OR c.name LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci
     OR p.category LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci;
END$$

-- Procedure 3: Checkout
CREATE PROCEDURE `Checkout`(IN p_customer_id INT, OUT p_order_id INT)
BEGIN
  DECLARE v_order_num VARCHAR(100);
  DECLARE v_subtotal DECIMAL(12,2) DEFAULT 0;
  DECLARE v_cust_name VARCHAR(255);
  DECLARE v_cust_email VARCHAR(255);
  DECLARE v_cust_phone VARCHAR(50);
  DECLARE v_cart_id INT;

  SELECT id INTO v_cart_id FROM `cart` WHERE customer_id = p_customer_id ORDER BY id DESC LIMIT 1;

  IF v_cart_id IS NOT NULL THEN
    SELECT name, email, phone INTO v_cust_name, v_cust_email, v_cust_phone FROM `users` WHERE id = p_customer_id;
    SET v_order_num = CONCAT('ORD-', UNIX_TIMESTAMP(), '-', FLOOR(100 + RAND() * 900));

    SELECT IFNULL(SUM(p.price * ci.quantity), 0) INTO v_subtotal
    FROM `cart_items` ci
    JOIN `products` p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    INSERT INTO `orders` (
      order_number, customer_id, customer_name, customer_email, customer_phone,
      subtotal, shipping_fee, discount, total_amount, payment_method, payment_status, order_status, shipping_address_json
    )
    VALUES (
      v_order_num, p_customer_id, IFNULL(v_cust_name, 'Customer'), IFNULL(v_cust_email, ''),
      IFNULL(v_cust_phone, ''), v_subtotal, 60.00, 0.00, v_subtotal + 60.00,
      'CASH_ON_DELIVERY', 'PENDING', 'PENDING', '{"address": "Customer Primary Address"}'
    );

    SET p_order_id = LAST_INSERT_ID();

    INSERT INTO `order_items` (order_id, product_id, vendor_id, title, image_url, price, quantity, subtotal)
    SELECT p_order_id, p.id, p.vendor_id, p.title, p.image_url, p.price, ci.quantity, (p.price * ci.quantity)
    FROM `cart_items` ci
    JOIN `products` p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    UPDATE `products` p
    JOIN `cart_items` ci ON p.id = ci.product_id
    SET p.stock = GREATEST(0, p.stock - ci.quantity)
    WHERE ci.cart_id = v_cart_id;

    DELETE FROM `cart_items` WHERE cart_id = v_cart_id;
  END IF;
END$$

-- Procedure 4: AddProduct
CREATE PROCEDURE `AddProduct`(
  IN p_owner_id INT,
  IN p_category_id INT,
  IN p_product_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_description VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_price DECIMAL(10,2),
  IN p_stock_qty INT
)
BEGIN
  DECLARE v_vendor_id INT;
  SELECT id INTO v_vendor_id FROM `vendors` WHERE owner_id = p_owner_id LIMIT 1;
  IF v_vendor_id IS NULL THEN
    INSERT INTO `vendors` (owner_id, store_name, slug, email)
    VALUES (p_owner_id, CONCAT('Store of Owner #', p_owner_id), CONCAT('store-', p_owner_id), 'vendor@sellora.com');
    SET v_vendor_id = LAST_INSERT_ID();
  END IF;

  INSERT INTO `products` (vendor_id, category_id, category, title, slug, sku, description, price, stock, image_url)
  VALUES (
    v_vendor_id, p_category_id, 'General', p_product_name,
    LOWER(REPLACE(p_product_name, ' ', '-')), CONCAT('SKU-', UNIX_TIMESTAMP(), '-', FLOOR(RAND()*1000)),
    p_description, p_price, p_stock_qty, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
  );
END$$

-- Procedure 5: ViewOrdersByOwner
CREATE PROCEDURE `ViewOrdersByOwner`(IN p_owner_id INT)
BEGIN
  SELECT o.id AS order_id, o.created_at AS order_date, o.customer_name,
         oi.title AS product_name, oi.quantity, oi.price, o.order_status AS status
  FROM `order_items` oi
  JOIN `orders` o ON oi.order_id = o.id
  JOIN `vendors` v ON oi.vendor_id = v.id
  WHERE v.owner_id = p_owner_id
  ORDER BY o.created_at DESC;
END$$

DELIMITER ;

-- --------------------------------------------------------------------
-- 3. Seed Data Insertion
-- --------------------------------------------------------------------

-- Insert Super Admin (ID: 1)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `role`, `address`)
VALUES (1, 'SELLORA Super Admin', 'admin', 'admin@sellora.com', '$2b$10$rhkakTBsWzlYOfX8h0XNju4EbYcabxhPkdeuKWc50RWvVaG1FY80e', '+880 1700-000000', 'SUPER_ADMIN', 'Headquarters, Gulshan, Dhaka');

-- Insert 15 Store Owners (IDs: 2 to 16)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (2, 'Emran Rahman', 'emranrahman', 'emranrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345671', '01712345671', 'SELLER', 'Zindabazar, Sylhet');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (3, 'Nasrin Islam', 'nasrinislam', 'nasrinislam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01812345672', '01812345672', 'SELLER', 'Zindabazar, Sylhet');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (4, 'Rumana Miah', 'rumanamiah', 'rumanamiah@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01912345673', '01912345673', 'SELLER', 'Agrabad, Chattogram');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (5, 'Tariqul Hassan', 'tariqulhassan', 'tariqulhassan@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345674', '01712345674', 'SELLER', 'GEC Circle, Chattogram');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (6, 'Farhana Sharmin', 'farhanasharmin', 'farhanasharmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01612345675', '01612345675', 'SELLER', 'Dhanmondi, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (7, 'Saiful Alam', 'saifulalam', 'saifulalam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01512345676', '01512345676', 'SELLER', 'Elephant Road, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (8, 'Tanvir Ahmed', 'tanvirahmed', 'tanvirahmed@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01312345677', '01312345677', 'SELLER', 'IDB Bhaban, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (9, 'Mehedi Hasan', 'mehedihasan', 'mehedihasan@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01812345678', '01812345678', 'SELLER', 'Motijheel, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (10, 'Nusrat Sultana', 'nusratsultana', 'nusratsultana@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345679', '01712345679', 'SELLER', 'Uttara, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (11, 'Kamal Uddin', 'kamaluddin', 'kamaluddin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01612345680', '01612345680', 'SELLER', 'Dhanmondi, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (12, 'Shafiqul Reza', 'shafiqulreza', 'shafiqulreza@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01912345681', '01912345681', 'SELLER', 'Mirpur, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (13, 'Afroza Akter', 'afrozaakter', 'afrozaakter@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01512345682', '01512345682', 'SELLER', 'Chawkbazar, Chattogram');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (14, 'Ziaur Rahman', 'ziaurrahman', 'ziaurrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345683', '01712345683', 'SELLER', 'Nilkhet, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (15, 'Shamima Sharmin', 'shamimasharmin', 'shamimasharmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01812345684', '01812345684', 'SELLER', 'Gulshan 1, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (16, 'Delwar Miah', 'delwarmiah', 'delwarmiah@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01912345685', '01912345685', 'SELLER', 'Panthapath, Dhaka');

-- Insert 15 Vendors corresponding to Owners
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (1, 2, 'Emran Tech Mart', 'emran-tech-mart', 'emranrahman@example.com', '01712345671', 'Sylhet', 'Zindabazar, Sylhet', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (2, 3, 'Nasrin Fashion Gallery', 'nasrin-fashion-gallery', 'nasrinislam@example.com', '01812345672', 'Sylhet', 'Zindabazar, Sylhet', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (3, 4, 'Rumana Electronics', 'rumana-electronics', 'rumanamiah@example.com', '01912345673', 'Chattogram', 'Agrabad, Chattogram', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (4, 5, 'Hassan Gadget Zone', 'hassan-gadget-zone', 'tariqulhassan@example.com', '01712345674', 'Chattogram', 'GEC Circle, Chattogram', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (5, 6, 'Sharmin Beauty & Care', 'sharmin-beauty-care', 'farhanasharmin@example.com', '01612345675', 'Dhaka', 'Dhanmondi, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (6, 7, 'Alam Footwear & Leather', 'alam-footwear-leather', 'saifulalam@example.com', '01512345676', 'Dhaka', 'Elephant Road, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (7, 8, 'Tanvir Laptop & Accessories', 'tanvir-laptop-accessories', 'tanvirahmed@example.com', '01312345677', 'Dhaka', 'IDB Bhaban, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (8, 9, 'Mehedi Sports & Fitness', 'mehedi-sports-fitness', 'mehedihasan@example.com', '01812345678', 'Dhaka', 'Motijheel, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (9, 10, 'Nusrat Home & Kitchen', 'nusrat-home-kitchen', 'nusratsultana@example.com', '01712345679', 'Dhaka', 'Uttara, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (10, 11, 'Kamal Grocery & Organics', 'kamal-grocery-organics', 'kamaluddin@example.com', '01612345680', 'Dhaka', 'Dhanmondi, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (11, 12, 'Reza Automotive Care', 'reza-automotive-care', 'shafiqulreza@example.com', '01912345681', 'Dhaka', 'Mirpur, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (12, 13, 'Afroza Kids & Toys World', 'afroza-kids-toys-world', 'afrozaakter@example.com', '01512345682', 'Chattogram', 'Chawkbazar, Chattogram', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (13, 14, 'Zia Books & Stationery', 'zia-books-stationery', 'ziaurrahman@example.com', '01712345683', 'Dhaka', 'Nilkhet, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (14, 15, 'Shamima Luxury Watches', 'shamima-luxury-watches', 'shamimasharmin@example.com', '01812345684', 'Dhaka', 'Gulshan 1, Dhaka', 4.9, 'APPROVED', 25400.00);
INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `email`, `phone`, `city`, `street`, `rating`, `status`, `balance`)
VALUES (15, 16, 'Delwar Furniture Hub', 'delwar-furniture-hub', 'delwarmiah@example.com', '01912345685', 'Dhaka', 'Panthapath, Dhaka', 4.9, 'APPROVED', 25400.00);
UPDATE `users` SET `vendor_id` = '1' WHERE `id` = 2;
UPDATE `users` SET `vendor_id` = '2' WHERE `id` = 3;
UPDATE `users` SET `vendor_id` = '3' WHERE `id` = 4;
UPDATE `users` SET `vendor_id` = '4' WHERE `id` = 5;
UPDATE `users` SET `vendor_id` = '5' WHERE `id` = 6;
UPDATE `users` SET `vendor_id` = '6' WHERE `id` = 7;
UPDATE `users` SET `vendor_id` = '7' WHERE `id` = 8;
UPDATE `users` SET `vendor_id` = '8' WHERE `id` = 9;
UPDATE `users` SET `vendor_id` = '9' WHERE `id` = 10;
UPDATE `users` SET `vendor_id` = '10' WHERE `id` = 11;
UPDATE `users` SET `vendor_id` = '11' WHERE `id` = 12;
UPDATE `users` SET `vendor_id` = '12' WHERE `id` = 13;
UPDATE `users` SET `vendor_id` = '13' WHERE `id` = 14;
UPDATE `users` SET `vendor_id` = '14' WHERE `id` = 15;
UPDATE `users` SET `vendor_id` = '15' WHERE `id` = 16;

-- Insert 30 Customers (IDs: 17 to 46)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (17, 'Rafiqul Hossain', 'rafiqulhossain', 'rafiqulhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01512345678', '01512345678', 'CUSTOMER', 'Mirpur 10, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (18, 'Shirin Begum', 'shirinbegum', 'shirinbegum@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01798765432', '01798765432', 'CUSTOMER', 'Sector 7, Uttara, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (19, 'Mizanur Islam', 'mizanurislam', 'mizanurislam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01634567891', '01634567891', 'CUSTOMER', 'Sonadanga, Khulna');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (20, 'Tania Akter', 'taniaakter', 'taniaakter@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01856789012', '01856789012', 'CUSTOMER', 'Chawkbazar, Chattogram');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (21, 'Arifur Rahman', 'arifurrahman', 'arifurrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01978901234', '01978901234', 'CUSTOMER', 'Shibganj, Sylhet');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (22, 'Salma Khatun', 'salmakhatun', 'salmakhatun@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01711223344', '01711223344', 'CUSTOMER', 'Rajpara, Rajshahi');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (23, 'Jahangir Alom', 'jahangiralom', 'jahangiralom@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01822334455', '01822334455', 'CUSTOMER', 'Bandar, Narayanganj');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (24, 'Fahmida Akter', 'fahmidaakter', 'fahmidaakter@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01933445566', '01933445566', 'CUSTOMER', 'Kandirpar, Cumilla');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (25, 'Kawsar Habib', 'kawsarhabib', 'kawsarhabib@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01644556677', '01644556677', 'CUSTOMER', 'Court Road, Bogura');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (26, 'Rubina Yesmin', 'rubinayesmin', 'rubinayesmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01555667788', '01555667788', 'CUSTOMER', 'Sadur Mor, Rangpur');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (27, 'Hasan Mahmud', 'hasanmahmud', 'hasanmahmud@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01766778899', '01766778899', 'CUSTOMER', 'Town Hall, Mymensingh');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (28, 'Nasima Khondoker', 'nasimakhondoker', 'nasimakhondoker@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01877889900', '01877889900', 'CUSTOMER', 'Natun Bazar, Barishal');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (29, 'Asraful Alam', 'asrafulalam', 'asrafulalam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01988990011', '01988990011', 'CUSTOMER', 'Boro Bazar, Jashore');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (30, 'Faruk Ahmed', 'farukahmed', 'farukahmed@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01699001122', '01699001122', 'CUSTOMER', 'Sadar Road, Dinajpur');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (31, 'Maruf Hossain', 'marufhossain', 'marufhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01700112233', '01700112233', 'CUSTOMER', 'College Gate, Tangail');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (32, 'Sabrina Sharmin', 'sabrinasharmin', 'sabrinasharmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01811223355', '01811223355', 'CUSTOMER', 'Station Road, Pabna');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (33, 'Lutfor Rahman', 'lutforrahman', 'lutforrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01922334466', '01922334466', 'CUSTOMER', 'Hospital Mor, Kushtia');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (34, 'Samia Sultana', 'samiasultana', 'samiasultana@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01533445577', '01533445577', 'CUSTOMER', 'Main Road, Gazipur');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (35, 'Rezwanul Karim', 'rezwanulkarim', 'rezwanulkarim@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01744556688', '01744556688', 'CUSTOMER', 'Court Point, Coxs Bazar');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (36, 'Nazneen Ferdaus', 'nazneenferdaus', 'nazneenferdaus@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01855667799', '01855667799', 'CUSTOMER', 'Sadar Hospital Road, Feni');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (37, 'Habibur Rahman', 'habiburrahman', 'habiburrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01966778800', '01966778800', 'CUSTOMER', 'Purana Paltan, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (38, 'Rokeya Begum', 'rokeyabegum', 'rokeyabegum@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01677889911', '01677889911', 'CUSTOMER', 'Gopalgonj Sadar');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (39, 'Imran Hossain', 'imranhossain', 'imranhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01788990022', '01788990022', 'CUSTOMER', 'Chawkbazar, Barishal');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (40, 'Nazia Parveen', 'naziaparveen', 'naziaparveen@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01899001133', '01899001133', 'CUSTOMER', 'Shyamoli, Dhaka');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (41, 'Anwar Hossain', 'anwarhossain', 'anwarhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01900112244', '01900112244', 'CUSTOMER', 'Halishahar, Chattogram');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (42, 'Khadijatul Habiba', 'khadijatulhabiba', 'khadijatulhabiba@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01511223366', '01511223366', 'CUSTOMER', 'Amborkhana, Sylhet');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (43, 'Moniruzzaman', 'moniruzzaman', 'moniruzzaman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01722334477', '01722334477', 'CUSTOMER', 'Zero Point, Rajshahi');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (44, 'Bilkis Panna', 'bilkispanna', 'bilkispanna@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01833445588', '01833445588', 'CUSTOMER', 'Khan Jahan Ali Road, Khulna');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (45, 'Sajjad Hossain', 'sajjadhossain', 'sajjadhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01944556699', '01944556699', 'CUSTOMER', 'Badarganj Road, Rangpur');
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`)
VALUES (46, 'Poly Chowdhury', 'polychowdhury', 'polychowdhury@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01823456789', '01823456789', 'CUSTOMER', 'Boalia, Rajshahi');

-- Insert Addresses for Customers
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (17, 'Rafiqul Hossain', '01512345678', 'Mirpur 10, Dhaka', 'Dhaka', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (18, 'Shirin Begum', '01798765432', 'Sector 7, Uttara, Dhaka', 'Dhaka', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (19, 'Mizanur Islam', '01634567891', 'Sonadanga, Khulna', 'Khulna', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (20, 'Tania Akter', '01856789012', 'Chawkbazar, Chattogram', 'Chattogram', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (21, 'Arifur Rahman', '01978901234', 'Shibganj, Sylhet', 'Sylhet', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (22, 'Salma Khatun', '01711223344', 'Rajpara, Rajshahi', 'Rajshahi', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (23, 'Jahangir Alom', '01822334455', 'Bandar, Narayanganj', 'Narayanganj', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (24, 'Fahmida Akter', '01933445566', 'Kandirpar, Cumilla', 'Cumilla', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (25, 'Kawsar Habib', '01644556677', 'Court Road, Bogura', 'Bogura', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (26, 'Rubina Yesmin', '01555667788', 'Sadur Mor, Rangpur', 'Rangpur', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (27, 'Hasan Mahmud', '01766778899', 'Town Hall, Mymensingh', 'Mymensingh', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (28, 'Nasima Khondoker', '01877889900', 'Natun Bazar, Barishal', 'Barishal', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (29, 'Asraful Alam', '01988990011', 'Boro Bazar, Jashore', 'Jashore', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (30, 'Faruk Ahmed', '01699001122', 'Sadar Road, Dinajpur', 'Dinajpur', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (31, 'Maruf Hossain', '01700112233', 'College Gate, Tangail', 'Tangail', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (32, 'Sabrina Sharmin', '01811223355', 'Station Road, Pabna', 'Pabna', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (33, 'Lutfor Rahman', '01922334466', 'Hospital Mor, Kushtia', 'Kushtia', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (34, 'Samia Sultana', '01533445577', 'Main Road, Gazipur', 'Gazipur', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (35, 'Rezwanul Karim', '01744556688', 'Court Point, Coxs Bazar', 'Coxs Bazar', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (36, 'Nazneen Ferdaus', '01855667799', 'Sadar Hospital Road, Feni', 'Feni', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (37, 'Habibur Rahman', '01966778800', 'Purana Paltan, Dhaka', 'Dhaka', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (38, 'Rokeya Begum', '01677889911', 'Gopalgonj Sadar', 'Gopalgonj', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (39, 'Imran Hossain', '01788990022', 'Chawkbazar, Barishal', 'Barishal', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (40, 'Nazia Parveen', '01899001133', 'Shyamoli, Dhaka', 'Dhaka', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (41, 'Anwar Hossain', '01900112244', 'Halishahar, Chattogram', 'Chattogram', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (42, 'Khadijatul Habiba', '01511223366', 'Amborkhana, Sylhet', 'Sylhet', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (43, 'Moniruzzaman', '01722334477', 'Zero Point, Rajshahi', 'Rajshahi', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (44, 'Bilkis Panna', '01833445588', 'Khan Jahan Ali Road, Khulna', 'Khulna', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (45, 'Sajjad Hossain', '01944556699', 'Badarganj Road, Rangpur', 'Rangpur', 'Central Area', 1);
INSERT INTO `user_addresses` (`user_id`, `full_name`, `phone`, `street`, `city`, `area`, `is_default`)
VALUES (46, 'Poly Chowdhury', '01823456789', 'Boalia, Rajshahi', 'Rajshahi', 'Central Area', 1);

-- Insert 20 Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (1, 'Mobile Phones', 'mobile-phones', 'smartphone', 'Smartphones and feature phones from all major brands', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (2, 'Laptops & Computers', 'laptops-computers', 'laptop', 'Laptops, desktops, and computer peripherals', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (3, 'Men''s Fashion', 'mens-fashion', 'shirt', 'Clothing and accessories for men', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (4, 'Women''s Fashion', 'womens-fashion', 'sparkles', 'Clothing and accessories for women', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (5, 'Kids'' Fashion', 'kids-fashion', 'smile', 'Clothing and footwear for children', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (6, 'Home Appliances', 'home-appliances', 'tv', 'Appliances for everyday home use', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (7, 'Kitchen & Dining', 'kitchen-dining', 'utensils', 'Cookware, dinnerware, and kitchen tools', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (8, 'Furniture', 'furniture', 'sofa', 'Home and office furniture', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (9, 'Groceries', 'groceries', 'shopping-basket', 'Daily grocery and food essentials', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (10, 'Beauty & Personal Care', 'beauty-personal-care', 'heart', 'Skincare, haircare, and personal hygiene products', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (11, 'Health & Wellness', 'health-wellness', 'activity', 'Health monitoring and wellness products', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (12, 'Sports & Outdoor', 'sports-outdoor', 'trophy', 'Sports gear and outdoor equipment', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (13, 'Books & Stationery', 'books-stationery', 'book', 'Books, notebooks, and office stationery', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (14, 'Toys & Games', 'toys-games', 'gamepad-2', 'Toys and games for children', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (15, 'Automotive Accessories', 'automotive-accessories', 'car', 'Accessories and gadgets for vehicles', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (16, 'Mobile Accessories', 'mobile-accessories', 'headphones', 'Chargers, cases, and other phone accessories', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (17, 'Footwear', 'footwear', 'footprints', 'Shoes and sandals for all ages', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (18, 'Bags & Luggage', 'bags-luggage', 'briefcase', 'Bags, backpacks, and travel luggage', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (19, 'Watches & Jewelry', 'watches-jewelry', 'watch', 'Watches and fashion jewelry', 'ACTIVE');
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`)
VALUES (20, 'Electronics Accessories', 'electronics-accessories', 'plug', 'Cables, adapters, and small electronics', 'ACTIVE');

-- Insert 50 Products
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  1, 1, 1, 'Mobile Phones', 'Xiaomi', 'Smartphone X10', 'smartphone-x10', 'X10-MOB-01',
  'Smartphone X10 - high quality authentic product listed under Mobile Phones. Complete manufacturer warranty and tested durability.', 12450, 13999, 11, 84, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  2, 2, 2, 'Laptops & Computers', 'Asus', 'Ultrabook 14 inch', 'ultrabook-14-inch', 'ULTRA-14-02',
  'Ultrabook 14 inch - high quality authentic product listed under Laptops & Computers. Complete manufacturer warranty and tested durability.', 9875.5, 11200, 12, 46, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  3, 3, 3, 'Men''s Fashion', 'Aarong', 'Cotton Panjabi', 'cotton-panjabi', 'PANJ-COT-03',
  'Cotton Panjabi - high quality authentic product listed under Men''s Fashion. Complete manufacturer warranty and tested durability.', 1450, 1800, 19, 120, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  4, 4, 4, 'Women''s Fashion', 'Monipuri', 'Silk Saree Elegance', 'silk-saree-elegance', 'SAR-SLK-04',
  'Silk Saree Elegance - high quality authentic product listed under Women''s Fashion. Complete manufacturer warranty and tested durability.', 4200, 5500, 24, 35, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  5, 5, 5, 'Kids'' Fashion', 'Yellow Kids', 'Kids Denim Dungaree', 'kids-denim-dungaree', 'KID-DEN-05',
  'Kids Denim Dungaree - high quality authentic product listed under Kids'' Fashion. Complete manufacturer warranty and tested durability.', 1250, 1500, 17, 60, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  6, 6, 6, 'Home Appliances', 'Gree', 'Inverter Air Conditioner 1.5 Ton', 'inverter-air-conditioner-1-5-ton', 'AC-15T-06',
  'Inverter Air Conditioner 1.5 Ton - high quality authentic product listed under Home Appliances. Complete manufacturer warranty and tested durability.', 54000, 58000, 7, 15, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  7, 7, 7, 'Kitchen & Dining', 'Kiam', 'Non-Stick Cookware Set 7 Pcs', 'non-stick-cookware-set-7-pcs', 'CW-7PC-07',
  'Non-Stick Cookware Set 7 Pcs - high quality authentic product listed under Kitchen & Dining. Complete manufacturer warranty and tested durability.', 3800, 4500, 16, 40, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  8, 8, 8, 'Furniture', 'Otobi', 'Ergonomic Mesh Office Chair', 'ergonomic-mesh-office-chair', 'CHR-OFF-08',
  'Ergonomic Mesh Office Chair - high quality authentic product listed under Furniture. Complete manufacturer warranty and tested durability.', 6500, 7800, 17, 25, 'https://images.unsplash.com/photo-1580481077194-43666f2095f9',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  9, 9, 9, 'Groceries', 'Pran', 'Premium Basmati Rice 5kg', 'premium-basmati-rice-5kg', 'GRO-BAS-09',
  'Premium Basmati Rice 5kg - high quality authentic product listed under Groceries. Complete manufacturer warranty and tested durability.', 680, 750, 9, 200, 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  10, 10, 10, 'Beauty & Personal Care', 'The Ordinary', 'Vitamin C Brightening Serum 30ml', 'vitamin-c-brightening-serum-30ml', 'SKN-SER-10',
  'Vitamin C Brightening Serum 30ml - high quality authentic product listed under Beauty & Personal Care. Complete manufacturer warranty and tested durability.', 1150, 1400, 18, 90, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  11, 11, 11, 'Health & Wellness', 'Omron', 'Digital Blood Pressure Monitor', 'digital-blood-pressure-monitor', 'HLT-BPM-11',
  'Digital Blood Pressure Monitor - high quality authentic product listed under Health & Wellness. Complete manufacturer warranty and tested durability.', 2100, 2600, 19, 50, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  12, 12, 12, 'Sports & Outdoor', 'Yonex', 'Carbon Fiber Badminton Racket', 'carbon-fiber-badminton-racket', 'SPT-BAD-12',
  'Carbon Fiber Badminton Racket - high quality authentic product listed under Sports & Outdoor. Complete manufacturer warranty and tested durability.', 3200, 3900, 18, 45, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  13, 13, 13, 'Books & Stationery', 'Parker', 'Classic Fountain Pen & Notebook Set', 'classic-fountain-pen-notebook-set', 'STA-PEN-13',
  'Classic Fountain Pen & Notebook Set - high quality authentic product listed under Books & Stationery. Complete manufacturer warranty and tested durability.', 950, 1200, 21, 110, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  14, 14, 14, 'Toys & Games', 'Lego', 'Magnetic Educational Building Blocks', 'magnetic-educational-building-blocks', 'TOY-MAG-14',
  'Magnetic Educational Building Blocks - high quality authentic product listed under Toys & Games. Complete manufacturer warranty and tested durability.', 1750, 2200, 20, 75, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  15, 15, 15, 'Automotive Accessories', 'Baseus', 'Multi-Function Car Tire Inflator', 'multi-function-car-tire-inflator', 'CAR-INF-15',
  'Multi-Function Car Tire Inflator - high quality authentic product listed under Automotive Accessories. Complete manufacturer warranty and tested durability.', 2450, 2900, 16, 55, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  16, 1, 16, 'Mobile Accessories', 'Anker', 'Fast Charging 65W GaN Charger', 'fast-charging-65w-gan-charger', 'ACC-GAN-16',
  'Fast Charging 65W GaN Charger - high quality authentic product listed under Mobile Accessories. Complete manufacturer warranty and tested durability.', 1850, 2200, 16, 130, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  17, 2, 17, 'Footwear', 'Apex', 'Men Genuine Leather Loafers', 'men-genuine-leather-loafers', 'SH-LOA-17',
  'Men Genuine Leather Loafers - high quality authentic product listed under Footwear. Complete manufacturer warranty and tested durability.', 3450, 4200, 18, 65, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  18, 3, 18, 'Bags & Luggage', 'Wildcraft', 'Water-Resistant Travel Backpack 35L', 'water-resistant-travel-backpack-35l', 'BAG-TRV-18',
  'Water-Resistant Travel Backpack 35L - high quality authentic product listed under Bags & Luggage. Complete manufacturer warranty and tested durability.', 2650, 3200, 17, 80, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  19, 4, 19, 'Watches & Jewelry', 'Casio Edifice', 'Stainless Steel Chronograph Watch', 'stainless-steel-chronograph-watch', 'WTC-EDF-19',
  'Stainless Steel Chronograph Watch - high quality authentic product listed under Watches & Jewelry. Complete manufacturer warranty and tested durability.', 5800, 7200, 19, 30, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  20, 5, 20, 'Electronics Accessories', 'Havells', 'Extension Socket 4-Way with Surge Protection', 'extension-socket-4-way-with-surge-protection', 'ELC-EXT-20',
  'Extension Socket 4-Way with Surge Protection - high quality authentic product listed under Electronics Accessories. Complete manufacturer warranty and tested durability.', 650, 850, 24, 200, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  21, 6, 1, 'Mobile Phones', 'Samsung', 'Samsung Galaxy A55 5G', 'samsung-galaxy-a55-5g', 'SAM-A55-21',
  'Samsung Galaxy A55 5G - high quality authentic product listed under Mobile Phones. Complete manufacturer warranty and tested durability.', 42500, 45000, 6, 28, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  22, 7, 2, 'Laptops & Computers', 'Apple', 'MacBook Air M2 13.6-inch', 'macbook-air-m2-13-6-inch', 'APL-MBA-22',
  'MacBook Air M2 13.6-inch - high quality authentic product listed under Laptops & Computers. Complete manufacturer warranty and tested durability.', 118000, 125000, 6, 12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  23, 8, 3, 'Men''s Fashion', 'Cats Eye', 'Slim Fit Casual Denim Shirt', 'slim-fit-casual-denim-shirt', 'CAT-SHT-23',
  'Slim Fit Casual Denim Shirt - high quality authentic product listed under Men''s Fashion. Complete manufacturer warranty and tested durability.', 1650, 2100, 21, 70, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  24, 9, 4, 'Women''s Fashion', 'Kay Kraft', 'Embroidered Lawn Three Piece', 'embroidered-lawn-three-piece', 'KAY-3PC-24',
  'Embroidered Lawn Three Piece - high quality authentic product listed under Women''s Fashion. Complete manufacturer warranty and tested durability.', 3800, 4600, 17, 45, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  25, 10, 5, 'Kids'' Fashion', 'Mothercare', 'Baby Soft Cotton Romper 3-Pack', 'baby-soft-cotton-romper-3-pack', 'KID-ROM-25',
  'Baby Soft Cotton Romper 3-Pack - high quality authentic product listed under Kids'' Fashion. Complete manufacturer warranty and tested durability.', 990, 1300, 24, 85, 'https://images.unsplash.com/photo-1522771930-78848d9293e8',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  26, 11, 6, 'Home Appliances', 'Walton', 'Smart Microwave Oven 28L', 'smart-microwave-oven-28l', 'WAL-MW-26',
  'Smart Microwave Oven 28L - high quality authentic product listed under Home Appliances. Complete manufacturer warranty and tested durability.', 18500, 21000, 12, 20, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  27, 12, 7, 'Kitchen & Dining', 'Miyako', 'Electric Rice Cooker 2.8L', 'electric-rice-cooker-2-8l', 'MIY-RC-27',
  'Electric Rice Cooker 2.8L - high quality authentic product listed under Kitchen & Dining. Complete manufacturer warranty and tested durability.', 2950, 3600, 18, 60, 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  28, 13, 8, 'Furniture', 'Hatil', 'Wooden 6-Seater Dining Table', 'wooden-6-seater-dining-table', 'HAT-DIN-28',
  'Wooden 6-Seater Dining Table - high quality authentic product listed under Furniture. Complete manufacturer warranty and tested durability.', 32000, 38000, 16, 8, 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  29, 14, 9, 'Groceries', 'Radhuni', 'Pure Mustard Oil 2 Liters', 'pure-mustard-oil-2-liters', 'RAD-OIL-29',
  'Pure Mustard Oil 2 Liters - high quality authentic product listed under Groceries. Complete manufacturer warranty and tested durability.', 440, 490, 10, 150, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  30, 15, 10, 'Beauty & Personal Care', 'Cetaphil', 'Gentle Facial Cleanser 150ml', 'gentle-facial-cleanser-150ml', 'CET-CLN-30',
  'Gentle Facial Cleanser 150ml - high quality authentic product listed under Beauty & Personal Care. Complete manufacturer warranty and tested durability.', 850, 1050, 19, 110, 'https://images.unsplash.com/photo-1556228720-195a672e8a03',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  31, 1, 11, 'Health & Wellness', 'Beurer', 'Electric Heating Heating Pad', 'electric-heating-heating-pad', 'BEU-HTP-31',
  'Electric Heating Heating Pad - high quality authentic product listed under Health & Wellness. Complete manufacturer warranty and tested durability.', 1450, 1800, 19, 70, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  32, 2, 12, 'Sports & Outdoor', 'Cosco', 'Professional Gym Dumbbell Set 20kg', 'professional-gym-dumbbell-set-20kg', 'SPT-DMB-32',
  'Professional Gym Dumbbell Set 20kg - high quality authentic product listed under Sports & Outdoor. Complete manufacturer warranty and tested durability.', 4800, 5900, 19, 35, 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  33, 3, 13, 'Books & Stationery', 'Netum', 'Wireless Laser Barcode Scanner', 'wireless-laser-barcode-scanner', 'STA-SCN-33',
  'Wireless Laser Barcode Scanner - high quality authentic product listed under Books & Stationery. Complete manufacturer warranty and tested durability.', 2350, 2900, 19, 45, 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  34, 4, 14, 'Toys & Games', 'Syma', 'Remote Control RC Stunt Car', 'remote-control-rc-stunt-car', 'TOY-RC-34',
  'Remote Control RC Stunt Car - high quality authentic product listed under Toys & Games. Complete manufacturer warranty and tested durability.', 1650, 2100, 21, 50, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  35, 5, 15, 'Automotive Accessories', 'Bosch', 'High Pressure Car Washer Machine', 'high-pressure-car-washer-machine', 'BOS-WSH-35',
  'High Pressure Car Washer Machine - high quality authentic product listed under Automotive Accessories. Complete manufacturer warranty and tested durability.', 6800, 8200, 17, 18, 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  36, 6, 16, 'Mobile Accessories', 'Realme Buds', 'True Wireless Bluetooth Earbuds', 'true-wireless-bluetooth-earbuds', 'RLM-TWS-36',
  'True Wireless Bluetooth Earbuds - high quality authentic product listed under Mobile Accessories. Complete manufacturer warranty and tested durability.', 2150, 2700, 20, 120, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  37, 7, 17, 'Footwear', 'Bata', 'Women Comfortable Block Heels', 'women-comfortable-block-heels', 'BAT-HEL-37',
  'Women Comfortable Block Heels - high quality authentic product listed under Footwear. Complete manufacturer warranty and tested durability.', 2250, 2800, 20, 55, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  38, 8, 18, 'Bags & Luggage', 'President', 'Hard Shell Luggage Trolley 24 inch', 'hard-shell-luggage-trolley-24-inch', 'PRS-TRL-38',
  'Hard Shell Luggage Trolley 24 inch - high quality authentic product listed under Bags & Luggage. Complete manufacturer warranty and tested durability.', 4950, 6200, 20, 24, 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  39, 9, 19, 'Watches & Jewelry', 'Amazfit', 'Smart Fitness Tracker Smartwatch', 'smart-fitness-tracker-smartwatch', 'AMZ-FIT-39',
  'Smart Fitness Tracker Smartwatch - high quality authentic product listed under Watches & Jewelry. Complete manufacturer warranty and tested durability.', 2850, 3500, 19, 90, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  40, 10, 20, 'Electronics Accessories', 'Ugreen', 'HDMI to VGA Converter Adapter', 'hdmi-to-vga-converter-adapter', 'UGR-H2V-40',
  'HDMI to VGA Converter Adapter - high quality authentic product listed under Electronics Accessories. Complete manufacturer warranty and tested durability.', 450, 600, 25, 180, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  41, 11, 1, 'Mobile Phones', 'Google', 'Google Pixel 8a 128GB', 'google-pixel-8a-128gb', 'GGL-PX8-41',
  'Google Pixel 8a 128GB - high quality authentic product listed under Mobile Phones. Complete manufacturer warranty and tested durability.', 56000, 60000, 7, 14, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  42, 12, 2, 'Laptops & Computers', 'Redragon', 'Mechanical Gaming Keyboard RGB', 'mechanical-gaming-keyboard-rgb', 'RDR-KBD-42',
  'Mechanical Gaming Keyboard RGB - high quality authentic product listed under Laptops & Computers. Complete manufacturer warranty and tested durability.', 3400, 4200, 19, 40, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  43, 13, 3, 'Men''s Fashion', 'Bay Emporium', 'Men Formal Oxford Shoes', 'men-formal-oxford-shoes', 'BAY-OXF-43',
  'Men Formal Oxford Shoes - high quality authentic product listed under Men''s Fashion. Complete manufacturer warranty and tested durability.', 4100, 5000, 18, 35, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  44, 14, 4, 'Women''s Fashion', 'Sailor', 'Designer Handcrafted Kurti', 'designer-handcrafted-kurti', 'SLR-KRT-44',
  'Designer Handcrafted Kurti - high quality authentic product listed under Women''s Fashion. Complete manufacturer warranty and tested durability.', 1850, 2400, 23, 65, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  45, 15, 5, 'Kids'' Fashion', 'Lotto Kids', 'Kids LED Sports Sneaker Shoes', 'kids-led-sports-sneaker-shoes', 'LOT-LED-45',
  'Kids LED Sports Sneaker Shoes - high quality authentic product listed under Kids'' Fashion. Complete manufacturer warranty and tested durability.', 1450, 1900, 24, 50, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  46, 1, 6, 'Home Appliances', 'Vision', 'Stand Fan with Remote Control 16 inch', 'stand-fan-with-remote-control-16-inch', 'VIS-FAN-46',
  'Stand Fan with Remote Control 16 inch - high quality authentic product listed under Home Appliances. Complete manufacturer warranty and tested durability.', 4600, 5400, 15, 30, 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  47, 2, 7, 'Kitchen & Dining', 'Philips', 'Multi-Blade Kitchen Food Processor', 'multi-blade-kitchen-food-processor', 'PHL-FP-47',
  'Multi-Blade Kitchen Food Processor - high quality authentic product listed under Kitchen & Dining. Complete manufacturer warranty and tested durability.', 5200, 6300, 17, 22, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  48, 3, 8, 'Furniture', 'Regal', 'Foldable Computer Study Desk', 'foldable-computer-study-desk', 'REG-DSK-48',
  'Foldable Computer Study Desk - high quality authentic product listed under Furniture. Complete manufacturer warranty and tested durability.', 4200, 5200, 19, 25, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  49, 4, 9, 'Groceries', 'Kazi & Kazi', 'Organic Green Tea 100 Bags', 'organic-green-tea-100-bags', 'KZI-TEA-49',
  'Organic Green Tea 100 Bags - high quality authentic product listed under Groceries. Complete manufacturer warranty and tested durability.', 380, 450, 16, 160, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);
INSERT INTO `products` (
  `id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`,
  `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`,
  `features_json`, `rating`, `review_count`, `is_published`, `is_approved`
)
VALUES (
  50, 5, 20, 'Electronics Accessories', 'Baseus', 'Fast USB-C to USB-C Braided Cable 2M', 'fast-usb-c-to-usb-c-braided-cable-2m', 'BAS-USBC-50',
  'Fast USB-C to USB-C Braided Cable 2M - high quality authentic product listed under Electronics Accessories. Complete manufacturer warranty and tested durability.', 420, 550, 24, 220, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0',
  '["100% Original Authentic Item","Official Brand Warranty Included","Fast 48-Hour Nationwide Delivery","7 Days Easy Return Policy"]', 4.8, 18, 1, 1
);

-- Insert 50 Orders, Order Items, and Payments
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (1, 'ORD-178876-1001', 17, 'Rafiqul Hossain', 'rafiqulhossain@example.com', '01512345678', 24900, 60, 0.00, 24960, 'NAGAD', 'PAID', 'SHIPPED', '{"fullName":"Rafiqul Hossain","phone":"01512345678","street":"Mirpur 10, Dhaka","city":"Dhaka","area":"Main Zone"}', NOW() - INTERVAL 38 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (1, 1, 1, 'Smartphone X10', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', 12450, 2, 24900);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (1, 24960, 'NAGAD', 'COMPLETED', 'TRX-889001', NOW() - INTERVAL 38 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (2, 'ORD-178876-1002', 18, 'Shirin Begum', 'shirinbegum@example.com', '01798765432', 29626.5, 60, 0.00, 29686.5, 'CASH', 'PAID', 'CONFIRMED', '{"fullName":"Shirin Begum","phone":"01798765432","street":"Sector 7, Uttara, Dhaka","city":"Dhaka","area":"Main Zone"}', NOW() - INTERVAL 23 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (2, 2, 2, 'Ultrabook 14 inch', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 9875.5, 3, 29626.5);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (2, 29686.5, 'CASH', 'COMPLETED', 'TRX-889002', NOW() - INTERVAL 23 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (3, 'ORD-178876-1003', 19, 'Mizanur Islam', 'mizanurislam@example.com', '01634567891', 1450, 60, 0.00, 1510, 'CARD', 'PAID', 'DELIVERED', '{"fullName":"Mizanur Islam","phone":"01634567891","street":"Sonadanga, Khulna","city":"Khulna","area":"Main Zone"}', NOW() - INTERVAL 8 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (3, 3, 3, 'Cotton Panjabi', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 1450, 1, 1450);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (3, 1510, 'CARD', 'COMPLETED', 'TRX-889003', NOW() - INTERVAL 8 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (4, 'ORD-178876-1004', 20, 'Tania Akter', 'taniaakter@example.com', '01856789012', 8400, 60, 0.00, 8460, 'BKASH', 'PAID', 'PROCESSING', '{"fullName":"Tania Akter","phone":"01856789012","street":"Chawkbazar, Chattogram","city":"Chattogram","area":"Main Zone"}', NOW() - INTERVAL 40 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (4, 4, 4, 'Silk Saree Elegance', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', 4200, 2, 8400);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (4, 8460, 'BKASH', 'COMPLETED', 'TRX-889004', NOW() - INTERVAL 40 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (5, 'ORD-178876-1005', 21, 'Arifur Rahman', 'arifurrahman@example.com', '01978901234', 3750, 60, 0.00, 3810, 'NAGAD', 'PAID', 'PENDING', '{"fullName":"Arifur Rahman","phone":"01978901234","street":"Shibganj, Sylhet","city":"Sylhet","area":"Main Zone"}', NOW() - INTERVAL 11 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (5, 5, 5, 'Kids Denim Dungaree', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea', 1250, 3, 3750);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (5, 3810, 'NAGAD', 'COMPLETED', 'TRX-889005', NOW() - INTERVAL 11 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (6, 'ORD-178876-1006', 22, 'Salma Khatun', 'salmakhatun@example.com', '01711223344', 54000, 60, 0.00, 54060, 'CASH', 'PAID', 'DELIVERED', '{"fullName":"Salma Khatun","phone":"01711223344","street":"Rajpara, Rajshahi","city":"Rajshahi","area":"Main Zone"}', NOW() - INTERVAL 43 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (6, 6, 6, 'Inverter Air Conditioner 1.5 Ton', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e', 54000, 1, 54000);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (6, 54060, 'CASH', 'COMPLETED', 'TRX-889006', NOW() - INTERVAL 43 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (7, 'ORD-178876-1007', 23, 'Jahangir Alom', 'jahangiralom@example.com', '01822334455', 7600, 60, 0.00, 7660, 'CARD', 'PAID', 'SHIPPED', '{"fullName":"Jahangir Alom","phone":"01822334455","street":"Bandar, Narayanganj","city":"Narayanganj","area":"Main Zone"}', NOW() - INTERVAL 23 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (7, 7, 7, 'Non-Stick Cookware Set 7 Pcs', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7', 3800, 2, 7600);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (7, 7660, 'CARD', 'COMPLETED', 'TRX-889007', NOW() - INTERVAL 23 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (8, 'ORD-178876-1008', 24, 'Fahmida Akter', 'fahmidaakter@example.com', '01933445566', 19500, 60, 0.00, 19560, 'BKASH', 'PAID', 'CONFIRMED', '{"fullName":"Fahmida Akter","phone":"01933445566","street":"Kandirpar, Cumilla","city":"Cumilla","area":"Main Zone"}', NOW() - INTERVAL 40 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (8, 8, 8, 'Ergonomic Mesh Office Chair', 'https://images.unsplash.com/photo-1580481077194-43666f2095f9', 6500, 3, 19500);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (8, 19560, 'BKASH', 'COMPLETED', 'TRX-889008', NOW() - INTERVAL 40 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (9, 'ORD-178876-1009', 25, 'Kawsar Habib', 'kawsarhabib@example.com', '01644556677', 680, 60, 0.00, 740, 'NAGAD', 'PAID', 'DELIVERED', '{"fullName":"Kawsar Habib","phone":"01644556677","street":"Court Road, Bogura","city":"Bogura","area":"Main Zone"}', NOW() - INTERVAL 45 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (9, 9, 9, 'Premium Basmati Rice 5kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 680, 1, 680);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (9, 740, 'NAGAD', 'COMPLETED', 'TRX-889009', NOW() - INTERVAL 45 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (10, 'ORD-178876-1010', 26, 'Rubina Yesmin', 'rubinayesmin@example.com', '01555667788', 2300, 60, 0.00, 2360, 'CASH', 'PAID', 'PROCESSING', '{"fullName":"Rubina Yesmin","phone":"01555667788","street":"Sadur Mor, Rangpur","city":"Rangpur","area":"Main Zone"}', NOW() - INTERVAL 19 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (10, 10, 10, 'Vitamin C Brightening Serum 30ml', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 1150, 2, 2300);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (10, 2360, 'CASH', 'COMPLETED', 'TRX-889010', NOW() - INTERVAL 19 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (11, 'ORD-178876-1011', 27, 'Hasan Mahmud', 'hasanmahmud@example.com', '01766778899', 6300, 60, 0.00, 6360, 'CARD', 'PAID', 'PENDING', '{"fullName":"Hasan Mahmud","phone":"01766778899","street":"Town Hall, Mymensingh","city":"Mymensingh","area":"Main Zone"}', NOW() - INTERVAL 35 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (11, 11, 11, 'Digital Blood Pressure Monitor', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 2100, 3, 6300);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (11, 6360, 'CARD', 'COMPLETED', 'TRX-889011', NOW() - INTERVAL 35 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (12, 'ORD-178876-1012', 28, 'Nasima Khondoker', 'nasimakhondoker@example.com', '01877889900', 3200, 60, 0.00, 3260, 'BKASH', 'PAID', 'DELIVERED', '{"fullName":"Nasima Khondoker","phone":"01877889900","street":"Natun Bazar, Barishal","city":"Barishal","area":"Main Zone"}', NOW() - INTERVAL 19 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (12, 12, 12, 'Carbon Fiber Badminton Racket', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea', 3200, 1, 3200);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (12, 3260, 'BKASH', 'COMPLETED', 'TRX-889012', NOW() - INTERVAL 19 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (13, 'ORD-178876-1013', 29, 'Asraful Alam', 'asrafulalam@example.com', '01988990011', 1900, 60, 0.00, 1960, 'NAGAD', 'PAID', 'SHIPPED', '{"fullName":"Asraful Alam","phone":"01988990011","street":"Boro Bazar, Jashore","city":"Jashore","area":"Main Zone"}', NOW() - INTERVAL 42 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (13, 13, 13, 'Classic Fountain Pen & Notebook Set', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd', 950, 2, 1900);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (13, 1960, 'NAGAD', 'COMPLETED', 'TRX-889013', NOW() - INTERVAL 42 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (14, 'ORD-178876-1014', 30, 'Faruk Ahmed', 'farukahmed@example.com', '01699001122', 5250, 60, 0.00, 5310, 'CASH', 'PAID', 'CONFIRMED', '{"fullName":"Faruk Ahmed","phone":"01699001122","street":"Sadar Road, Dinajpur","city":"Dinajpur","area":"Main Zone"}', NOW() - INTERVAL 40 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (14, 14, 14, 'Magnetic Educational Building Blocks', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', 1750, 3, 5250);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (14, 5310, 'CASH', 'COMPLETED', 'TRX-889014', NOW() - INTERVAL 40 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (15, 'ORD-178876-1015', 31, 'Maruf Hossain', 'marufhossain@example.com', '01700112233', 2450, 60, 0.00, 2510, 'CARD', 'PAID', 'DELIVERED', '{"fullName":"Maruf Hossain","phone":"01700112233","street":"College Gate, Tangail","city":"Tangail","area":"Main Zone"}', NOW() - INTERVAL 30 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (15, 15, 15, 'Multi-Function Car Tire Inflator', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738', 2450, 1, 2450);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (15, 2510, 'CARD', 'COMPLETED', 'TRX-889015', NOW() - INTERVAL 30 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (16, 'ORD-178876-1016', 32, 'Sabrina Sharmin', 'sabrinasharmin@example.com', '01811223355', 3700, 60, 0.00, 3760, 'BKASH', 'PAID', 'PROCESSING', '{"fullName":"Sabrina Sharmin","phone":"01811223355","street":"Station Road, Pabna","city":"Pabna","area":"Main Zone"}', NOW() - INTERVAL 9 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (16, 16, 1, 'Fast Charging 65W GaN Charger', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', 1850, 2, 3700);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (16, 3760, 'BKASH', 'COMPLETED', 'TRX-889016', NOW() - INTERVAL 9 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (17, 'ORD-178876-1017', 33, 'Lutfor Rahman', 'lutforrahman@example.com', '01922334466', 10350, 60, 0.00, 10410, 'NAGAD', 'PAID', 'PENDING', '{"fullName":"Lutfor Rahman","phone":"01922334466","street":"Hospital Mor, Kushtia","city":"Kushtia","area":"Main Zone"}', NOW() - INTERVAL 24 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (17, 17, 2, 'Men Genuine Leather Loafers', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509', 3450, 3, 10350);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (17, 10410, 'NAGAD', 'COMPLETED', 'TRX-889017', NOW() - INTERVAL 24 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (18, 'ORD-178876-1018', 34, 'Samia Sultana', 'samiasultana@example.com', '01533445577', 2650, 60, 0.00, 2710, 'CASH', 'PAID', 'DELIVERED', '{"fullName":"Samia Sultana","phone":"01533445577","street":"Main Road, Gazipur","city":"Gazipur","area":"Main Zone"}', NOW() - INTERVAL 9 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (18, 18, 3, 'Water-Resistant Travel Backpack 35L', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 2650, 1, 2650);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (18, 2710, 'CASH', 'COMPLETED', 'TRX-889018', NOW() - INTERVAL 9 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (19, 'ORD-178876-1019', 35, 'Rezwanul Karim', 'rezwanulkarim@example.com', '01744556688', 11600, 60, 0.00, 11660, 'CARD', 'PAID', 'SHIPPED', '{"fullName":"Rezwanul Karim","phone":"01744556688","street":"Court Point, Coxs Bazar","city":"Coxs Bazar","area":"Main Zone"}', NOW() - INTERVAL 2 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (19, 19, 4, 'Stainless Steel Chronograph Watch', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', 5800, 2, 11600);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (19, 11660, 'CARD', 'COMPLETED', 'TRX-889019', NOW() - INTERVAL 2 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (20, 'ORD-178876-1020', 36, 'Nazneen Ferdaus', 'nazneenferdaus@example.com', '01855667799', 1950, 60, 0.00, 2010, 'BKASH', 'PAID', 'CONFIRMED', '{"fullName":"Nazneen Ferdaus","phone":"01855667799","street":"Sadar Hospital Road, Feni","city":"Feni","area":"Main Zone"}', NOW() - INTERVAL 18 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (20, 20, 5, 'Extension Socket 4-Way with Surge Protection', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 650, 3, 1950);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (20, 2010, 'BKASH', 'COMPLETED', 'TRX-889020', NOW() - INTERVAL 18 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (21, 'ORD-178876-1021', 37, 'Habibur Rahman', 'habiburrahman@example.com', '01966778800', 42500, 60, 0.00, 42560, 'NAGAD', 'PAID', 'DELIVERED', '{"fullName":"Habibur Rahman","phone":"01966778800","street":"Purana Paltan, Dhaka","city":"Dhaka","area":"Main Zone"}', NOW() - INTERVAL 30 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (21, 21, 6, 'Samsung Galaxy A55 5G', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', 42500, 1, 42500);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (21, 42560, 'NAGAD', 'COMPLETED', 'TRX-889021', NOW() - INTERVAL 30 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (22, 'ORD-178876-1022', 38, 'Rokeya Begum', 'rokeyabegum@example.com', '01677889911', 236000, 60, 0.00, 236060, 'CASH', 'PAID', 'PROCESSING', '{"fullName":"Rokeya Begum","phone":"01677889911","street":"Gopalgonj Sadar","city":"Gopalgonj","area":"Main Zone"}', NOW() - INTERVAL 31 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (22, 22, 7, 'MacBook Air M2 13.6-inch', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 118000, 2, 236000);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (22, 236060, 'CASH', 'COMPLETED', 'TRX-889022', NOW() - INTERVAL 31 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (23, 'ORD-178876-1023', 39, 'Imran Hossain', 'imranhossain@example.com', '01788990022', 4950, 60, 0.00, 5010, 'CARD', 'PAID', 'PENDING', '{"fullName":"Imran Hossain","phone":"01788990022","street":"Chawkbazar, Barishal","city":"Barishal","area":"Main Zone"}', NOW() - INTERVAL 41 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (23, 23, 8, 'Slim Fit Casual Denim Shirt', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 1650, 3, 4950);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (23, 5010, 'CARD', 'COMPLETED', 'TRX-889023', NOW() - INTERVAL 41 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (24, 'ORD-178876-1024', 40, 'Nazia Parveen', 'naziaparveen@example.com', '01899001133', 3800, 60, 0.00, 3860, 'BKASH', 'PAID', 'DELIVERED', '{"fullName":"Nazia Parveen","phone":"01899001133","street":"Shyamoli, Dhaka","city":"Dhaka","area":"Main Zone"}', NOW() - INTERVAL 42 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (24, 24, 9, 'Embroidered Lawn Three Piece', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b', 3800, 1, 3800);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (24, 3860, 'BKASH', 'COMPLETED', 'TRX-889024', NOW() - INTERVAL 42 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (25, 'ORD-178876-1025', 41, 'Anwar Hossain', 'anwarhossain@example.com', '01900112244', 1980, 60, 0.00, 2040, 'NAGAD', 'PAID', 'SHIPPED', '{"fullName":"Anwar Hossain","phone":"01900112244","street":"Halishahar, Chattogram","city":"Chattogram","area":"Main Zone"}', NOW() - INTERVAL 22 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (25, 25, 10, 'Baby Soft Cotton Romper 3-Pack', 'https://images.unsplash.com/photo-1522771930-78848d9293e8', 990, 2, 1980);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (25, 2040, 'NAGAD', 'COMPLETED', 'TRX-889025', NOW() - INTERVAL 22 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (26, 'ORD-178876-1026', 42, 'Khadijatul Habiba', 'khadijatulhabiba@example.com', '01511223366', 55500, 60, 0.00, 55560, 'CASH', 'PAID', 'CONFIRMED', '{"fullName":"Khadijatul Habiba","phone":"01511223366","street":"Amborkhana, Sylhet","city":"Sylhet","area":"Main Zone"}', NOW() - INTERVAL 18 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (26, 26, 11, 'Smart Microwave Oven 28L', 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', 18500, 3, 55500);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (26, 55560, 'CASH', 'COMPLETED', 'TRX-889026', NOW() - INTERVAL 18 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (27, 'ORD-178876-1027', 43, 'Moniruzzaman', 'moniruzzaman@example.com', '01722334477', 2950, 60, 0.00, 3010, 'CARD', 'PAID', 'DELIVERED', '{"fullName":"Moniruzzaman","phone":"01722334477","street":"Zero Point, Rajshahi","city":"Rajshahi","area":"Main Zone"}', NOW() - INTERVAL 4 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (27, 27, 12, 'Electric Rice Cooker 2.8L', 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b', 2950, 1, 2950);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (27, 3010, 'CARD', 'COMPLETED', 'TRX-889027', NOW() - INTERVAL 4 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (28, 'ORD-178876-1028', 44, 'Bilkis Panna', 'bilkispanna@example.com', '01833445588', 64000, 60, 0.00, 64060, 'BKASH', 'PAID', 'PROCESSING', '{"fullName":"Bilkis Panna","phone":"01833445588","street":"Khan Jahan Ali Road, Khulna","city":"Khulna","area":"Main Zone"}', NOW() - INTERVAL 42 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (28, 28, 13, 'Wooden 6-Seater Dining Table', 'https://images.unsplash.com/photo-1617806118233-18e1de247200', 32000, 2, 64000);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (28, 64060, 'BKASH', 'COMPLETED', 'TRX-889028', NOW() - INTERVAL 42 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (29, 'ORD-178876-1029', 45, 'Sajjad Hossain', 'sajjadhossain@example.com', '01944556699', 1320, 60, 0.00, 1380, 'NAGAD', 'PAID', 'PENDING', '{"fullName":"Sajjad Hossain","phone":"01944556699","street":"Badarganj Road, Rangpur","city":"Rangpur","area":"Main Zone"}', NOW() - INTERVAL 41 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (29, 29, 14, 'Pure Mustard Oil 2 Liters', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', 440, 3, 1320);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (29, 1380, 'NAGAD', 'COMPLETED', 'TRX-889029', NOW() - INTERVAL 41 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (30, 'ORD-178876-1030', 46, 'Poly Chowdhury', 'polychowdhury@example.com', '01823456789', 850, 60, 0.00, 910, 'CASH', 'PAID', 'DELIVERED', '{"fullName":"Poly Chowdhury","phone":"01823456789","street":"Boalia, Rajshahi","city":"Rajshahi","area":"Main Zone"}', NOW() - INTERVAL 18 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (30, 30, 15, 'Gentle Facial Cleanser 150ml', 'https://images.unsplash.com/photo-1556228720-195a672e8a03', 850, 1, 850);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (30, 910, 'CASH', 'COMPLETED', 'TRX-889030', NOW() - INTERVAL 18 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (31, 'ORD-178876-1031', 17, 'Rafiqul Hossain', 'rafiqulhossain@example.com', '01512345678', 2900, 60, 0.00, 2960, 'CARD', 'PAID', 'SHIPPED', '{"fullName":"Rafiqul Hossain","phone":"01512345678","street":"Mirpur 10, Dhaka","city":"Dhaka","area":"Main Zone"}', NOW() - INTERVAL 13 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (31, 31, 1, 'Electric Heating Heating Pad', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843', 1450, 2, 2900);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (31, 2960, 'CARD', 'COMPLETED', 'TRX-889031', NOW() - INTERVAL 13 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (32, 'ORD-178876-1032', 18, 'Shirin Begum', 'shirinbegum@example.com', '01798765432', 14400, 60, 0.00, 14460, 'BKASH', 'PAID', 'CONFIRMED', '{"fullName":"Shirin Begum","phone":"01798765432","street":"Sector 7, Uttara, Dhaka","city":"Dhaka","area":"Main Zone"}', NOW() - INTERVAL 28 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (32, 32, 2, 'Professional Gym Dumbbell Set 20kg', 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a', 4800, 3, 14400);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (32, 14460, 'BKASH', 'COMPLETED', 'TRX-889032', NOW() - INTERVAL 28 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (33, 'ORD-178876-1033', 19, 'Mizanur Islam', 'mizanurislam@example.com', '01634567891', 2350, 60, 0.00, 2410, 'NAGAD', 'PAID', 'DELIVERED', '{"fullName":"Mizanur Islam","phone":"01634567891","street":"Sonadanga, Khulna","city":"Khulna","area":"Main Zone"}', NOW() - INTERVAL 38 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (33, 33, 3, 'Wireless Laser Barcode Scanner', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147', 2350, 1, 2350);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (33, 2410, 'NAGAD', 'COMPLETED', 'TRX-889033', NOW() - INTERVAL 38 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (34, 'ORD-178876-1034', 20, 'Tania Akter', 'taniaakter@example.com', '01856789012', 3300, 60, 0.00, 3360, 'CASH', 'PAID', 'PROCESSING', '{"fullName":"Tania Akter","phone":"01856789012","street":"Chawkbazar, Chattogram","city":"Chattogram","area":"Main Zone"}', NOW() - INTERVAL 34 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (34, 34, 4, 'Remote Control RC Stunt Car', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f', 1650, 2, 3300);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (34, 3360, 'CASH', 'COMPLETED', 'TRX-889034', NOW() - INTERVAL 34 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (35, 'ORD-178876-1035', 21, 'Arifur Rahman', 'arifurrahman@example.com', '01978901234', 20400, 60, 0.00, 20460, 'CARD', 'PAID', 'PENDING', '{"fullName":"Arifur Rahman","phone":"01978901234","street":"Shibganj, Sylhet","city":"Sylhet","area":"Main Zone"}', NOW() - INTERVAL 15 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (35, 35, 5, 'High Pressure Car Washer Machine', 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f', 6800, 3, 20400);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (35, 20460, 'CARD', 'COMPLETED', 'TRX-889035', NOW() - INTERVAL 15 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (36, 'ORD-178876-1036', 22, 'Salma Khatun', 'salmakhatun@example.com', '01711223344', 2150, 60, 0.00, 2210, 'BKASH', 'PAID', 'DELIVERED', '{"fullName":"Salma Khatun","phone":"01711223344","street":"Rajpara, Rajshahi","city":"Rajshahi","area":"Main Zone"}', NOW() - INTERVAL 38 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (36, 36, 6, 'True Wireless Bluetooth Earbuds', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', 2150, 1, 2150);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (36, 2210, 'BKASH', 'COMPLETED', 'TRX-889036', NOW() - INTERVAL 38 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (37, 'ORD-178876-1037', 23, 'Jahangir Alom', 'jahangiralom@example.com', '01822334455', 4500, 60, 0.00, 4560, 'NAGAD', 'PAID', 'SHIPPED', '{"fullName":"Jahangir Alom","phone":"01822334455","street":"Bandar, Narayanganj","city":"Narayanganj","area":"Main Zone"}', NOW() - INTERVAL 5 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (37, 37, 7, 'Women Comfortable Block Heels', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2', 2250, 2, 4500);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (37, 4560, 'NAGAD', 'COMPLETED', 'TRX-889037', NOW() - INTERVAL 5 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (38, 'ORD-178876-1038', 24, 'Fahmida Akter', 'fahmidaakter@example.com', '01933445566', 14850, 60, 0.00, 14910, 'CASH', 'PAID', 'CONFIRMED', '{"fullName":"Fahmida Akter","phone":"01933445566","street":"Kandirpar, Cumilla","city":"Cumilla","area":"Main Zone"}', NOW() - INTERVAL 42 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (38, 38, 8, 'Hard Shell Luggage Trolley 24 inch', 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87', 4950, 3, 14850);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (38, 14910, 'CASH', 'COMPLETED', 'TRX-889038', NOW() - INTERVAL 42 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (39, 'ORD-178876-1039', 25, 'Kawsar Habib', 'kawsarhabib@example.com', '01644556677', 2850, 60, 0.00, 2910, 'CARD', 'PAID', 'DELIVERED', '{"fullName":"Kawsar Habib","phone":"01644556677","street":"Court Road, Bogura","city":"Bogura","area":"Main Zone"}', NOW() - INTERVAL 7 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (39, 39, 9, 'Smart Fitness Tracker Smartwatch', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1', 2850, 1, 2850);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (39, 2910, 'CARD', 'COMPLETED', 'TRX-889039', NOW() - INTERVAL 7 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (40, 'ORD-178876-1040', 26, 'Rubina Yesmin', 'rubinayesmin@example.com', '01555667788', 900, 60, 0.00, 960, 'BKASH', 'PAID', 'PROCESSING', '{"fullName":"Rubina Yesmin","phone":"01555667788","street":"Sadur Mor, Rangpur","city":"Rangpur","area":"Main Zone"}', NOW() - INTERVAL 33 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (40, 40, 10, 'HDMI to VGA Converter Adapter', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 450, 2, 900);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (40, 960, 'BKASH', 'COMPLETED', 'TRX-889040', NOW() - INTERVAL 33 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (41, 'ORD-178876-1041', 27, 'Hasan Mahmud', 'hasanmahmud@example.com', '01766778899', 168000, 60, 0.00, 168060, 'NAGAD', 'PAID', 'PENDING', '{"fullName":"Hasan Mahmud","phone":"01766778899","street":"Town Hall, Mymensingh","city":"Mymensingh","area":"Main Zone"}', NOW() - INTERVAL 8 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (41, 41, 11, 'Google Pixel 8a 128GB', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 56000, 3, 168000);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (41, 168060, 'NAGAD', 'COMPLETED', 'TRX-889041', NOW() - INTERVAL 8 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (42, 'ORD-178876-1042', 28, 'Nasima Khondoker', 'nasimakhondoker@example.com', '01877889900', 3400, 60, 0.00, 3460, 'CASH', 'PAID', 'DELIVERED', '{"fullName":"Nasima Khondoker","phone":"01877889900","street":"Natun Bazar, Barishal","city":"Barishal","area":"Main Zone"}', NOW() - INTERVAL 31 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (42, 42, 12, 'Mechanical Gaming Keyboard RGB', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', 3400, 1, 3400);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (42, 3460, 'CASH', 'COMPLETED', 'TRX-889042', NOW() - INTERVAL 31 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (43, 'ORD-178876-1043', 29, 'Asraful Alam', 'asrafulalam@example.com', '01988990011', 8200, 60, 0.00, 8260, 'CARD', 'PAID', 'SHIPPED', '{"fullName":"Asraful Alam","phone":"01988990011","street":"Boro Bazar, Jashore","city":"Jashore","area":"Main Zone"}', NOW() - INTERVAL 17 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (43, 43, 13, 'Men Formal Oxford Shoes', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4', 4100, 2, 8200);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (43, 8260, 'CARD', 'COMPLETED', 'TRX-889043', NOW() - INTERVAL 17 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (44, 'ORD-178876-1044', 30, 'Faruk Ahmed', 'farukahmed@example.com', '01699001122', 5550, 60, 0.00, 5610, 'BKASH', 'PAID', 'CONFIRMED', '{"fullName":"Faruk Ahmed","phone":"01699001122","street":"Sadar Road, Dinajpur","city":"Dinajpur","area":"Main Zone"}', NOW() - INTERVAL 12 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (44, 44, 14, 'Designer Handcrafted Kurti', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb', 1850, 3, 5550);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (44, 5610, 'BKASH', 'COMPLETED', 'TRX-889044', NOW() - INTERVAL 12 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (45, 'ORD-178876-1045', 31, 'Maruf Hossain', 'marufhossain@example.com', '01700112233', 1450, 60, 0.00, 1510, 'NAGAD', 'PAID', 'DELIVERED', '{"fullName":"Maruf Hossain","phone":"01700112233","street":"College Gate, Tangail","city":"Tangail","area":"Main Zone"}', NOW() - INTERVAL 28 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (45, 45, 15, 'Kids LED Sports Sneaker Shoes', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782', 1450, 1, 1450);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (45, 1510, 'NAGAD', 'COMPLETED', 'TRX-889045', NOW() - INTERVAL 28 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (46, 'ORD-178876-1046', 32, 'Sabrina Sharmin', 'sabrinasharmin@example.com', '01811223355', 9200, 60, 0.00, 9260, 'CASH', 'PAID', 'PROCESSING', '{"fullName":"Sabrina Sharmin","phone":"01811223355","street":"Station Road, Pabna","city":"Pabna","area":"Main Zone"}', NOW() - INTERVAL 22 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (46, 46, 1, 'Stand Fan with Remote Control 16 inch', 'https://images.unsplash.com/photo-1563245372-f21724e3856d', 4600, 2, 9200);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (46, 9260, 'CASH', 'COMPLETED', 'TRX-889046', NOW() - INTERVAL 22 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (47, 'ORD-178876-1047', 33, 'Lutfor Rahman', 'lutforrahman@example.com', '01922334466', 15600, 60, 0.00, 15660, 'CARD', 'PAID', 'PENDING', '{"fullName":"Lutfor Rahman","phone":"01922334466","street":"Hospital Mor, Kushtia","city":"Kushtia","area":"Main Zone"}', NOW() - INTERVAL 34 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (47, 47, 2, 'Multi-Blade Kitchen Food Processor', 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', 5200, 3, 15600);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (47, 15660, 'CARD', 'COMPLETED', 'TRX-889047', NOW() - INTERVAL 34 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (48, 'ORD-178876-1048', 34, 'Samia Sultana', 'samiasultana@example.com', '01533445577', 4200, 60, 0.00, 4260, 'BKASH', 'PAID', 'DELIVERED', '{"fullName":"Samia Sultana","phone":"01533445577","street":"Main Road, Gazipur","city":"Gazipur","area":"Main Zone"}', NOW() - INTERVAL 38 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (48, 48, 3, 'Foldable Computer Study Desk', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', 4200, 1, 4200);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (48, 4260, 'BKASH', 'COMPLETED', 'TRX-889048', NOW() - INTERVAL 38 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (49, 'ORD-178876-1049', 35, 'Rezwanul Karim', 'rezwanulkarim@example.com', '01744556688', 760, 60, 0.00, 820, 'NAGAD', 'PAID', 'SHIPPED', '{"fullName":"Rezwanul Karim","phone":"01744556688","street":"Court Point, Coxs Bazar","city":"Coxs Bazar","area":"Main Zone"}', NOW() - INTERVAL 6 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (49, 49, 4, 'Organic Green Tea 100 Bags', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3', 380, 2, 760);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (49, 820, 'NAGAD', 'COMPLETED', 'TRX-889049', NOW() - INTERVAL 6 DAY);
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`)
VALUES (50, 'ORD-178876-1050', 36, 'Nazneen Ferdaus', 'nazneenferdaus@example.com', '01855667799', 1260, 60, 0.00, 1320, 'CASH', 'PAID', 'CONFIRMED', '{"fullName":"Nazneen Ferdaus","phone":"01855667799","street":"Sadar Hospital Road, Feni","city":"Feni","area":"Main Zone"}', NOW() - INTERVAL 41 DAY);
INSERT INTO `order_items` (`order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`)
VALUES (50, 50, 5, 'Fast USB-C to USB-C Braided Cable 2M', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', 420, 3, 1260);
INSERT INTO `payments` (`order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`)
VALUES (50, 1320, 'CASH', 'COMPLETED', 'TRX-889050', NOW() - INTERVAL 41 DAY);

-- Populate Initial Revenue for 15 Shop Owners
INSERT INTO `revenue` (`owner_id`, `total_revenue`)
SELECT
  v.owner_id,
  SUM(oi.subtotal) AS total_revenue
FROM `order_items` oi
JOIN `vendors` v ON oi.vendor_id = v.id
JOIN `orders` o ON oi.order_id = o.id
JOIN `payments` pay ON pay.order_id = o.id
WHERE pay.payment_status IN ('COMPLETED', 'PAID')
GROUP BY v.owner_id
ON DUPLICATE KEY UPDATE total_revenue = VALUES(total_revenue);

-- Seed Baseline Site Settings
INSERT INTO `site_settings` (`id`, `site_name`, `support_phone`, `support_email`, `announcement_text`, `hero_config_json`, `banners_json`)
VALUES (1, 'SELLORA Multi-Vendor Bangladesh', '+880 9612-345678', 'support@sellora.com', 'Welcome to SELLORA Multi-Vendor Marketplace - Enjoy Free Shipping on orders over BDT 5,000!', '{"title":"Discover Amazing Deals Across Bangladesh","subtitle":"Over 50+ Verified Multi-Vendor Stores with 100% Genuine Guaranteed Products","badge":"Mega Summer Sale 2026"}', '[{"id":1,"title":"Super Gadget Deals","discount":"Up to 35% OFF","link":"/campaigns/electronics","image":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e"},{"id":2,"title":"Lifestyle & Fashion Week","discount":"Flat 25% OFF","link":"/campaigns/fashion","image":"https://images.unsplash.com/photo-1445205170230-053b83016050"}]');

SET FOREIGN_KEY_CHECKS = 1;
-- End of SELLORA Database Initialization Script
