## Department of Computer Science & Engineering | Section: 4G

## Neon Coders

PROJECT REPORT

## Multi-Vendor E-Commerce Management

## GROUP MEMBERS

| Fakrul Hossain (Team Leader) | Aminul Islam Riad | Sadia Akter |
| --- | --- | --- |
| ID: 42250202776 | ID: 42250202781 | ID: 42250202773 |
| Rakia Akter | Lamia Yesmin Mahin | Masiat Subha |
| ID: 42250202774 | ID: 42250202766 | ID: 42250202753 |

Submitted To:

Khandaker Wasim Reza Tanmoy Lecturer, Department of CSE


## Project Name: Multi-Vendor E-Commerce Management

## Project Summary:

Multi-Vendor E-Commerce Management is a console-based application developed in C, integrated with a MySQL database through the MySQL Connector/C API. The system allows multiple store owners to list and manage their own products under one shared platform, while customers can browse, search, add items to a cart, and place orders. All data — users, products, carts, and orders — is stored and processed centrally in MySQL instead of flat files, enabling reliable multi-user, multi-vendor operation and easy reporting.

## Objective:

- Multi-Vendor Support: Multiple store owners can register and manage their own product catalog independently.

- Role-Based Access: Separate menus and permissions for Customer and Store Owner roles.

- Database-Driven Storage: All records (users, products, cart, orders) are stored in a normalized MySQL schema instead of flat files.

- Order and Inventory Management: Stock is automatically adjusted when an order is placed, keeping inventory accurate.

- Centralized Data Management: A single MySQL database serves as the shared source of truth for every vendor and customer.

## System Features Implemented

- User Registration & Login: Customers and store owners register and authenticate through the users table.

- Product Browse & Search: Customers can search products by name or category using the SearchProducts procedure.

- Shopping Cart: Items are added to a persistent cart (cart, cart_items tables) before checkout.

- Checkout & Order Processing: The Checkout procedure converts a cart into an order, records order_items, and deducts stock in a single transaction.

- Product Management: Store owners can add, update, and delete their own products.

- Stock Management: Store owners can increase or decrease stock quantity at any time.

- Order Tracking: Store owners can view all orders that include their products.


## System Workflow:


## System Architecture (Database Schema):

## System Overview:

The system is designed around a normalized MySQL database that supports two roles: Customer and Store Owner. On startup, the C application connects to MySQL using the MySQL Connector/C library. Based on the logged-in user's role, the program shows either the Customer Menu (Browse, Cart, Checkout) or the Store Owner Menu (Add/Update/Delete Product, Manage Stock, View Orders). Every action in the menu maps to a stored procedure call, keeping the business logic close to the data and easy to reuse.

## Modules:

- Authentication Module (Register / Login)

- Customer Module (Browse, Search, Cart, Checkout)

- Store Owner Module (Product & Stock Management, Order Tracking)


## Authentication Module –

Handles account creation and login for both customers and store owners. A user's role determines which menu is shown after a successful login.

```
CREATE PROCEDURE RegisterUser(
IN p_username VARCHAR(50),
IN p_password VARCHAR(255),
IN p_email VARCHAR(100),
IN p_role VARCHAR(10)
)
BEGIN
INSERT INTO users (username, password, email, role)
VALUES (p_username, p_password, p_email, p_role);
END
```

Corresponding C function that calls the procedure through the MySQL connector:

```
void registerUser() {
char username[50], password[100], email[100], role[10];
char query[512];
printf("Username: "); scanf("%49s", username);
printf("Password: "); scanf("%99s", password);
printf("Email: "); scanf("%99s", email);
printf("Role (CUSTOMER/OWNER): "); scanf("%9s", role);
snprintf(query, sizeof(query),
"CALL RegisterUser('%s','%s','%s','%s')",
username, password, email, role);
runQuery(query);
}
```


## Customer Module –

Allows a customer to search products by name or category, add products to a persistent cart, and check out.

Checkout converts the cart into a confirmed order and reduces stock accordingly.

```
CREATE PROCEDURE SearchProducts(IN p_keyword VARCHAR(100))
BEGIN
SELECT p.product_id, p.product_name, p.description, p.price,
p.stock_qty, c.category_name, u.username AS store_owner
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN users u ON p.owner_id = u.user_id
WHERE p.product_name LIKE CONCAT('%', p_keyword, '%')
OR c.category_name LIKE CONCAT('%', p_keyword, '%');
END
CREATE PROCEDURE Checkout(IN p_customer_id INT, OUT p_order_id INT)
BEGIN
-- 1. get latest cart, compute total
-- 2. insert into orders, capture new order_id
-- 3. copy cart_items into order_items
-- 4. deduct ordered quantity from products.stock_qty
-- 5. clear the cart
END
```

Checkout call from the C client, using a MySQL session variable to read the OUT parameter:

```
void checkout(int customerId) {
char query[128];
snprintf(query, sizeof(query), "CALL Checkout(%d, @orderId)", customerId);
runQuery(query);
mysql_next_result(conn);
runQuery("SELECT @orderId");
// fetch and print the generated order id
}
```


## Store Owner Module –

Lets a store owner manage their own products (add, update, delete), adjust stock levels, and view every order that contains their products.

```
CREATE PROCEDURE AddProduct(
IN p_owner_id INT,
IN p_category_id INT,
IN p_product_name VARCHAR(100),
IN p_description VARCHAR(255),
IN p_price DECIMAL(10,2),
IN p_stock_qty INT
)
BEGIN
INSERT INTO products (owner_id, category_id, product_name,
description, price, stock_qty)
VALUES (p_owner_id, p_category_id, p_product_name,
p_description, p_price, p_stock_qty);
END
CREATE PROCEDURE ViewOrdersByOwner(IN p_owner_id INT)
BEGIN
SELECT o.order_id, o.order_date, u.username AS customer_name,
p.product_name, oi.quantity, oi.price, o.status
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN users u ON o.customer_id = u.user_id
WHERE oi.owner_id = p_owner_id
ORDER BY o.order_date DESC;
END
```


## Database Extension: Vendor Profiles, Payments & Revenue

Building on the users, categories, products, cart, cart_items, orders, and order_items tables, the schema adds a mobile number and address to users, plus two new tables: payments (one payment row per order) and revenue (aggregated earnings per shop owner). Roles and statuses use ENUM columns (users.role, orders.status, payments.payment_method, payments.payment_status) rather than free-text values. Sample data was then seeded: 15 shop owners and 30 customers (each with a mobile number and address), 20 product categories, 50 products spread across all owners and categories, 50 full orders with their order items, and a COMPLETED payment for every order. The listings below are representative excerpts; the complete, ready-to-run script (all table definitions plus all 15 owners, 30 customers, 50 products, 50 orders, and 50 payments) is provided separately as multi_vendor_ecommerce_full.sql.

## 1. Table Definition Queries (CREATE)

```
CREATE TABLE users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
mobile VARCHAR(20),
role ENUM('OWNER','CUSTOMER') NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
address VARCHAR(200)
);
CREATE TABLE categories (
category_id INT AUTO_INCREMENT PRIMARY KEY,
category_name VARCHAR(100) NOT NULL UNIQUE,
description VARCHAR(255)
);
CREATE TABLE products (
product_id INT AUTO_INCREMENT PRIMARY KEY,
owner_id INT NOT NULL,
category_id INT NOT NULL,
product_name VARCHAR(150) NOT NULL,
description VARCHAR(255),
price DECIMAL(10,2) NOT NULL,
stock INT NOT NULL DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);
CREATE TABLE orders (
order_id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL,
order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
status ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') DEFAULT
'PENDING',
FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE order_items (
order_item_id INT AUTO_INCREMENT PRIMARY KEY,
```


```
order_id INT NOT NULL,
product_id INT NOT NULL,
owner_id INT NOT NULL,
quantity INT NOT NULL,
price DECIMAL(10,2) NOT NULL,
subtotal DECIMAL(10,2) NOT NULL,
FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE RESTRICT
);
CREATE TABLE payments (
payment_id INT AUTO_INCREMENT PRIMARY KEY,
order_id INT NOT NULL,
payment_method ENUM('CASH','BKASH','NAGAD','CARD') DEFAULT 'CASH',
payment_status ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
CREATE TABLE revenue (
revenue_id INT AUTO_INCREMENT PRIMARY KEY,
owner_id INT NOT NULL UNIQUE,
total_revenue DECIMAL(12,2) DEFAULT 0,
FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

## 2. Insert 15 Shop Owners (with mobile numbers & addresses)

```
INSERT INTO users (username, password, email, mobile, role, address) VALUES
('emranrahman', 'Pass@123', 'emranrahman@example.com', '01712345671', 'OWNER',
'Zindabazar, Sylhet'),
('nasrinislam', 'Pass@123', 'nasrinislam@example.com', '01812345672', 'OWNER',
'Zindabazar, Sylhet'),
('rumanamiah', 'Pass@123', 'rumanamiah@example.com', '01912345673', 'OWNER',
'Agrabad, Chattogram'),
-- ... 12 more owner rows (full list in multi_vendor_ecommerce_full.sql)
('kamaluddin', 'Pass@123', 'kamaluddin@example.com', '01612345680', 'OWNER',
'Dhanmondi, Dhaka');
-- Owner user_id assumed as 1-15 (fresh table, AUTO_INCREMENT starts at 1)
```

## 3. Insert 30 Customers (with mobile numbers & addresses)

```
INSERT INTO users (username, password, email, mobile, role, address) VALUES
('rafiqulhossain', 'Pass@123', 'rafiqulhossain@example.com', '01512345678',
'CUSTOMER', 'Mirpur, Dhaka'),
('shirinbegum', 'Pass@123', 'shirinbegum@example.com', '01798765432', 'CUSTOMER',
'Uttara, Dhaka'),
('mizanurislam', 'Pass@123', 'mizanurislam@example.com', '01634567891', 'CUSTOMER',
'Sonadanga, Khulna'),
-- ... 27 more customer rows (full list in multi_vendor_ecommerce_full.sql)
('polychowdhury', 'Pass@123', 'polychowdhury@example.com', '01823456789',
'CUSTOMER', 'Boalia, Rajshahi');
-- Customer user_id assumed as 16-45 (continuing AUTO_INCREMENT)
```


## 4. Insert 20 Categories

```
INSERT INTO categories (category_name, description) VALUES
('Mobile Phones', 'Smartphones and feature phones from all major brands'),
('Laptops & Computers', 'Laptops, desktops, and computer peripherals'),
('Men''s Fashion', 'Clothing and accessories for men'),
('Women''s Fashion', 'Clothing and accessories for women'),
('Kids'' Fashion', 'Clothing and footwear for children'),
('Home Appliances', 'Appliances for everyday home use'),
('Kitchen & Dining', 'Cookware, dinnerware, and kitchen tools'),
('Furniture', 'Home and office furniture'),
('Groceries', 'Daily grocery and food essentials'),
('Beauty & Personal Care', 'Skincare, haircare, and personal hygiene products'),
('Health & Wellness', 'Health monitoring and wellness products'),
('Sports & Outdoor', 'Sports gear and outdoor equipment'),
('Books & Stationery', 'Books, notebooks, and office stationery'),
('Toys & Games', 'Toys and games for children'),
('Automotive Accessories', 'Accessories and gadgets for vehicles'),
('Mobile Accessories', 'Chargers, cases, and other phone accessories'),
('Footwear', 'Shoes and sandals for all ages'),
('Bags & Luggage', 'Bags, backpacks, and travel luggage'),
('Watches & Jewelry', 'Watches and fashion jewelry'),
('Electronics Accessories', 'Cables, adapters, and small electronics');
-- category_id assumed as 1-20
```

## 5. Insert 50 Products

```
INSERT INTO products (owner_id, category_id, product_name, description, price,
stock) VALUES
(1, 1, 'Smartphone X10', 'Smartphone X10 - quality product listed under Mobile
Phones', 12450.00, 84),
(2, 2, 'Ultrabook 14 inch', 'Ultrabook 14 inch - quality product listed under
Laptops & Computers', 9875.50, 46),
(3, 3, 'Cotton Panjabi', 'Cotton Panjabi - quality product listed under Men''s
Fashion', 1450.00, 120),
-- ... 47 more product rows across all 15 owners & 20 categories (full list in
multi_vendor_ecommerce_full.sql)
(5, 20, 'Extension Socket 4-Way', 'Extension Socket 4-Way - quality product listed
under Electronics Accessories', 650.00, 200);
-- product_id assumed as 1-50
```

## 6. Insert 50 Sample Full Orders (with order_items)

```
INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES
(16, NOW() - INTERVAL 12 DAY, 18650.00, 'DELIVERED'),
(17, NOW() - INTERVAL 5 DAY, 2450.00, 'SHIPPED'),
-- ... 48 more order rows, one per customer cycle (full list in
multi_vendor_ecommerce_full.sql)
(45, NOW() - INTERVAL 40 DAY, 3200.00, 'PENDING');
-- order_id assumed as 1-50 (fresh table, AUTO_INCREMENT starts at 1)
INSERT INTO order_items (order_id, product_id, owner_id, quantity, price, subtotal)
VALUES
(1, 4, 1, 2, 8500.00, 17000.00),
(1, 12, 3, 1, 1650.00, 1650.00),
```


```
(2, 27, 9, 3, 816.67, 2450.00),
-- ... remaining order_items rows for all 50 orders (full list in
multi_vendor_ecommerce_full.sql)
(50, 33, 11, 1, 3200.00, 3200.00);
```

## 7. Complete Payments for All 50 Orders

```
INSERT INTO payments (order_id, payment_method, payment_status, payment_date)
VALUES
(1, 'BKASH', 'COMPLETED', NOW() - INTERVAL 12 DAY),
(2, 'NAGAD', 'COMPLETED', NOW() - INTERVAL 5 DAY),
-- ... 48 more payment rows, one per order (full list in
multi_vendor_ecommerce_full.sql)
(50, 'CASH', 'COMPLETED', NOW() - INTERVAL 40 DAY);
-- Every one of the 50 orders now has a matching COMPLETED payment.
-- Note: this schema's payments table has no amount column — the paid
-- amount is read from orders.total_amount via order_id.
```

## 8. Revenue Table — Calculate Revenue for Each Owner

The revenue table is populated by joining order_items to products (for owner_id), orders, and payments, keeping only orders whose payment is COMPLETED, then grouping by owner to get each shop owner's total earnings (this schema's revenue table tracks total_revenue only, not an order count):

```
INSERT INTO revenue (owner_id, total_revenue)
SELECT
p.owner_id,
SUM(oi.subtotal) AS total_revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
JOIN payments pay ON pay.order_id = o.order_id
WHERE pay.payment_status = 'COMPLETED'
GROUP BY p.owner_id
ON DUPLICATE KEY UPDATE
total_revenue = VALUES(total_revenue);
-- Verify: revenue per shop owner
SELECT u.username AS shop_owner, r.total_revenue
FROM revenue r
JOIN users u ON u.user_id = r.owner_id
ORDER BY r.total_revenue DESC;
```


## Architecture Overview:

The system was developed using the following stack:

- Client: Console application written in C (menu-driven interface).

- Database Connector: MySQL Connector/C (mysql.h), used to send CALL statements to stored procedures and read result sets.

- Database: MySQL schema with 9 tables (users, categories, products, cart, cart_items, orders, order_items, payments, revenue) and 9 stored procedures, plus an extended users table (mobile, address columns) and a seed dataset covering 15 owners, 30 customers, 20 categories, 50 products, and 50 full orders with payments.

## How to set it up:

- 1. Run multi_vendor_ecommerce_full.sql in MySQL to create the database, tables, and stored procedures.

- 2. Install the MySQL C connector (dev headers), e.g. sudo apt install libmysqlclient-dev on Ubuntu.

- 3. Update the host, username, password, and database name inside connectDB() in the C source.

- 4. Compile: gcc multi_vendor_ecommerce.c -o app \$(mysql_config --cflags --libs)

- 5. Run: ./app


## Project Timeline:

| Milestone | Duration |
| --- | --- |
| Requirement Analysis & Design | 1 Week |
| Database Schema & Stored Procedure Development | 2 Weeks |
| C Console Application Development (MySQL Connector) | 2 Weeks |
| Integration and Testing | 1 Week |
| User Testing and Quality Assurance | 1 Week |
| Presentation and Demonstration | 1 Week |

## Future Enhancements:

- Add a review and rating system for products.

- Support order status updates (Shipped, Delivered, Cancelled) from the owner menu.

- Password hashing and input validation for stronger security.

- Export sales reports to CSV/PDF for each store owner.

- Optional GUI or web front-end on top of the same MySQL backend.

## Conclusion:

The Multi-Vendor E-Commerce Management project was successfully implemented as a MySQL-backed console application in C, meeting its objective of supporting multiple independent store owners and customers on a single shared platform. Moving the data layer from flat files to a normalized MySQL database with stored procedures made the system more reliable, easier to query, and simpler to extend with new features such as reporting and order tracking.
