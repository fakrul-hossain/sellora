-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 07, 2026 at 10:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sellora_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddProduct` (IN `p_owner_id` INT, IN `p_category_id` INT, IN `p_product_name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, IN `p_description` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, IN `p_price` DECIMAL(10,2), IN `p_stock_qty` INT)   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `Checkout` (IN `p_customer_id` INT, OUT `p_order_id` INT)   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `RegisterUser` (IN `p_username` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, IN `p_password` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, IN `p_email` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, IN `p_role` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci)   BEGIN
  INSERT INTO `users` (`name`, `username`, `email`, `password_hash`, `role`)
  VALUES (p_username, p_username, p_email, p_password, p_role);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SearchProducts` (IN `p_keyword` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci)   BEGIN
  SELECT p.id AS product_id, p.title AS product_name, p.description, p.price,
         p.stock AS stock_qty, c.name AS category_name, v.store_name AS store_owner
  FROM `products` p
  LEFT JOIN `categories` c ON p.category_id = c.id
  LEFT JOIN `vendors` v ON p.vendor_id = v.id
  WHERE p.title LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci
     OR c.name LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci
     OR p.category LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ViewOrdersByOwner` (IN `p_owner_id` INT)   BEGIN
  SELECT o.id AS order_id, o.created_at AS order_date, o.customer_name,
         oi.title AS product_name, oi.quantity, oi.price, o.order_status AS status
  FROM `order_items` oi
  JOIN `orders` o ON oi.order_id = o.id
  JOIN `vendors` v ON oi.vendor_id = v.id
  WHERE v.owner_id = p_owner_id
  ORDER BY o.created_at DESC;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT 'System',
  `action` varchar(100) NOT NULL,
  `module` varchar(100) NOT NULL,
  `target_id` varchar(100) DEFAULT NULL,
  `details_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details_json`)),
  `ip_address` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `user_name`, `action`, `module`, `target_id`, `details_json`, `ip_address`, `created_at`) VALUES
(1, NULL, 'Admin', 'ADMIN_REJECTED_PRODUCT', 'PRODUCTS', '1', '{\"title\":\"Smartphone X10\",\"isApproved\":false}', '127.0.0.1', '2026-09-07 13:47:05'),
(2, NULL, 'Admin', 'ADMIN_APPROVED_PRODUCT', 'PRODUCTS', '1', '{\"title\":\"Smartphone X10\",\"isApproved\":true}', '127.0.0.1', '2026-09-07 13:47:08'),
(3, NULL, 'Admin', 'ADMIN_APPROVED_PRODUCT', 'PRODUCTS', '51', '{\"title\":\"tes\",\"isApproved\":true}', '127.0.0.1', '2026-09-07 14:29:29');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `icon`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Mobile Phones', 'mobile-phones', 'smartphone', 'Smartphones and feature phones from all major brands', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(2, NULL, 'Laptops & Computers', 'laptops-computers', 'laptop', 'Laptops, desktops, and computer peripherals', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(3, NULL, 'Men\'s Fashion', 'mens-fashion', 'shirt', 'Clothing and accessories for men', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(4, NULL, 'Women\'s Fashion', 'womens-fashion', 'sparkles', 'Clothing and accessories for women', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(5, NULL, 'Kids\' Fashion', 'kids-fashion', 'smile', 'Clothing and footwear for children', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(6, NULL, 'Home Appliances', 'home-appliances', 'tv', 'Appliances for everyday home use', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(7, NULL, 'Kitchen & Dining', 'kitchen-dining', 'utensils', 'Cookware, dinnerware, and kitchen tools', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(8, NULL, 'Furniture', 'furniture', 'sofa', 'Home and office furniture', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(9, NULL, 'Groceries', 'groceries', 'shopping-basket', 'Daily grocery and food essentials', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(10, NULL, 'Beauty & Personal Care', 'beauty-personal-care', 'heart', 'Skincare, haircare, and personal hygiene products', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(11, NULL, 'Health & Wellness', 'health-wellness', 'activity', 'Health monitoring and wellness products', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(12, NULL, 'Sports & Outdoor', 'sports-outdoor', 'trophy', 'Sports gear and outdoor equipment', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(13, NULL, 'Books & Stationery', 'books-stationery', 'book', 'Books, notebooks, and office stationery', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(14, NULL, 'Toys & Games', 'toys-games', 'gamepad-2', 'Toys and games for children', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(15, NULL, 'Automotive Accessories', 'automotive-accessories', 'car', 'Accessories and gadgets for vehicles', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(16, NULL, 'Mobile Accessories', 'mobile-accessories', 'headphones', 'Chargers, cases, and other phone accessories', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(17, NULL, 'Footwear', 'footwear', 'footprints', 'Shoes and sandals for all ages', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(18, NULL, 'Bags & Luggage', 'bags-luggage', 'briefcase', 'Bags, backpacks, and travel luggage', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(19, NULL, 'Watches & Jewelry', 'watches-jewelry', 'watch', 'Watches and fashion jewelry', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(20, NULL, 'Electronics Accessories', 'electronics-accessories', 'plug', 'Cables, adapters, and small electronics', 'ACTIVE', '2026-09-07 12:59:38', '2026-09-07 12:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `discount_type` enum('PERCENTAGE','FIXED') NOT NULL DEFAULT 'PERCENTAGE',
  `discount_value` decimal(12,2) NOT NULL,
  `min_spend` decimal(12,2) DEFAULT 0.00,
  `max_discount` decimal(12,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `valid_till` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(100) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `shipping_fee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'CASH_ON_DELIVERY',
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `order_status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `shipping_address_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shipping_address_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `subtotal`, `shipping_fee`, `discount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `shipping_address_json`, `created_at`, `updated_at`) VALUES
(1, 'ORD-178876-1001', 17, 'Rafiqul Hossain', 'rafiqulhossain@example.com', '01512345678', 24900.00, 60.00, 0.00, 24960.00, 'STRIPE_CARD', 'PAID', 'CONFIRMED', '{\"fullName\":\"Rafiqul Hossain\",\"phone\":\"01512345678\",\"street\":\"Mirpur 10, Dhaka\",\"city\":\"Dhaka\",\"area\":\"Main Zone\"}', '2026-07-31 12:59:38', '2026-09-07 13:26:35'),
(2, 'ORD-178876-1002', 18, 'Shirin Begum', 'shirinbegum@example.com', '01798765432', 29626.50, 60.00, 0.00, 29686.50, 'CASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Shirin Begum\",\"phone\":\"01798765432\",\"street\":\"Sector 7, Uttara, Dhaka\",\"city\":\"Dhaka\",\"area\":\"Main Zone\"}', '2026-08-15 12:59:38', '2026-09-07 12:59:38'),
(3, 'ORD-178876-1003', 19, 'Mizanur Islam', 'mizanurislam@example.com', '01634567891', 1450.00, 60.00, 0.00, 1510.00, 'CARD', 'PAID', 'DELIVERED', '{\"fullName\":\"Mizanur Islam\",\"phone\":\"01634567891\",\"street\":\"Sonadanga, Khulna\",\"city\":\"Khulna\",\"area\":\"Main Zone\"}', '2026-08-30 12:59:38', '2026-09-07 12:59:38'),
(4, 'ORD-178876-1004', 20, 'Tania Akter', 'taniaakter@example.com', '01856789012', 8400.00, 60.00, 0.00, 8460.00, 'BKASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Tania Akter\",\"phone\":\"01856789012\",\"street\":\"Chawkbazar, Chattogram\",\"city\":\"Chattogram\",\"area\":\"Main Zone\"}', '2026-07-29 12:59:38', '2026-09-07 12:59:38'),
(5, 'ORD-178876-1005', 21, 'Arifur Rahman', 'arifurrahman@example.com', '01978901234', 3750.00, 60.00, 0.00, 3810.00, 'NAGAD', 'PAID', 'PENDING', '{\"fullName\":\"Arifur Rahman\",\"phone\":\"01978901234\",\"street\":\"Shibganj, Sylhet\",\"city\":\"Sylhet\",\"area\":\"Main Zone\"}', '2026-08-27 12:59:38', '2026-09-07 12:59:38'),
(6, 'ORD-178876-1006', 22, 'Salma Khatun', 'salmakhatun@example.com', '01711223344', 54000.00, 60.00, 0.00, 54060.00, 'CASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Salma Khatun\",\"phone\":\"01711223344\",\"street\":\"Rajpara, Rajshahi\",\"city\":\"Rajshahi\",\"area\":\"Main Zone\"}', '2026-07-26 12:59:38', '2026-09-07 12:59:38'),
(7, 'ORD-178876-1007', 23, 'Jahangir Alom', 'jahangiralom@example.com', '01822334455', 7600.00, 60.00, 0.00, 7660.00, 'CARD', 'PAID', 'SHIPPED', '{\"fullName\":\"Jahangir Alom\",\"phone\":\"01822334455\",\"street\":\"Bandar, Narayanganj\",\"city\":\"Narayanganj\",\"area\":\"Main Zone\"}', '2026-08-15 12:59:38', '2026-09-07 12:59:38'),
(8, 'ORD-178876-1008', 24, 'Fahmida Akter', 'fahmidaakter@example.com', '01933445566', 19500.00, 60.00, 0.00, 19560.00, 'BKASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Fahmida Akter\",\"phone\":\"01933445566\",\"street\":\"Kandirpar, Cumilla\",\"city\":\"Cumilla\",\"area\":\"Main Zone\"}', '2026-07-29 12:59:38', '2026-09-07 12:59:38'),
(9, 'ORD-178876-1009', 25, 'Kawsar Habib', 'kawsarhabib@example.com', '01644556677', 680.00, 60.00, 0.00, 740.00, 'NAGAD', 'PAID', 'DELIVERED', '{\"fullName\":\"Kawsar Habib\",\"phone\":\"01644556677\",\"street\":\"Court Road, Bogura\",\"city\":\"Bogura\",\"area\":\"Main Zone\"}', '2026-07-24 12:59:38', '2026-09-07 12:59:38'),
(10, 'ORD-178876-1010', 26, 'Rubina Yesmin', 'rubinayesmin@example.com', '01555667788', 2300.00, 60.00, 0.00, 2360.00, 'CASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Rubina Yesmin\",\"phone\":\"01555667788\",\"street\":\"Sadur Mor, Rangpur\",\"city\":\"Rangpur\",\"area\":\"Main Zone\"}', '2026-08-19 12:59:38', '2026-09-07 12:59:38'),
(11, 'ORD-178876-1011', 27, 'Hasan Mahmud', 'hasanmahmud@example.com', '01766778899', 6300.00, 60.00, 0.00, 6360.00, 'CARD', 'PAID', 'PENDING', '{\"fullName\":\"Hasan Mahmud\",\"phone\":\"01766778899\",\"street\":\"Town Hall, Mymensingh\",\"city\":\"Mymensingh\",\"area\":\"Main Zone\"}', '2026-08-03 12:59:38', '2026-09-07 12:59:38'),
(12, 'ORD-178876-1012', 28, 'Nasima Khondoker', 'nasimakhondoker@example.com', '01877889900', 3200.00, 60.00, 0.00, 3260.00, 'BKASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Nasima Khondoker\",\"phone\":\"01877889900\",\"street\":\"Natun Bazar, Barishal\",\"city\":\"Barishal\",\"area\":\"Main Zone\"}', '2026-08-19 12:59:38', '2026-09-07 12:59:38'),
(13, 'ORD-178876-1013', 29, 'Asraful Alam', 'asrafulalam@example.com', '01988990011', 1900.00, 60.00, 0.00, 1960.00, 'NAGAD', 'PAID', 'SHIPPED', '{\"fullName\":\"Asraful Alam\",\"phone\":\"01988990011\",\"street\":\"Boro Bazar, Jashore\",\"city\":\"Jashore\",\"area\":\"Main Zone\"}', '2026-07-27 12:59:38', '2026-09-07 12:59:38'),
(14, 'ORD-178876-1014', 30, 'Faruk Ahmed', 'farukahmed@example.com', '01699001122', 5250.00, 60.00, 0.00, 5310.00, 'CASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Faruk Ahmed\",\"phone\":\"01699001122\",\"street\":\"Sadar Road, Dinajpur\",\"city\":\"Dinajpur\",\"area\":\"Main Zone\"}', '2026-07-29 12:59:38', '2026-09-07 12:59:38'),
(15, 'ORD-178876-1015', 31, 'Maruf Hossain', 'marufhossain@example.com', '01700112233', 2450.00, 60.00, 0.00, 2510.00, 'CARD', 'PAID', 'DELIVERED', '{\"fullName\":\"Maruf Hossain\",\"phone\":\"01700112233\",\"street\":\"College Gate, Tangail\",\"city\":\"Tangail\",\"area\":\"Main Zone\"}', '2026-08-08 12:59:38', '2026-09-07 12:59:38'),
(16, 'ORD-178876-1016', 32, 'Sabrina Sharmin', 'sabrinasharmin@example.com', '01811223355', 3700.00, 60.00, 0.00, 3760.00, 'BKASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Sabrina Sharmin\",\"phone\":\"01811223355\",\"street\":\"Station Road, Pabna\",\"city\":\"Pabna\",\"area\":\"Main Zone\"}', '2026-08-29 12:59:38', '2026-09-07 12:59:38'),
(17, 'ORD-178876-1017', 33, 'Lutfor Rahman', 'lutforrahman@example.com', '01922334466', 10350.00, 60.00, 0.00, 10410.00, 'NAGAD', 'PAID', 'PENDING', '{\"fullName\":\"Lutfor Rahman\",\"phone\":\"01922334466\",\"street\":\"Hospital Mor, Kushtia\",\"city\":\"Kushtia\",\"area\":\"Main Zone\"}', '2026-08-14 12:59:38', '2026-09-07 12:59:38'),
(18, 'ORD-178876-1018', 34, 'Samia Sultana', 'samiasultana@example.com', '01533445577', 2650.00, 60.00, 0.00, 2710.00, 'CASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Samia Sultana\",\"phone\":\"01533445577\",\"street\":\"Main Road, Gazipur\",\"city\":\"Gazipur\",\"area\":\"Main Zone\"}', '2026-08-29 12:59:38', '2026-09-07 12:59:38'),
(19, 'ORD-178876-1019', 35, 'Rezwanul Karim', 'rezwanulkarim@example.com', '01744556688', 11600.00, 60.00, 0.00, 11660.00, 'CARD', 'PAID', 'SHIPPED', '{\"fullName\":\"Rezwanul Karim\",\"phone\":\"01744556688\",\"street\":\"Court Point, Coxs Bazar\",\"city\":\"Coxs Bazar\",\"area\":\"Main Zone\"}', '2026-09-05 12:59:38', '2026-09-07 12:59:38'),
(20, 'ORD-178876-1020', 36, 'Nazneen Ferdaus', 'nazneenferdaus@example.com', '01855667799', 1950.00, 60.00, 0.00, 2010.00, 'BKASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Nazneen Ferdaus\",\"phone\":\"01855667799\",\"street\":\"Sadar Hospital Road, Feni\",\"city\":\"Feni\",\"area\":\"Main Zone\"}', '2026-08-20 12:59:38', '2026-09-07 12:59:38'),
(21, 'ORD-178876-1021', 37, 'Habibur Rahman', 'habiburrahman@example.com', '01966778800', 42500.00, 60.00, 0.00, 42560.00, 'NAGAD', 'PAID', 'DELIVERED', '{\"fullName\":\"Habibur Rahman\",\"phone\":\"01966778800\",\"street\":\"Purana Paltan, Dhaka\",\"city\":\"Dhaka\",\"area\":\"Main Zone\"}', '2026-08-08 12:59:38', '2026-09-07 12:59:38'),
(22, 'ORD-178876-1022', 38, 'Rokeya Begum', 'rokeyabegum@example.com', '01677889911', 236000.00, 60.00, 0.00, 236060.00, 'CASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Rokeya Begum\",\"phone\":\"01677889911\",\"street\":\"Gopalgonj Sadar\",\"city\":\"Gopalgonj\",\"area\":\"Main Zone\"}', '2026-08-07 12:59:38', '2026-09-07 12:59:38'),
(23, 'ORD-178876-1023', 39, 'Imran Hossain', 'imranhossain@example.com', '01788990022', 4950.00, 60.00, 0.00, 5010.00, 'CARD', 'PAID', 'PENDING', '{\"fullName\":\"Imran Hossain\",\"phone\":\"01788990022\",\"street\":\"Chawkbazar, Barishal\",\"city\":\"Barishal\",\"area\":\"Main Zone\"}', '2026-07-28 12:59:38', '2026-09-07 12:59:38'),
(24, 'ORD-178876-1024', 40, 'Nazia Parveen', 'naziaparveen@example.com', '01899001133', 3800.00, 60.00, 0.00, 3860.00, 'BKASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Nazia Parveen\",\"phone\":\"01899001133\",\"street\":\"Shyamoli, Dhaka\",\"city\":\"Dhaka\",\"area\":\"Main Zone\"}', '2026-07-27 12:59:38', '2026-09-07 12:59:38'),
(25, 'ORD-178876-1025', 41, 'Anwar Hossain', 'anwarhossain@example.com', '01900112244', 1980.00, 60.00, 0.00, 2040.00, 'NAGAD', 'PAID', 'SHIPPED', '{\"fullName\":\"Anwar Hossain\",\"phone\":\"01900112244\",\"street\":\"Halishahar, Chattogram\",\"city\":\"Chattogram\",\"area\":\"Main Zone\"}', '2026-08-16 12:59:38', '2026-09-07 12:59:38'),
(26, 'ORD-178876-1026', 42, 'Khadijatul Habiba', 'khadijatulhabiba@example.com', '01511223366', 55500.00, 60.00, 0.00, 55560.00, 'CASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Khadijatul Habiba\",\"phone\":\"01511223366\",\"street\":\"Amborkhana, Sylhet\",\"city\":\"Sylhet\",\"area\":\"Main Zone\"}', '2026-08-20 12:59:38', '2026-09-07 12:59:38'),
(27, 'ORD-178876-1027', 43, 'Moniruzzaman', 'moniruzzaman@example.com', '01722334477', 2950.00, 60.00, 0.00, 3010.00, 'CARD', 'PAID', 'DELIVERED', '{\"fullName\":\"Moniruzzaman\",\"phone\":\"01722334477\",\"street\":\"Zero Point, Rajshahi\",\"city\":\"Rajshahi\",\"area\":\"Main Zone\"}', '2026-09-03 12:59:38', '2026-09-07 12:59:38'),
(28, 'ORD-178876-1028', 44, 'Bilkis Panna', 'bilkispanna@example.com', '01833445588', 64000.00, 60.00, 0.00, 64060.00, 'BKASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Bilkis Panna\",\"phone\":\"01833445588\",\"street\":\"Khan Jahan Ali Road, Khulna\",\"city\":\"Khulna\",\"area\":\"Main Zone\"}', '2026-07-27 12:59:38', '2026-09-07 12:59:38'),
(29, 'ORD-178876-1029', 45, 'Sajjad Hossain', 'sajjadhossain@example.com', '01944556699', 1320.00, 60.00, 0.00, 1380.00, 'NAGAD', 'PAID', 'PENDING', '{\"fullName\":\"Sajjad Hossain\",\"phone\":\"01944556699\",\"street\":\"Badarganj Road, Rangpur\",\"city\":\"Rangpur\",\"area\":\"Main Zone\"}', '2026-07-28 12:59:38', '2026-09-07 12:59:38'),
(30, 'ORD-178876-1030', 46, 'Poly Chowdhury', 'polychowdhury@example.com', '01823456789', 850.00, 60.00, 0.00, 910.00, 'CASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Poly Chowdhury\",\"phone\":\"01823456789\",\"street\":\"Boalia, Rajshahi\",\"city\":\"Rajshahi\",\"area\":\"Main Zone\"}', '2026-08-20 12:59:38', '2026-09-07 12:59:38'),
(31, 'ORD-178876-1031', 17, 'Rafiqul Hossain', 'rafiqulhossain@example.com', '01512345678', 2900.00, 60.00, 0.00, 2960.00, 'CARD', 'PAID', 'SHIPPED', '{\"fullName\":\"Rafiqul Hossain\",\"phone\":\"01512345678\",\"street\":\"Mirpur 10, Dhaka\",\"city\":\"Dhaka\",\"area\":\"Main Zone\"}', '2026-08-25 12:59:38', '2026-09-07 12:59:38'),
(32, 'ORD-178876-1032', 18, 'Shirin Begum', 'shirinbegum@example.com', '01798765432', 14400.00, 60.00, 0.00, 14460.00, 'BKASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Shirin Begum\",\"phone\":\"01798765432\",\"street\":\"Sector 7, Uttara, Dhaka\",\"city\":\"Dhaka\",\"area\":\"Main Zone\"}', '2026-08-10 12:59:38', '2026-09-07 12:59:38'),
(33, 'ORD-178876-1033', 19, 'Mizanur Islam', 'mizanurislam@example.com', '01634567891', 2350.00, 60.00, 0.00, 2410.00, 'NAGAD', 'PAID', 'DELIVERED', '{\"fullName\":\"Mizanur Islam\",\"phone\":\"01634567891\",\"street\":\"Sonadanga, Khulna\",\"city\":\"Khulna\",\"area\":\"Main Zone\"}', '2026-07-31 12:59:38', '2026-09-07 12:59:38'),
(34, 'ORD-178876-1034', 20, 'Tania Akter', 'taniaakter@example.com', '01856789012', 3300.00, 60.00, 0.00, 3360.00, 'CASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Tania Akter\",\"phone\":\"01856789012\",\"street\":\"Chawkbazar, Chattogram\",\"city\":\"Chattogram\",\"area\":\"Main Zone\"}', '2026-08-04 12:59:38', '2026-09-07 12:59:38'),
(35, 'ORD-178876-1035', 21, 'Arifur Rahman', 'arifurrahman@example.com', '01978901234', 20400.00, 60.00, 0.00, 20460.00, 'CARD', 'PAID', 'PENDING', '{\"fullName\":\"Arifur Rahman\",\"phone\":\"01978901234\",\"street\":\"Shibganj, Sylhet\",\"city\":\"Sylhet\",\"area\":\"Main Zone\"}', '2026-08-23 12:59:38', '2026-09-07 12:59:38'),
(36, 'ORD-178876-1036', 22, 'Salma Khatun', 'salmakhatun@example.com', '01711223344', 2150.00, 60.00, 0.00, 2210.00, 'BKASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Salma Khatun\",\"phone\":\"01711223344\",\"street\":\"Rajpara, Rajshahi\",\"city\":\"Rajshahi\",\"area\":\"Main Zone\"}', '2026-07-31 12:59:38', '2026-09-07 12:59:38'),
(37, 'ORD-178876-1037', 23, 'Jahangir Alom', 'jahangiralom@example.com', '01822334455', 4500.00, 60.00, 0.00, 4560.00, 'NAGAD', 'PAID', 'SHIPPED', '{\"fullName\":\"Jahangir Alom\",\"phone\":\"01822334455\",\"street\":\"Bandar, Narayanganj\",\"city\":\"Narayanganj\",\"area\":\"Main Zone\"}', '2026-09-02 12:59:38', '2026-09-07 12:59:38'),
(38, 'ORD-178876-1038', 24, 'Fahmida Akter', 'fahmidaakter@example.com', '01933445566', 14850.00, 60.00, 0.00, 14910.00, 'CASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Fahmida Akter\",\"phone\":\"01933445566\",\"street\":\"Kandirpar, Cumilla\",\"city\":\"Cumilla\",\"area\":\"Main Zone\"}', '2026-07-27 12:59:38', '2026-09-07 12:59:38'),
(39, 'ORD-178876-1039', 25, 'Kawsar Habib', 'kawsarhabib@example.com', '01644556677', 2850.00, 60.00, 0.00, 2910.00, 'CARD', 'PAID', 'DELIVERED', '{\"fullName\":\"Kawsar Habib\",\"phone\":\"01644556677\",\"street\":\"Court Road, Bogura\",\"city\":\"Bogura\",\"area\":\"Main Zone\"}', '2026-08-31 12:59:38', '2026-09-07 12:59:38'),
(40, 'ORD-178876-1040', 26, 'Rubina Yesmin', 'rubinayesmin@example.com', '01555667788', 900.00, 60.00, 0.00, 960.00, 'BKASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Rubina Yesmin\",\"phone\":\"01555667788\",\"street\":\"Sadur Mor, Rangpur\",\"city\":\"Rangpur\",\"area\":\"Main Zone\"}', '2026-08-05 12:59:38', '2026-09-07 12:59:38'),
(41, 'ORD-178876-1041', 27, 'Hasan Mahmud', 'hasanmahmud@example.com', '01766778899', 168000.00, 60.00, 0.00, 168060.00, 'NAGAD', 'PAID', 'PENDING', '{\"fullName\":\"Hasan Mahmud\",\"phone\":\"01766778899\",\"street\":\"Town Hall, Mymensingh\",\"city\":\"Mymensingh\",\"area\":\"Main Zone\"}', '2026-08-30 12:59:38', '2026-09-07 12:59:38'),
(42, 'ORD-178876-1042', 28, 'Nasima Khondoker', 'nasimakhondoker@example.com', '01877889900', 3400.00, 60.00, 0.00, 3460.00, 'CASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Nasima Khondoker\",\"phone\":\"01877889900\",\"street\":\"Natun Bazar, Barishal\",\"city\":\"Barishal\",\"area\":\"Main Zone\"}', '2026-08-07 12:59:38', '2026-09-07 12:59:38'),
(43, 'ORD-178876-1043', 29, 'Asraful Alam', 'asrafulalam@example.com', '01988990011', 8200.00, 60.00, 0.00, 8260.00, 'CARD', 'PAID', 'SHIPPED', '{\"fullName\":\"Asraful Alam\",\"phone\":\"01988990011\",\"street\":\"Boro Bazar, Jashore\",\"city\":\"Jashore\",\"area\":\"Main Zone\"}', '2026-08-21 12:59:38', '2026-09-07 12:59:38'),
(44, 'ORD-178876-1044', 30, 'Faruk Ahmed', 'farukahmed@example.com', '01699001122', 5550.00, 60.00, 0.00, 5610.00, 'BKASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Faruk Ahmed\",\"phone\":\"01699001122\",\"street\":\"Sadar Road, Dinajpur\",\"city\":\"Dinajpur\",\"area\":\"Main Zone\"}', '2026-08-26 12:59:38', '2026-09-07 12:59:38'),
(45, 'ORD-178876-1045', 31, 'Maruf Hossain', 'marufhossain@example.com', '01700112233', 1450.00, 60.00, 0.00, 1510.00, 'NAGAD', 'PAID', 'DELIVERED', '{\"fullName\":\"Maruf Hossain\",\"phone\":\"01700112233\",\"street\":\"College Gate, Tangail\",\"city\":\"Tangail\",\"area\":\"Main Zone\"}', '2026-08-10 12:59:38', '2026-09-07 12:59:38'),
(46, 'ORD-178876-1046', 32, 'Sabrina Sharmin', 'sabrinasharmin@example.com', '01811223355', 9200.00, 60.00, 0.00, 9260.00, 'CASH', 'PAID', 'PROCESSING', '{\"fullName\":\"Sabrina Sharmin\",\"phone\":\"01811223355\",\"street\":\"Station Road, Pabna\",\"city\":\"Pabna\",\"area\":\"Main Zone\"}', '2026-08-16 12:59:38', '2026-09-07 12:59:38'),
(47, 'ORD-178876-1047', 33, 'Lutfor Rahman', 'lutforrahman@example.com', '01922334466', 15600.00, 60.00, 0.00, 15660.00, 'CARD', 'PAID', 'PENDING', '{\"fullName\":\"Lutfor Rahman\",\"phone\":\"01922334466\",\"street\":\"Hospital Mor, Kushtia\",\"city\":\"Kushtia\",\"area\":\"Main Zone\"}', '2026-08-04 12:59:38', '2026-09-07 12:59:38'),
(48, 'ORD-178876-1048', 34, 'Samia Sultana', 'samiasultana@example.com', '01533445577', 4200.00, 60.00, 0.00, 4260.00, 'BKASH', 'PAID', 'DELIVERED', '{\"fullName\":\"Samia Sultana\",\"phone\":\"01533445577\",\"street\":\"Main Road, Gazipur\",\"city\":\"Gazipur\",\"area\":\"Main Zone\"}', '2026-07-31 12:59:38', '2026-09-07 12:59:38'),
(49, 'ORD-178876-1049', 35, 'Rezwanul Karim', 'rezwanulkarim@example.com', '01744556688', 760.00, 60.00, 0.00, 820.00, 'NAGAD', 'PAID', 'SHIPPED', '{\"fullName\":\"Rezwanul Karim\",\"phone\":\"01744556688\",\"street\":\"Court Point, Coxs Bazar\",\"city\":\"Coxs Bazar\",\"area\":\"Main Zone\"}', '2026-09-01 12:59:38', '2026-09-07 12:59:38'),
(50, 'ORD-178876-1050', 36, 'Nazneen Ferdaus', 'nazneenferdaus@example.com', '01855667799', 1260.00, 60.00, 0.00, 1320.00, 'CASH', 'PAID', 'CONFIRMED', '{\"fullName\":\"Nazneen Ferdaus\",\"phone\":\"01855667799\",\"street\":\"Sadar Hospital Road, Feni\",\"city\":\"Feni\",\"area\":\"Main Zone\"}', '2026-07-28 12:59:38', '2026-09-07 12:59:38'),
(51, 'ORD-1788766899298-495', 17, 'Rafiqul Hossain', 'rafiqulhossain@example.com', '01711000001', 12450.00, 0.00, 0.00, 12450.00, 'STRIPE', 'PAID', 'CONFIRMED', '{\"fullName\":\"Rafiqul Hossain\",\"phone\":\"01711000001\",\"street\":\"House 12, Road 4\",\"city\":\"Dhaka\",\"area\":\"Dhanmondi\"}', '2026-09-07 13:41:39', '2026-09-07 13:41:49');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `vendor_id`, `title`, `image_url`, `price`, `quantity`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 1, 'Smartphone X10', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', 12450.00, 2, 24900.00, '2026-09-07 12:59:38'),
(2, 2, 2, 2, 'Ultrabook 14 inch', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 9875.50, 3, 29626.50, '2026-09-07 12:59:38'),
(3, 3, 3, 3, 'Cotton Panjabi', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 1450.00, 1, 1450.00, '2026-09-07 12:59:38'),
(4, 4, 4, 4, 'Silk Saree Elegance', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', 4200.00, 2, 8400.00, '2026-09-07 12:59:38'),
(5, 5, 5, 5, 'Kids Denim Dungaree', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea', 1250.00, 3, 3750.00, '2026-09-07 12:59:38'),
(6, 6, 6, 6, 'Inverter Air Conditioner 1.5 Ton', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e', 54000.00, 1, 54000.00, '2026-09-07 12:59:38'),
(7, 7, 7, 7, 'Non-Stick Cookware Set 7 Pcs', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7', 3800.00, 2, 7600.00, '2026-09-07 12:59:38'),
(8, 8, 8, 8, 'Ergonomic Mesh Office Chair', 'https://images.unsplash.com/photo-1580481077194-43666f2095f9', 6500.00, 3, 19500.00, '2026-09-07 12:59:38'),
(9, 9, 9, 9, 'Premium Basmati Rice 5kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 680.00, 1, 680.00, '2026-09-07 12:59:38'),
(10, 10, 10, 10, 'Vitamin C Brightening Serum 30ml', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 1150.00, 2, 2300.00, '2026-09-07 12:59:38'),
(11, 11, 11, 11, 'Digital Blood Pressure Monitor', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', 2100.00, 3, 6300.00, '2026-09-07 12:59:38'),
(12, 12, 12, 12, 'Carbon Fiber Badminton Racket', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea', 3200.00, 1, 3200.00, '2026-09-07 12:59:38'),
(13, 13, 13, 13, 'Classic Fountain Pen & Notebook Set', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd', 950.00, 2, 1900.00, '2026-09-07 12:59:38'),
(14, 14, 14, 14, 'Magnetic Educational Building Blocks', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', 1750.00, 3, 5250.00, '2026-09-07 12:59:38'),
(15, 15, 15, 15, 'Multi-Function Car Tire Inflator', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738', 2450.00, 1, 2450.00, '2026-09-07 12:59:38'),
(16, 16, 16, 1, 'Fast Charging 65W GaN Charger', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', 1850.00, 2, 3700.00, '2026-09-07 12:59:38'),
(17, 17, 17, 2, 'Men Genuine Leather Loafers', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509', 3450.00, 3, 10350.00, '2026-09-07 12:59:38'),
(18, 18, 18, 3, 'Water-Resistant Travel Backpack 35L', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 2650.00, 1, 2650.00, '2026-09-07 12:59:38'),
(19, 19, 19, 4, 'Stainless Steel Chronograph Watch', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', 5800.00, 2, 11600.00, '2026-09-07 12:59:38'),
(20, 20, 20, 5, 'Extension Socket 4-Way with Surge Protection', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 650.00, 3, 1950.00, '2026-09-07 12:59:38'),
(21, 21, 21, 6, 'Samsung Galaxy A55 5G', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', 42500.00, 1, 42500.00, '2026-09-07 12:59:38'),
(22, 22, 22, 7, 'MacBook Air M2 13.6-inch', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 118000.00, 2, 236000.00, '2026-09-07 12:59:38'),
(23, 23, 23, 8, 'Slim Fit Casual Denim Shirt', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', 1650.00, 3, 4950.00, '2026-09-07 12:59:38'),
(24, 24, 24, 9, 'Embroidered Lawn Three Piece', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b', 3800.00, 1, 3800.00, '2026-09-07 12:59:38'),
(25, 25, 25, 10, 'Baby Soft Cotton Romper 3-Pack', 'https://images.unsplash.com/photo-1522771930-78848d9293e8', 990.00, 2, 1980.00, '2026-09-07 12:59:38'),
(26, 26, 26, 11, 'Smart Microwave Oven 28L', 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', 18500.00, 3, 55500.00, '2026-09-07 12:59:38'),
(27, 27, 27, 12, 'Electric Rice Cooker 2.8L', 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b', 2950.00, 1, 2950.00, '2026-09-07 12:59:38'),
(28, 28, 28, 13, 'Wooden 6-Seater Dining Table', 'https://images.unsplash.com/photo-1617806118233-18e1de247200', 32000.00, 2, 64000.00, '2026-09-07 12:59:38'),
(29, 29, 29, 14, 'Pure Mustard Oil 2 Liters', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', 440.00, 3, 1320.00, '2026-09-07 12:59:38'),
(30, 30, 30, 15, 'Gentle Facial Cleanser 150ml', 'https://images.unsplash.com/photo-1556228720-195a672e8a03', 850.00, 1, 850.00, '2026-09-07 12:59:38'),
(31, 31, 31, 1, 'Electric Heating Heating Pad', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843', 1450.00, 2, 2900.00, '2026-09-07 12:59:38'),
(32, 32, 32, 2, 'Professional Gym Dumbbell Set 20kg', 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a', 4800.00, 3, 14400.00, '2026-09-07 12:59:38'),
(33, 33, 33, 3, 'Wireless Laser Barcode Scanner', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147', 2350.00, 1, 2350.00, '2026-09-07 12:59:38'),
(34, 34, 34, 4, 'Remote Control RC Stunt Car', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f', 1650.00, 2, 3300.00, '2026-09-07 12:59:38'),
(35, 35, 35, 5, 'High Pressure Car Washer Machine', 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f', 6800.00, 3, 20400.00, '2026-09-07 12:59:38'),
(36, 36, 36, 6, 'True Wireless Bluetooth Earbuds', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', 2150.00, 1, 2150.00, '2026-09-07 12:59:38'),
(37, 37, 37, 7, 'Women Comfortable Block Heels', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2', 2250.00, 2, 4500.00, '2026-09-07 12:59:38'),
(38, 38, 38, 8, 'Hard Shell Luggage Trolley 24 inch', 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87', 4950.00, 3, 14850.00, '2026-09-07 12:59:38'),
(39, 39, 39, 9, 'Smart Fitness Tracker Smartwatch', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1', 2850.00, 1, 2850.00, '2026-09-07 12:59:38'),
(40, 40, 40, 10, 'HDMI to VGA Converter Adapter', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 450.00, 2, 900.00, '2026-09-07 12:59:38'),
(41, 41, 41, 11, 'Google Pixel 8a 128GB', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 56000.00, 3, 168000.00, '2026-09-07 12:59:38'),
(42, 42, 42, 12, 'Mechanical Gaming Keyboard RGB', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', 3400.00, 1, 3400.00, '2026-09-07 12:59:38'),
(43, 43, 43, 13, 'Men Formal Oxford Shoes', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4', 4100.00, 2, 8200.00, '2026-09-07 12:59:38'),
(44, 44, 44, 14, 'Designer Handcrafted Kurti', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb', 1850.00, 3, 5550.00, '2026-09-07 12:59:38'),
(45, 45, 45, 15, 'Kids LED Sports Sneaker Shoes', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782', 1450.00, 1, 1450.00, '2026-09-07 12:59:38'),
(46, 46, 46, 1, 'Stand Fan with Remote Control 16 inch', 'https://images.unsplash.com/photo-1563245372-f21724e3856d', 4600.00, 2, 9200.00, '2026-09-07 12:59:38'),
(47, 47, 47, 2, 'Multi-Blade Kitchen Food Processor', 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', 5200.00, 3, 15600.00, '2026-09-07 12:59:38'),
(48, 48, 48, 3, 'Foldable Computer Study Desk', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', 4200.00, 1, 4200.00, '2026-09-07 12:59:38'),
(49, 49, 49, 4, 'Organic Green Tea 100 Bags', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3', 380.00, 2, 760.00, '2026-09-07 12:59:38'),
(50, 50, 50, 5, 'Fast USB-C to USB-C Braided Cable 2M', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', 420.00, 3, 1260.00, '2026-09-07 12:59:38'),
(51, 51, 1, 1, 'Smartphone X10', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', 12450.00, 1, 12450.00, '2026-09-07 13:41:39');

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `order_id`, `status`, `note`, `created_at`) VALUES
(1, 1, 'CONFIRMED', 'Payment confirmed via Stripe (Transaction: pi_test_1788765994981_i052fq)', '2026-09-07 13:26:35'),
(2, 51, 'PENDING', 'Order placed by customer', '2026-09-07 13:41:39'),
(3, 51, 'CONFIRMED', 'Payment confirmed via Stripe (Transaction: pi_3UCxBSCBvCrTdoyl1ouvgH3n)', '2026-09-07 13:41:49');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('CASH','BKASH','NAGAD','CARD','CASH_ON_DELIVERY') DEFAULT 'CASH',
  `payment_status` enum('PENDING','PAID','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `payment_method`, `payment_status`, `transaction_id`, `payment_date`, `created_at`, `updated_at`) VALUES
(1, 1, 12510.00, 'CARD', 'COMPLETED', 'pi_test_1788765994981_i052fq', '2026-07-31 12:59:38', '2026-09-07 12:59:38', '2026-09-07 13:26:35'),
(2, 2, 29686.50, 'CASH', 'COMPLETED', 'TRX-889002', '2026-08-15 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(3, 3, 1510.00, 'CARD', 'COMPLETED', 'TRX-889003', '2026-08-30 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(4, 4, 8460.00, 'BKASH', 'COMPLETED', 'TRX-889004', '2026-07-29 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(5, 5, 3810.00, 'NAGAD', 'COMPLETED', 'TRX-889005', '2026-08-27 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(6, 6, 54060.00, 'CASH', 'COMPLETED', 'TRX-889006', '2026-07-26 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(7, 7, 7660.00, 'CARD', 'COMPLETED', 'TRX-889007', '2026-08-15 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(8, 8, 19560.00, 'BKASH', 'COMPLETED', 'TRX-889008', '2026-07-29 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(9, 9, 740.00, 'NAGAD', 'COMPLETED', 'TRX-889009', '2026-07-24 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(10, 10, 2360.00, 'CASH', 'COMPLETED', 'TRX-889010', '2026-08-19 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(11, 11, 6360.00, 'CARD', 'COMPLETED', 'TRX-889011', '2026-08-03 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(12, 12, 3260.00, 'BKASH', 'COMPLETED', 'TRX-889012', '2026-08-19 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(13, 13, 1960.00, 'NAGAD', 'COMPLETED', 'TRX-889013', '2026-07-27 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(14, 14, 5310.00, 'CASH', 'COMPLETED', 'TRX-889014', '2026-07-29 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(15, 15, 2510.00, 'CARD', 'COMPLETED', 'TRX-889015', '2026-08-08 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(16, 16, 3760.00, 'BKASH', 'COMPLETED', 'TRX-889016', '2026-08-29 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(17, 17, 10410.00, 'NAGAD', 'COMPLETED', 'TRX-889017', '2026-08-14 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(18, 18, 2710.00, 'CASH', 'COMPLETED', 'TRX-889018', '2026-08-29 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(19, 19, 11660.00, 'CARD', 'COMPLETED', 'TRX-889019', '2026-09-05 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(20, 20, 2010.00, 'BKASH', 'COMPLETED', 'TRX-889020', '2026-08-20 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(21, 21, 42560.00, 'NAGAD', 'COMPLETED', 'TRX-889021', '2026-08-08 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(22, 22, 236060.00, 'CASH', 'COMPLETED', 'TRX-889022', '2026-08-07 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(23, 23, 5010.00, 'CARD', 'COMPLETED', 'TRX-889023', '2026-07-28 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(24, 24, 3860.00, 'BKASH', 'COMPLETED', 'TRX-889024', '2026-07-27 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(25, 25, 2040.00, 'NAGAD', 'COMPLETED', 'TRX-889025', '2026-08-16 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(26, 26, 55560.00, 'CASH', 'COMPLETED', 'TRX-889026', '2026-08-20 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(27, 27, 3010.00, 'CARD', 'COMPLETED', 'TRX-889027', '2026-09-03 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(28, 28, 64060.00, 'BKASH', 'COMPLETED', 'TRX-889028', '2026-07-27 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(29, 29, 1380.00, 'NAGAD', 'COMPLETED', 'TRX-889029', '2026-07-28 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(30, 30, 910.00, 'CASH', 'COMPLETED', 'TRX-889030', '2026-08-20 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(31, 31, 2960.00, 'CARD', 'COMPLETED', 'TRX-889031', '2026-08-25 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(32, 32, 14460.00, 'BKASH', 'COMPLETED', 'TRX-889032', '2026-08-10 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(33, 33, 2410.00, 'NAGAD', 'COMPLETED', 'TRX-889033', '2026-07-31 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(34, 34, 3360.00, 'CASH', 'COMPLETED', 'TRX-889034', '2026-08-04 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(35, 35, 20460.00, 'CARD', 'COMPLETED', 'TRX-889035', '2026-08-23 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(36, 36, 2210.00, 'BKASH', 'COMPLETED', 'TRX-889036', '2026-07-31 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(37, 37, 4560.00, 'NAGAD', 'COMPLETED', 'TRX-889037', '2026-09-02 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(38, 38, 14910.00, 'CASH', 'COMPLETED', 'TRX-889038', '2026-07-27 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(39, 39, 2910.00, 'CARD', 'COMPLETED', 'TRX-889039', '2026-08-31 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(40, 40, 960.00, 'BKASH', 'COMPLETED', 'TRX-889040', '2026-08-05 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(41, 41, 168060.00, 'NAGAD', 'COMPLETED', 'TRX-889041', '2026-08-30 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(42, 42, 3460.00, 'CASH', 'COMPLETED', 'TRX-889042', '2026-08-07 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(43, 43, 8260.00, 'CARD', 'COMPLETED', 'TRX-889043', '2026-08-21 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(44, 44, 5610.00, 'BKASH', 'COMPLETED', 'TRX-889044', '2026-08-26 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(45, 45, 1510.00, 'NAGAD', 'COMPLETED', 'TRX-889045', '2026-08-10 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(46, 46, 9260.00, 'CASH', 'COMPLETED', 'TRX-889046', '2026-08-16 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(47, 47, 15660.00, 'CARD', 'COMPLETED', 'TRX-889047', '2026-08-04 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(48, 48, 4260.00, 'BKASH', 'COMPLETED', 'TRX-889048', '2026-07-31 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(49, 49, 820.00, 'NAGAD', 'COMPLETED', 'TRX-889049', '2026-09-01 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(50, 50, 1320.00, 'CASH', 'COMPLETED', 'TRX-889050', '2026-07-28 12:59:38', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(51, 51, 12450.00, 'CARD', 'COMPLETED', 'pi_3UCxBSCBvCrTdoyl1ouvgH3n', '2026-09-07 13:41:39', '2026-09-07 13:41:39', '2026-09-07 13:41:49');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL DEFAULT 'Generic',
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `original_price` decimal(12,2) DEFAULT NULL,
  `discount_percentage` decimal(5,2) DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(500) NOT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `specifications_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications_json`)),
  `in_the_box` text DEFAULT NULL,
  `warranty` varchar(255) DEFAULT NULL,
  `features_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features_json`)),
  `rating` decimal(3,2) DEFAULT 4.80,
  `review_count` int(11) DEFAULT 12,
  `is_published` tinyint(1) DEFAULT 1,
  `is_approved` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `vendor_id`, `category_id`, `category`, `brand`, `title`, `slug`, `sku`, `description`, `price`, `original_price`, `discount_percentage`, `stock`, `image_url`, `video_url`, `specifications_json`, `in_the_box`, `warranty`, `features_json`, `rating`, `review_count`, `is_published`, `is_approved`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Mobile Phones', 'Xiaomi', 'Smartphone X10', 'smartphone-x10', 'X10-MOB-01', 'Smartphone X10 - high quality authentic product listed under Mobile Phones. Complete manufacturer warranty and tested durability.', 12450.00, 13999.00, 11.00, 83, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 13:47:08'),
(2, 2, 2, 'Laptops & Computers', 'Asus', 'Ultrabook 14 inch', 'ultrabook-14-inch', 'ULTRA-14-02', 'Ultrabook 14 inch - high quality authentic product listed under Laptops & Computers. Complete manufacturer warranty and tested durability.', 9875.50, 11200.00, 12.00, 46, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(3, 3, 3, 'Men\'s Fashion', 'Aarong', 'Cotton Panjabi', 'cotton-panjabi', 'PANJ-COT-03', 'Cotton Panjabi - high quality authentic product listed under Men\'s Fashion. Complete manufacturer warranty and tested durability.', 1450.00, 1800.00, 19.00, 120, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(4, 4, 4, 'Women\'s Fashion', 'Monipuri', 'Silk Saree Elegance', 'silk-saree-elegance', 'SAR-SLK-04', 'Silk Saree Elegance - high quality authentic product listed under Women\'s Fashion. Complete manufacturer warranty and tested durability.', 4200.00, 5500.00, 24.00, 35, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(5, 5, 5, 'Kids\' Fashion', 'Yellow Kids', 'Kids Denim Dungaree', 'kids-denim-dungaree', 'KID-DEN-05', 'Kids Denim Dungaree - high quality authentic product listed under Kids\' Fashion. Complete manufacturer warranty and tested durability.', 1250.00, 1500.00, 17.00, 60, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(6, 6, 6, 'Home Appliances', 'Gree', 'Inverter Air Conditioner 1.5 Ton', 'inverter-air-conditioner-1-5-ton', 'AC-15T-06', 'Inverter Air Conditioner 1.5 Ton - high quality authentic product listed under Home Appliances. Complete manufacturer warranty and tested durability.', 54000.00, 58000.00, 7.00, 15, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(7, 7, 7, 'Kitchen & Dining', 'Kiam', 'Non-Stick Cookware Set 7 Pcs', 'non-stick-cookware-set-7-pcs', 'CW-7PC-07', 'Non-Stick Cookware Set 7 Pcs - high quality authentic product listed under Kitchen & Dining. Complete manufacturer warranty and tested durability.', 3800.00, 4500.00, 16.00, 40, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(8, 8, 8, 'Furniture', 'Otobi', 'Ergonomic Mesh Office Chair', 'ergonomic-mesh-office-chair', 'CHR-OFF-08', 'Ergonomic Mesh Office Chair - high quality authentic product listed under Furniture. Complete manufacturer warranty and tested durability.', 6500.00, 7800.00, 17.00, 25, 'https://images.unsplash.com/photo-1580481077194-43666f2095f9', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(9, 9, 9, 'Groceries', 'Pran', 'Premium Basmati Rice 5kg', 'premium-basmati-rice-5kg', 'GRO-BAS-09', 'Premium Basmati Rice 5kg - high quality authentic product listed under Groceries. Complete manufacturer warranty and tested durability.', 680.00, 750.00, 9.00, 200, 'https://images.unsplash.com/photo-1586201375761-83865001e31c', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(10, 10, 10, 'Beauty & Personal Care', 'The Ordinary', 'Vitamin C Brightening Serum 30ml', 'vitamin-c-brightening-serum-30ml', 'SKN-SER-10', 'Vitamin C Brightening Serum 30ml - high quality authentic product listed under Beauty & Personal Care. Complete manufacturer warranty and tested durability.', 1150.00, 1400.00, 18.00, 90, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(11, 11, 11, 'Health & Wellness', 'Omron', 'Digital Blood Pressure Monitor', 'digital-blood-pressure-monitor', 'HLT-BPM-11', 'Digital Blood Pressure Monitor - high quality authentic product listed under Health & Wellness. Complete manufacturer warranty and tested durability.', 2100.00, 2600.00, 19.00, 50, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(12, 12, 12, 'Sports & Outdoor', 'Yonex', 'Carbon Fiber Badminton Racket', 'carbon-fiber-badminton-racket', 'SPT-BAD-12', 'Carbon Fiber Badminton Racket - high quality authentic product listed under Sports & Outdoor. Complete manufacturer warranty and tested durability.', 3200.00, 3900.00, 18.00, 45, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(13, 13, 13, 'Books & Stationery', 'Parker', 'Classic Fountain Pen & Notebook Set', 'classic-fountain-pen-notebook-set', 'STA-PEN-13', 'Classic Fountain Pen & Notebook Set - high quality authentic product listed under Books & Stationery. Complete manufacturer warranty and tested durability.', 950.00, 1200.00, 21.00, 110, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(14, 14, 14, 'Toys & Games', 'Lego', 'Magnetic Educational Building Blocks', 'magnetic-educational-building-blocks', 'TOY-MAG-14', 'Magnetic Educational Building Blocks - high quality authentic product listed under Toys & Games. Complete manufacturer warranty and tested durability.', 1750.00, 2200.00, 20.00, 75, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(15, 15, 15, 'Automotive Accessories', 'Baseus', 'Multi-Function Car Tire Inflator', 'multi-function-car-tire-inflator', 'CAR-INF-15', 'Multi-Function Car Tire Inflator - high quality authentic product listed under Automotive Accessories. Complete manufacturer warranty and tested durability.', 2450.00, 2900.00, 16.00, 55, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(16, 1, 16, 'Mobile Accessories', 'Anker', 'Fast Charging 65W GaN Charger', 'fast-charging-65w-gan-charger', 'ACC-GAN-16', 'Fast Charging 65W GaN Charger - high quality authentic product listed under Mobile Accessories. Complete manufacturer warranty and tested durability.', 1850.00, 2200.00, 16.00, 130, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(17, 2, 17, 'Footwear', 'Apex', 'Men Genuine Leather Loafers', 'men-genuine-leather-loafers', 'SH-LOA-17', 'Men Genuine Leather Loafers - high quality authentic product listed under Footwear. Complete manufacturer warranty and tested durability.', 3450.00, 4200.00, 18.00, 65, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(18, 3, 18, 'Bags & Luggage', 'Wildcraft', 'Water-Resistant Travel Backpack 35L', 'water-resistant-travel-backpack-35l', 'BAG-TRV-18', 'Water-Resistant Travel Backpack 35L - high quality authentic product listed under Bags & Luggage. Complete manufacturer warranty and tested durability.', 2650.00, 3200.00, 17.00, 80, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(19, 4, 19, 'Watches & Jewelry', 'Casio Edifice', 'Stainless Steel Chronograph Watch', 'stainless-steel-chronograph-watch', 'WTC-EDF-19', 'Stainless Steel Chronograph Watch - high quality authentic product listed under Watches & Jewelry. Complete manufacturer warranty and tested durability.', 5800.00, 7200.00, 19.00, 30, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(20, 5, 20, 'Electronics Accessories', 'Havells', 'Extension Socket 4-Way with Surge Protection', 'extension-socket-4-way-with-surge-protection', 'ELC-EXT-20', 'Extension Socket 4-Way with Surge Protection - high quality authentic product listed under Electronics Accessories. Complete manufacturer warranty and tested durability.', 650.00, 850.00, 24.00, 200, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(21, 6, 1, 'Mobile Phones', 'Samsung', 'Samsung Galaxy A55 5G', 'samsung-galaxy-a55-5g', 'SAM-A55-21', 'Samsung Galaxy A55 5G - high quality authentic product listed under Mobile Phones. Complete manufacturer warranty and tested durability.', 42500.00, 45000.00, 6.00, 28, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(22, 7, 2, 'Laptops & Computers', 'Apple', 'MacBook Air M2 13.6-inch', 'macbook-air-m2-13-6-inch', 'APL-MBA-22', 'MacBook Air M2 13.6-inch - high quality authentic product listed under Laptops & Computers. Complete manufacturer warranty and tested durability.', 118000.00, 125000.00, 6.00, 12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(23, 8, 3, 'Men\'s Fashion', 'Cats Eye', 'Slim Fit Casual Denim Shirt', 'slim-fit-casual-denim-shirt', 'CAT-SHT-23', 'Slim Fit Casual Denim Shirt - high quality authentic product listed under Men\'s Fashion. Complete manufacturer warranty and tested durability.', 1650.00, 2100.00, 21.00, 70, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(24, 9, 4, 'Women\'s Fashion', 'Kay Kraft', 'Embroidered Lawn Three Piece', 'embroidered-lawn-three-piece', 'KAY-3PC-24', 'Embroidered Lawn Three Piece - high quality authentic product listed under Women\'s Fashion. Complete manufacturer warranty and tested durability.', 3800.00, 4600.00, 17.00, 45, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(25, 10, 5, 'Kids\' Fashion', 'Mothercare', 'Baby Soft Cotton Romper 3-Pack', 'baby-soft-cotton-romper-3-pack', 'KID-ROM-25', 'Baby Soft Cotton Romper 3-Pack - high quality authentic product listed under Kids\' Fashion. Complete manufacturer warranty and tested durability.', 990.00, 1300.00, 24.00, 85, 'https://images.unsplash.com/photo-1522771930-78848d9293e8', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(26, 11, 6, 'Home Appliances', 'Walton', 'Smart Microwave Oven 28L', 'smart-microwave-oven-28l', 'WAL-MW-26', 'Smart Microwave Oven 28L - high quality authentic product listed under Home Appliances. Complete manufacturer warranty and tested durability.', 18500.00, 21000.00, 12.00, 20, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(27, 12, 7, 'Kitchen & Dining', 'Miyako', 'Electric Rice Cooker 2.8L', 'electric-rice-cooker-2-8l', 'MIY-RC-27', 'Electric Rice Cooker 2.8L - high quality authentic product listed under Kitchen & Dining. Complete manufacturer warranty and tested durability.', 2950.00, 3600.00, 18.00, 60, 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(28, 13, 8, 'Furniture', 'Hatil', 'Wooden 6-Seater Dining Table', 'wooden-6-seater-dining-table', 'HAT-DIN-28', 'Wooden 6-Seater Dining Table - high quality authentic product listed under Furniture. Complete manufacturer warranty and tested durability.', 32000.00, 38000.00, 16.00, 8, 'https://images.unsplash.com/photo-1617806118233-18e1de247200', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(29, 14, 9, 'Groceries', 'Radhuni', 'Pure Mustard Oil 2 Liters', 'pure-mustard-oil-2-liters', 'RAD-OIL-29', 'Pure Mustard Oil 2 Liters - high quality authentic product listed under Groceries. Complete manufacturer warranty and tested durability.', 440.00, 490.00, 10.00, 150, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(30, 15, 10, 'Beauty & Personal Care', 'Cetaphil', 'Gentle Facial Cleanser 150ml', 'gentle-facial-cleanser-150ml', 'CET-CLN-30', 'Gentle Facial Cleanser 150ml - high quality authentic product listed under Beauty & Personal Care. Complete manufacturer warranty and tested durability.', 850.00, 1050.00, 19.00, 110, 'https://images.unsplash.com/photo-1556228720-195a672e8a03', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(31, 1, 11, 'Health & Wellness', 'Beurer', 'Electric Heating Heating Pad', 'electric-heating-heating-pad', 'BEU-HTP-31', 'Electric Heating Heating Pad - high quality authentic product listed under Health & Wellness. Complete manufacturer warranty and tested durability.', 1450.00, 1800.00, 19.00, 70, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(32, 2, 12, 'Sports & Outdoor', 'Cosco', 'Professional Gym Dumbbell Set 20kg', 'professional-gym-dumbbell-set-20kg', 'SPT-DMB-32', 'Professional Gym Dumbbell Set 20kg - high quality authentic product listed under Sports & Outdoor. Complete manufacturer warranty and tested durability.', 4800.00, 5900.00, 19.00, 35, 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(33, 3, 13, 'Books & Stationery', 'Netum', 'Wireless Laser Barcode Scanner', 'wireless-laser-barcode-scanner', 'STA-SCN-33', 'Wireless Laser Barcode Scanner - high quality authentic product listed under Books & Stationery. Complete manufacturer warranty and tested durability.', 2350.00, 2900.00, 19.00, 45, 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(34, 4, 14, 'Toys & Games', 'Syma', 'Remote Control RC Stunt Car', 'remote-control-rc-stunt-car', 'TOY-RC-34', 'Remote Control RC Stunt Car - high quality authentic product listed under Toys & Games. Complete manufacturer warranty and tested durability.', 1650.00, 2100.00, 21.00, 50, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(35, 5, 15, 'Automotive Accessories', 'Bosch', 'High Pressure Car Washer Machine', 'high-pressure-car-washer-machine', 'BOS-WSH-35', 'High Pressure Car Washer Machine - high quality authentic product listed under Automotive Accessories. Complete manufacturer warranty and tested durability.', 6800.00, 8200.00, 17.00, 18, 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(36, 6, 16, 'Mobile Accessories', 'Realme Buds', 'True Wireless Bluetooth Earbuds', 'true-wireless-bluetooth-earbuds', 'RLM-TWS-36', 'True Wireless Bluetooth Earbuds - high quality authentic product listed under Mobile Accessories. Complete manufacturer warranty and tested durability.', 2150.00, 2700.00, 20.00, 120, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(37, 7, 17, 'Footwear', 'Bata', 'Women Comfortable Block Heels', 'women-comfortable-block-heels', 'BAT-HEL-37', 'Women Comfortable Block Heels - high quality authentic product listed under Footwear. Complete manufacturer warranty and tested durability.', 2250.00, 2800.00, 20.00, 55, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(38, 8, 18, 'Bags & Luggage', 'President', 'Hard Shell Luggage Trolley 24 inch', 'hard-shell-luggage-trolley-24-inch', 'PRS-TRL-38', 'Hard Shell Luggage Trolley 24 inch - high quality authentic product listed under Bags & Luggage. Complete manufacturer warranty and tested durability.', 4950.00, 6200.00, 20.00, 24, 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(39, 9, 19, 'Watches & Jewelry', 'Amazfit', 'Smart Fitness Tracker Smartwatch', 'smart-fitness-tracker-smartwatch', 'AMZ-FIT-39', 'Smart Fitness Tracker Smartwatch - high quality authentic product listed under Watches & Jewelry. Complete manufacturer warranty and tested durability.', 2850.00, 3500.00, 19.00, 90, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(40, 10, 20, 'Electronics Accessories', 'Ugreen', 'HDMI to VGA Converter Adapter', 'hdmi-to-vga-converter-adapter', 'UGR-H2V-40', 'HDMI to VGA Converter Adapter - high quality authentic product listed under Electronics Accessories. Complete manufacturer warranty and tested durability.', 450.00, 600.00, 25.00, 180, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(41, 11, 1, 'Mobile Phones', 'Google', 'Google Pixel 8a 128GB', 'google-pixel-8a-128gb', 'GGL-PX8-41', 'Google Pixel 8a 128GB - high quality authentic product listed under Mobile Phones. Complete manufacturer warranty and tested durability.', 56000.00, 60000.00, 7.00, 14, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(42, 12, 2, 'Laptops & Computers', 'Redragon', 'Mechanical Gaming Keyboard RGB', 'mechanical-gaming-keyboard-rgb', 'RDR-KBD-42', 'Mechanical Gaming Keyboard RGB - high quality authentic product listed under Laptops & Computers. Complete manufacturer warranty and tested durability.', 3400.00, 4200.00, 19.00, 40, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(43, 13, 3, 'Men\'s Fashion', 'Bay Emporium', 'Men Formal Oxford Shoes', 'men-formal-oxford-shoes', 'BAY-OXF-43', 'Men Formal Oxford Shoes - high quality authentic product listed under Men\'s Fashion. Complete manufacturer warranty and tested durability.', 4100.00, 5000.00, 18.00, 35, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(44, 14, 4, 'Women\'s Fashion', 'Sailor', 'Designer Handcrafted Kurti', 'designer-handcrafted-kurti', 'SLR-KRT-44', 'Designer Handcrafted Kurti - high quality authentic product listed under Women\'s Fashion. Complete manufacturer warranty and tested durability.', 1850.00, 2400.00, 23.00, 65, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(45, 15, 5, 'Kids\' Fashion', 'Lotto Kids', 'Kids LED Sports Sneaker Shoes', 'kids-led-sports-sneaker-shoes', 'LOT-LED-45', 'Kids LED Sports Sneaker Shoes - high quality authentic product listed under Kids\' Fashion. Complete manufacturer warranty and tested durability.', 1450.00, 1900.00, 24.00, 50, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(46, 1, 6, 'Home Appliances', 'Vision', 'Stand Fan with Remote Control 16 inch', 'stand-fan-with-remote-control-16-inch', 'VIS-FAN-46', 'Stand Fan with Remote Control 16 inch - high quality authentic product listed under Home Appliances. Complete manufacturer warranty and tested durability.', 4600.00, 5400.00, 15.00, 30, 'https://images.unsplash.com/photo-1563245372-f21724e3856d', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(47, 2, 7, 'Kitchen & Dining', 'Philips', 'Multi-Blade Kitchen Food Processor', 'multi-blade-kitchen-food-processor', 'PHL-FP-47', 'Multi-Blade Kitchen Food Processor - high quality authentic product listed under Kitchen & Dining. Complete manufacturer warranty and tested durability.', 5200.00, 6300.00, 17.00, 22, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(48, 3, 8, 'Furniture', 'Regal', 'Foldable Computer Study Desk', 'foldable-computer-study-desk', 'REG-DSK-48', 'Foldable Computer Study Desk - high quality authentic product listed under Furniture. Complete manufacturer warranty and tested durability.', 4200.00, 5200.00, 19.00, 25, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(49, 4, 9, 'Groceries', 'Kazi & Kazi', 'Organic Green Tea 100 Bags', 'organic-green-tea-100-bags', 'KZI-TEA-49', 'Organic Green Tea 100 Bags - high quality authentic product listed under Groceries. Complete manufacturer warranty and tested durability.', 380.00, 450.00, 16.00, 160, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(50, 5, 20, 'Electronics Accessories', 'Baseus', 'Fast USB-C to USB-C Braided Cable 2M', 'fast-usb-c-to-usb-c-braided-cable-2m', 'BAS-USBC-50', 'Fast USB-C to USB-C Braided Cable 2M - high quality authentic product listed under Electronics Accessories. Complete manufacturer warranty and tested durability.', 420.00, 550.00, 24.00, 220, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0', NULL, NULL, NULL, NULL, '[\"100% Original Authentic Item\",\"Official Brand Warranty Included\",\"Fast 48-Hour Nationwide Delivery\",\"7 Days Easy Return Policy\"]', 4.80, 18, 1, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(51, 1, NULL, 'Electronics', 'test', 'tes', 'tes-1788769706079', 'test', 'test', 45000.00, 4999.96, 0.00, 15, 'https://res.cloudinary.com/g7c5btrc/image/upload/v1788769659/sellora/products/gm6fswoauvazfu9n8dg4.jpg', NULL, NULL, NULL, NULL, '[]', 4.80, 12, 1, 1, '2026-09-07 14:28:26', '2026-09-07 14:29:29');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_questions`
--

CREATE TABLE `product_questions` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `answered_by` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `price_delta` decimal(12,2) DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `revenue`
--

CREATE TABLE `revenue` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `total_revenue` decimal(12,2) DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `revenue`
--

INSERT INTO `revenue` (`id`, `owner_id`, `total_revenue`, `created_at`, `updated_at`) VALUES
(1, 2, 78050.00, '2026-09-07 12:59:38', '2026-09-07 13:41:49'),
(2, 3, 69976.50, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(3, 4, 10650.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(4, 5, 24060.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(5, 6, 27360.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(6, 7, 98650.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(7, 8, 248100.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(8, 9, 39300.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(9, 10, 7330.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(10, 11, 5180.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(11, 12, 229800.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(12, 13, 9550.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(13, 14, 74100.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(14, 15, 12120.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(15, 16, 4750.00, '2026-09-07 12:59:38', '2026-09-07 12:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `site_name` varchar(255) DEFAULT 'SELLORA Bangladesh',
  `site_logo` varchar(500) DEFAULT NULL,
  `support_phone` varchar(50) DEFAULT '+880 9612-345678',
  `support_email` varchar(255) DEFAULT 'support@sellora.com',
  `announcement_text` text DEFAULT NULL,
  `default_commission_rate` decimal(5,2) DEFAULT 5.00,
  `banners_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`banners_json`)),
  `hero_config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hero_config_json`)),
  `brand_week_config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_week_config_json`)),
  `categories_config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`categories_config_json`)),
  `brands_config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brands_config_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `site_name`, `site_logo`, `support_phone`, `support_email`, `announcement_text`, `default_commission_rate`, `banners_json`, `hero_config_json`, `brand_week_config_json`, `categories_config_json`, `brands_config_json`, `created_at`, `updated_at`) VALUES
(1, 'SELLORA Multi-Vendor Bangladesh', NULL, '+880 9612-345678', 'support@sellora.com', 'Welcome to SELLORA Multi-Vendor Marketplace - Enjoy Free Shipping on orders over BDT 5,000!', 5.00, '[{\"id\":1,\"title\":\"Super Gadget Deals\",\"discount\":\"Up to 35% OFF\",\"link\":\"/campaigns/electronics\",\"image\":\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e\"},{\"id\":2,\"title\":\"Lifestyle & Fashion Week\",\"discount\":\"Flat 25% OFF\",\"link\":\"/campaigns/fashion\",\"image\":\"https://images.unsplash.com/photo-1445205170230-053b83016050\"}]', '{\"title\":\"Discover Amazing Deals Across Bangladesh\",\"subtitle\":\"Over 50+ Verified Multi-Vendor Stores with 100% Genuine Guaranteed Products\",\"badge\":\"Mega Summer Sale 2026\"}', NULL, NULL, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `mobile` varchar(20) DEFAULT '',
  `role` enum('CUSTOMER','SELLER','ADMIN','SUPER_ADMIN','MODERATOR','ORDER_MANAGER') NOT NULL DEFAULT 'CUSTOMER',
  `address` varchar(255) DEFAULT '',
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_email_verified` tinyint(1) DEFAULT 1,
  `vendor_id` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `phone`, `mobile`, `role`, `address`, `avatar_url`, `is_email_verified`, `vendor_id`, `created_at`, `updated_at`) VALUES
(1, 'SELLORA Super Admin', 'admin', 'admin@sellora.com', '$2b$10$rhkakTBsWzlYOfX8h0XNju4EbYcabxhPkdeuKWc50RWvVaG1FY80e', '+880 1700-000000', '', 'SUPER_ADMIN', 'Headquarters, Gulshan, Dhaka', NULL, 1, NULL, '2026-09-07 12:59:37', '2026-09-07 12:59:37'),
(2, 'Emran Rahman', 'emranrahman', 'emranrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345671', '01712345671', 'SELLER', 'Zindabazar, Sylhet', NULL, 1, '1', '2026-09-07 12:59:37', '2026-09-07 12:59:38'),
(3, 'Nasrin Islam', 'nasrinislam', 'nasrinislam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01812345672', '01812345672', 'SELLER', 'Zindabazar, Sylhet', NULL, 1, '2', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(4, 'Rumana Miah', 'rumanamiah', 'rumanamiah@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01912345673', '01912345673', 'SELLER', 'Agrabad, Chattogram', NULL, 1, '3', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(5, 'Tariqul Hassan', 'tariqulhassan', 'tariqulhassan@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345674', '01712345674', 'SELLER', 'GEC Circle, Chattogram', NULL, 1, '4', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(6, 'Farhana Sharmin', 'farhanasharmin', 'farhanasharmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01612345675', '01612345675', 'SELLER', 'Dhanmondi, Dhaka', NULL, 1, '5', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(7, 'Saiful Alam', 'saifulalam', 'saifulalam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01512345676', '01512345676', 'SELLER', 'Elephant Road, Dhaka', NULL, 1, '6', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(8, 'Tanvir Ahmed', 'tanvirahmed', 'tanvirahmed@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01312345677', '01312345677', 'SELLER', 'IDB Bhaban, Dhaka', NULL, 1, '7', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(9, 'Mehedi Hasan', 'mehedihasan', 'mehedihasan@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01812345678', '01812345678', 'SELLER', 'Motijheel, Dhaka', NULL, 1, '8', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(10, 'Nusrat Sultana', 'nusratsultana', 'nusratsultana@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345679', '01712345679', 'SELLER', 'Uttara, Dhaka', NULL, 1, '9', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(11, 'Kamal Uddin', 'kamaluddin', 'kamaluddin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01612345680', '01612345680', 'SELLER', 'Dhanmondi, Dhaka', NULL, 1, '10', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(12, 'Shafiqul Reza', 'shafiqulreza', 'shafiqulreza@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01912345681', '01912345681', 'SELLER', 'Mirpur, Dhaka', NULL, 1, '11', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(13, 'Afroza Akter', 'afrozaakter', 'afrozaakter@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01512345682', '01512345682', 'SELLER', 'Chawkbazar, Chattogram', NULL, 1, '12', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(14, 'Ziaur Rahman', 'ziaurrahman', 'ziaurrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01712345683', '01712345683', 'SELLER', 'Nilkhet, Dhaka', NULL, 1, '13', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(15, 'Shamima Sharmin', 'shamimasharmin', 'shamimasharmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01812345684', '01812345684', 'SELLER', 'Gulshan 1, Dhaka', NULL, 1, '14', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(16, 'Delwar Miah', 'delwarmiah', 'delwarmiah@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01912345685', '01912345685', 'SELLER', 'Panthapath, Dhaka', NULL, 1, '15', '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(17, 'Rafiqul Hossain', 'rafiqulhossain', 'rafiqulhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01512345678', '01512345678', 'CUSTOMER', 'Mirpur 10, Dhaka', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(18, 'Shirin Begum', 'shirinbegum', 'shirinbegum@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01798765432', '01798765432', 'CUSTOMER', 'Sector 7, Uttara, Dhaka', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(19, 'Mizanur Islam', 'mizanurislam', 'mizanurislam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01634567891', '01634567891', 'CUSTOMER', 'Sonadanga, Khulna', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(20, 'Tania Akter', 'taniaakter', 'taniaakter@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01856789012', '01856789012', 'CUSTOMER', 'Chawkbazar, Chattogram', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(21, 'Arifur Rahman', 'arifurrahman', 'arifurrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01978901234', '01978901234', 'CUSTOMER', 'Shibganj, Sylhet', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(22, 'Salma Khatun', 'salmakhatun', 'salmakhatun@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01711223344', '01711223344', 'CUSTOMER', 'Rajpara, Rajshahi', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(23, 'Jahangir Alom', 'jahangiralom', 'jahangiralom@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01822334455', '01822334455', 'CUSTOMER', 'Bandar, Narayanganj', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(24, 'Fahmida Akter', 'fahmidaakter', 'fahmidaakter@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01933445566', '01933445566', 'CUSTOMER', 'Kandirpar, Cumilla', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(25, 'Kawsar Habib', 'kawsarhabib', 'kawsarhabib@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01644556677', '01644556677', 'CUSTOMER', 'Court Road, Bogura', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(26, 'Rubina Yesmin', 'rubinayesmin', 'rubinayesmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01555667788', '01555667788', 'CUSTOMER', 'Sadur Mor, Rangpur', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(27, 'Hasan Mahmud', 'hasanmahmud', 'hasanmahmud@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01766778899', '01766778899', 'CUSTOMER', 'Town Hall, Mymensingh', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(28, 'Nasima Khondoker', 'nasimakhondoker', 'nasimakhondoker@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01877889900', '01877889900', 'CUSTOMER', 'Natun Bazar, Barishal', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(29, 'Asraful Alam', 'asrafulalam', 'asrafulalam@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01988990011', '01988990011', 'CUSTOMER', 'Boro Bazar, Jashore', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(30, 'Faruk Ahmed', 'farukahmed', 'farukahmed@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01699001122', '01699001122', 'CUSTOMER', 'Sadar Road, Dinajpur', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(31, 'Maruf Hossain', 'marufhossain', 'marufhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01700112233', '01700112233', 'CUSTOMER', 'College Gate, Tangail', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(32, 'Sabrina Sharmin', 'sabrinasharmin', 'sabrinasharmin@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01811223355', '01811223355', 'CUSTOMER', 'Station Road, Pabna', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(33, 'Lutfor Rahman', 'lutforrahman', 'lutforrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01922334466', '01922334466', 'CUSTOMER', 'Hospital Mor, Kushtia', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(34, 'Samia Sultana', 'samiasultana', 'samiasultana@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01533445577', '01533445577', 'CUSTOMER', 'Main Road, Gazipur', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(35, 'Rezwanul Karim', 'rezwanulkarim', 'rezwanulkarim@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01744556688', '01744556688', 'CUSTOMER', 'Court Point, Coxs Bazar', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(36, 'Nazneen Ferdaus', 'nazneenferdaus', 'nazneenferdaus@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01855667799', '01855667799', 'CUSTOMER', 'Sadar Hospital Road, Feni', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(37, 'Habibur Rahman', 'habiburrahman', 'habiburrahman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01966778800', '01966778800', 'CUSTOMER', 'Purana Paltan, Dhaka', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(38, 'Rokeya Begum', 'rokeyabegum', 'rokeyabegum@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01677889911', '01677889911', 'CUSTOMER', 'Gopalgonj Sadar', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(39, 'Imran Hossain', 'imranhossain', 'imranhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01788990022', '01788990022', 'CUSTOMER', 'Chawkbazar, Barishal', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(40, 'Nazia Parveen', 'naziaparveen', 'naziaparveen@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01899001133', '01899001133', 'CUSTOMER', 'Shyamoli, Dhaka', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(41, 'Anwar Hossain', 'anwarhossain', 'anwarhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01900112244', '01900112244', 'CUSTOMER', 'Halishahar, Chattogram', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(42, 'Khadijatul Habiba', 'khadijatulhabiba', 'khadijatulhabiba@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01511223366', '01511223366', 'CUSTOMER', 'Amborkhana, Sylhet', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(43, 'Moniruzzaman', 'moniruzzaman', 'moniruzzaman@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01722334477', '01722334477', 'CUSTOMER', 'Zero Point, Rajshahi', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(44, 'Bilkis Panna', 'bilkispanna', 'bilkispanna@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01833445588', '01833445588', 'CUSTOMER', 'Khan Jahan Ali Road, Khulna', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(45, 'Sajjad Hossain', 'sajjadhossain', 'sajjadhossain@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01944556699', '01944556699', 'CUSTOMER', 'Badarganj Road, Rangpur', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(46, 'Poly Chowdhury', 'polychowdhury', 'polychowdhury@example.com', '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy', '01823456789', '01823456789', 'CUSTOMER', 'Boalia, Rajshahi', NULL, 1, NULL, '2026-09-07 12:59:38', '2026-09-07 12:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `street` varchar(500) NOT NULL,
  `city` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `full_name`, `phone`, `street`, `city`, `area`, `postal_code`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 17, 'Rafiqul Hossain', '01512345678', 'Mirpur 10, Dhaka', 'Dhaka', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(2, 18, 'Shirin Begum', '01798765432', 'Sector 7, Uttara, Dhaka', 'Dhaka', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(3, 19, 'Mizanur Islam', '01634567891', 'Sonadanga, Khulna', 'Khulna', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(4, 20, 'Tania Akter', '01856789012', 'Chawkbazar, Chattogram', 'Chattogram', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(5, 21, 'Arifur Rahman', '01978901234', 'Shibganj, Sylhet', 'Sylhet', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(6, 22, 'Salma Khatun', '01711223344', 'Rajpara, Rajshahi', 'Rajshahi', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(7, 23, 'Jahangir Alom', '01822334455', 'Bandar, Narayanganj', 'Narayanganj', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(8, 24, 'Fahmida Akter', '01933445566', 'Kandirpar, Cumilla', 'Cumilla', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(9, 25, 'Kawsar Habib', '01644556677', 'Court Road, Bogura', 'Bogura', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(10, 26, 'Rubina Yesmin', '01555667788', 'Sadur Mor, Rangpur', 'Rangpur', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(11, 27, 'Hasan Mahmud', '01766778899', 'Town Hall, Mymensingh', 'Mymensingh', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(12, 28, 'Nasima Khondoker', '01877889900', 'Natun Bazar, Barishal', 'Barishal', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(13, 29, 'Asraful Alam', '01988990011', 'Boro Bazar, Jashore', 'Jashore', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(14, 30, 'Faruk Ahmed', '01699001122', 'Sadar Road, Dinajpur', 'Dinajpur', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(15, 31, 'Maruf Hossain', '01700112233', 'College Gate, Tangail', 'Tangail', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(16, 32, 'Sabrina Sharmin', '01811223355', 'Station Road, Pabna', 'Pabna', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(17, 33, 'Lutfor Rahman', '01922334466', 'Hospital Mor, Kushtia', 'Kushtia', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(18, 34, 'Samia Sultana', '01533445577', 'Main Road, Gazipur', 'Gazipur', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(19, 35, 'Rezwanul Karim', '01744556688', 'Court Point, Coxs Bazar', 'Coxs Bazar', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(20, 36, 'Nazneen Ferdaus', '01855667799', 'Sadar Hospital Road, Feni', 'Feni', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(21, 37, 'Habibur Rahman', '01966778800', 'Purana Paltan, Dhaka', 'Dhaka', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(22, 38, 'Rokeya Begum', '01677889911', 'Gopalgonj Sadar', 'Gopalgonj', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(23, 39, 'Imran Hossain', '01788990022', 'Chawkbazar, Barishal', 'Barishal', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(24, 40, 'Nazia Parveen', '01899001133', 'Shyamoli, Dhaka', 'Dhaka', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(25, 41, 'Anwar Hossain', '01900112244', 'Halishahar, Chattogram', 'Chattogram', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(26, 42, 'Khadijatul Habiba', '01511223366', 'Amborkhana, Sylhet', 'Sylhet', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(27, 43, 'Moniruzzaman', '01722334477', 'Zero Point, Rajshahi', 'Rajshahi', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(28, 44, 'Bilkis Panna', '01833445588', 'Khan Jahan Ali Road, Khulna', 'Khulna', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(29, 45, 'Sajjad Hossain', '01944556699', 'Badarganj Road, Rangpur', 'Rangpur', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(30, 46, 'Poly Chowdhury', '01823456789', 'Boalia, Rajshahi', 'Rajshahi', 'Central Area', NULL, 1, '2026-09-07 12:59:38', '2026-09-07 12:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `banner_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT '',
  `email` varchar(255) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'APPROVED',
  `commission_rate` decimal(5,2) DEFAULT 5.00,
  `balance` decimal(12,2) DEFAULT 0.00,
  `street` varchar(255) DEFAULT '',
  `city` varchar(100) DEFAULT 'Dhaka',
  `area` varchar(100) DEFAULT 'Central',
  `rating` decimal(3,2) DEFAULT 5.00,
  `review_count` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `owner_id`, `store_name`, `slug`, `logo_url`, `banner_url`, `description`, `phone`, `email`, `status`, `commission_rate`, `balance`, `street`, `city`, `area`, `rating`, `review_count`, `created_at`, `updated_at`) VALUES
(1, 2, 'Emran Tech Mart', 'emran-tech-mart', NULL, NULL, NULL, '01712345671', 'emranrahman@example.com', 'APPROVED', 5.00, 25400.00, 'Zindabazar, Sylhet', 'Sylhet', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(2, 3, 'Nasrin Fashion Gallery', 'nasrin-fashion-gallery', NULL, NULL, NULL, '01812345672', 'nasrinislam@example.com', 'APPROVED', 5.00, 25400.00, 'Zindabazar, Sylhet', 'Sylhet', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(3, 4, 'Rumana Electronics', 'rumana-electronics', NULL, NULL, NULL, '01912345673', 'rumanamiah@example.com', 'APPROVED', 5.00, 25400.00, 'Agrabad, Chattogram', 'Chattogram', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(4, 5, 'Hassan Gadget Zone', 'hassan-gadget-zone', NULL, NULL, NULL, '01712345674', 'tariqulhassan@example.com', 'APPROVED', 5.00, 25400.00, 'GEC Circle, Chattogram', 'Chattogram', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(5, 6, 'Sharmin Beauty & Care', 'sharmin-beauty-care', NULL, NULL, NULL, '01612345675', 'farhanasharmin@example.com', 'APPROVED', 5.00, 25400.00, 'Dhanmondi, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(6, 7, 'Alam Footwear & Leather', 'alam-footwear-leather', NULL, NULL, NULL, '01512345676', 'saifulalam@example.com', 'APPROVED', 5.00, 25400.00, 'Elephant Road, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(7, 8, 'Tanvir Laptop & Accessories', 'tanvir-laptop-accessories', NULL, NULL, NULL, '01312345677', 'tanvirahmed@example.com', 'APPROVED', 5.00, 25400.00, 'IDB Bhaban, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(8, 9, 'Mehedi Sports & Fitness', 'mehedi-sports-fitness', NULL, NULL, NULL, '01812345678', 'mehedihasan@example.com', 'APPROVED', 5.00, 25400.00, 'Motijheel, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(9, 10, 'Nusrat Home & Kitchen', 'nusrat-home-kitchen', NULL, NULL, NULL, '01712345679', 'nusratsultana@example.com', 'APPROVED', 5.00, 25400.00, 'Uttara, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(10, 11, 'Kamal Grocery & Organics', 'kamal-grocery-organics', NULL, NULL, NULL, '01612345680', 'kamaluddin@example.com', 'APPROVED', 5.00, 25400.00, 'Dhanmondi, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(11, 12, 'Reza Automotive Care', 'reza-automotive-care', NULL, NULL, NULL, '01912345681', 'shafiqulreza@example.com', 'APPROVED', 5.00, 25400.00, 'Mirpur, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(12, 13, 'Afroza Kids & Toys World', 'afroza-kids-toys-world', NULL, NULL, NULL, '01512345682', 'afrozaakter@example.com', 'APPROVED', 5.00, 25400.00, 'Chawkbazar, Chattogram', 'Chattogram', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(13, 14, 'Zia Books & Stationery', 'zia-books-stationery', NULL, NULL, NULL, '01712345683', 'ziaurrahman@example.com', 'APPROVED', 5.00, 25400.00, 'Nilkhet, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(14, 15, 'Shamima Luxury Watches', 'shamima-luxury-watches', NULL, NULL, NULL, '01812345684', 'shamimasharmin@example.com', 'APPROVED', 5.00, 25400.00, 'Gulshan 1, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38'),
(15, 16, 'Delwar Furniture Hub', 'delwar-furniture-hub', NULL, NULL, NULL, '01912345685', 'delwarmiah@example.com', 'APPROVED', 5.00, 25400.00, 'Panthapath, Dhaka', 'Dhaka', 'Central', 4.90, 0, '2026-09-07 12:59:38', '2026-09-07 12:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `vendor_withdrawals`
--

CREATE TABLE `vendor_withdrawals` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `account_details` varchar(255) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED') DEFAULT 'PENDING',
  `transaction_ref` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_activity_action` (`action`),
  ADD KEY `idx_activity_module` (`module`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cart_customer` (`customer_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_cart_items_cart` (`cart_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `idx_categories_slug` (`slug`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_coupons_code` (`code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_orders_customer` (`customer_id`),
  ADD KEY `idx_orders_number` (`order_number`),
  ADD KEY `idx_orders_status` (`order_status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items_order` (`order_id`),
  ADD KEY `idx_order_items_vendor` (`vendor_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_history_order` (`order_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payments_order` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_products_vendor` (`vendor_id`),
  ADD KEY `idx_products_category` (`category`),
  ADD KEY `idx_products_sku` (`sku`),
  ADD KEY `idx_products_published` (`is_published`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_images_product` (`product_id`);

--
-- Indexes for table `product_questions`
--
ALTER TABLE `product_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_questions_product` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_variants_product` (`product_id`);

--
-- Indexes for table `revenue`
--
ALTER TABLE `revenue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `owner_id` (`owner_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_addresses_user` (`user_id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `owner_id` (`owner_id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_vendors_slug` (`slug`),
  ADD KEY `idx_vendors_status` (`status`);

--
-- Indexes for table `vendor_withdrawals`
--
ALTER TABLE `vendor_withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_withdrawals_vendor` (`vendor_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_questions`
--
ALTER TABLE `product_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `revenue`
--
ALTER TABLE `revenue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `vendor_withdrawals`
--
ALTER TABLE `vendor_withdrawals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_questions`
--
ALTER TABLE `product_questions`
  ADD CONSTRAINT `product_questions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `revenue`
--
ALTER TABLE `revenue`
  ADD CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vendors`
--
ALTER TABLE `vendors`
  ADD CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vendor_withdrawals`
--
ALTER TABLE `vendor_withdrawals`
  ADD CONSTRAINT `vendor_withdrawals_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
