import fs from 'fs';
import path from 'path';

// Seed data definition
const adminHash = '$2b$10$rhkakTBsWzlYOfX8h0XNju4EbYcabxhPkdeuKWc50RWvVaG1FY80e'; // Admin123456
const userHash = '$2b$10$EfKdvGaZoRxX85bjTUdEnuPNQe.1K6Atq82ll92TTrOB.sAQVlDfy';  // Pass@123

// 15 Shop Owners from the report
const owners = [
  { username: 'emranrahman', name: 'Emran Rahman', email: 'emranrahman@example.com', mobile: '01712345671', store: 'Emran Tech Mart', address: 'Zindabazar, Sylhet', city: 'Sylhet' },
  { username: 'nasrinislam', name: 'Nasrin Islam', email: 'nasrinislam@example.com', mobile: '01812345672', store: 'Nasrin Fashion Gallery', address: 'Zindabazar, Sylhet', city: 'Sylhet' },
  { username: 'rumanamiah', name: 'Rumana Miah', email: 'rumanamiah@example.com', mobile: '01912345673', store: 'Rumana Electronics', address: 'Agrabad, Chattogram', city: 'Chattogram' },
  { username: 'tariqulhassan', name: 'Tariqul Hassan', email: 'tariqulhassan@example.com', mobile: '01712345674', store: 'Hassan Gadget Zone', address: 'GEC Circle, Chattogram', city: 'Chattogram' },
  { username: 'farhanasharmin', name: 'Farhana Sharmin', email: 'farhanasharmin@example.com', mobile: '01612345675', store: 'Sharmin Beauty & Care', address: 'Dhanmondi, Dhaka', city: 'Dhaka' },
  { username: 'saifulalam', name: 'Saiful Alam', email: 'saifulalam@example.com', mobile: '01512345676', store: 'Alam Footwear & Leather', address: 'Elephant Road, Dhaka', city: 'Dhaka' },
  { username: 'tanvirahmed', name: 'Tanvir Ahmed', email: 'tanvirahmed@example.com', mobile: '01312345677', store: 'Tanvir Laptop & Accessories', address: 'IDB Bhaban, Dhaka', city: 'Dhaka' },
  { username: 'mehedihasan', name: 'Mehedi Hasan', email: 'mehedihasan@example.com', mobile: '01812345678', store: 'Mehedi Sports & Fitness', address: 'Motijheel, Dhaka', city: 'Dhaka' },
  { username: 'nusratsultana', name: 'Nusrat Sultana', email: 'nusratsultana@example.com', mobile: '01712345679', store: 'Nusrat Home & Kitchen', address: 'Uttara, Dhaka', city: 'Dhaka' },
  { username: 'kamaluddin', name: 'Kamal Uddin', email: 'kamaluddin@example.com', mobile: '01612345680', store: 'Kamal Grocery & Organics', address: 'Dhanmondi, Dhaka', city: 'Dhaka' },
  { username: 'shafiqulreza', name: 'Shafiqul Reza', email: 'shafiqulreza@example.com', mobile: '01912345681', store: 'Reza Automotive Care', address: 'Mirpur, Dhaka', city: 'Dhaka' },
  { username: 'afrozaakter', name: 'Afroza Akter', email: 'afrozaakter@example.com', mobile: '01512345682', store: 'Afroza Kids & Toys World', address: 'Chawkbazar, Chattogram', city: 'Chattogram' },
  { username: 'ziaurrahman', name: 'Ziaur Rahman', email: 'ziaurrahman@example.com', mobile: '01712345683', store: 'Zia Books & Stationery', address: 'Nilkhet, Dhaka', city: 'Dhaka' },
  { username: 'shamimasharmin', name: 'Shamima Sharmin', email: 'shamimasharmin@example.com', mobile: '01812345684', store: 'Shamima Luxury Watches', address: 'Gulshan 1, Dhaka', city: 'Dhaka' },
  { username: 'delwarmiah', name: 'Delwar Miah', email: 'delwarmiah@example.com', mobile: '01912345685', store: 'Delwar Furniture Hub', address: 'Panthapath, Dhaka', city: 'Dhaka' }
];

// 30 Customers from the report
const customers = [
  { username: 'rafiqulhossain', name: 'Rafiqul Hossain', email: 'rafiqulhossain@example.com', mobile: '01512345678', address: 'Mirpur 10, Dhaka', city: 'Dhaka' },
  { username: 'shirinbegum', name: 'Shirin Begum', email: 'shirinbegum@example.com', mobile: '01798765432', address: 'Sector 7, Uttara, Dhaka', city: 'Dhaka' },
  { username: 'mizanurislam', name: 'Mizanur Islam', email: 'mizanurislam@example.com', mobile: '01634567891', address: 'Sonadanga, Khulna', city: 'Khulna' },
  { username: 'taniaakter', name: 'Tania Akter', email: 'taniaakter@example.com', mobile: '01856789012', address: 'Chawkbazar, Chattogram', city: 'Chattogram' },
  { username: 'arifurrahman', name: 'Arifur Rahman', email: 'arifurrahman@example.com', mobile: '01978901234', address: 'Shibganj, Sylhet', city: 'Sylhet' },
  { username: 'salmakhatun', name: 'Salma Khatun', email: 'salmakhatun@example.com', mobile: '01711223344', address: 'Rajpara, Rajshahi', city: 'Rajshahi' },
  { username: 'jahangiralom', name: 'Jahangir Alom', email: 'jahangiralom@example.com', mobile: '01822334455', address: 'Bandar, Narayanganj', city: 'Narayanganj' },
  { username: 'fahmidaakter', name: 'Fahmida Akter', email: 'fahmidaakter@example.com', mobile: '01933445566', address: 'Kandirpar, Cumilla', city: 'Cumilla' },
  { username: 'kawsarhabib', name: 'Kawsar Habib', email: 'kawsarhabib@example.com', mobile: '01644556677', address: 'Court Road, Bogura', city: 'Bogura' },
  { username: 'rubinayesmin', name: 'Rubina Yesmin', email: 'rubinayesmin@example.com', mobile: '01555667788', address: 'Sadur Mor, Rangpur', city: 'Rangpur' },
  { username: 'hasanmahmud', name: 'Hasan Mahmud', email: 'hasanmahmud@example.com', mobile: '01766778899', address: 'Town Hall, Mymensingh', city: 'Mymensingh' },
  { username: 'nasimakhondoker', name: 'Nasima Khondoker', email: 'nasimakhondoker@example.com', mobile: '01877889900', address: 'Natun Bazar, Barishal', city: 'Barishal' },
  { username: 'asrafulalam', name: 'Asraful Alam', email: 'asrafulalam@example.com', mobile: '01988990011', address: 'Boro Bazar, Jashore', city: 'Jashore' },
  { username: 'farukahmed', name: 'Faruk Ahmed', email: 'farukahmed@example.com', mobile: '01699001122', address: 'Sadar Road, Dinajpur', city: 'Dinajpur' },
  { username: 'marufhossain', name: 'Maruf Hossain', email: 'marufhossain@example.com', mobile: '01700112233', address: 'College Gate, Tangail', city: 'Tangail' },
  { username: 'sabrinasharmin', name: 'Sabrina Sharmin', email: 'sabrinasharmin@example.com', mobile: '01811223355', address: 'Station Road, Pabna', city: 'Pabna' },
  { username: 'lutforrahman', name: 'Lutfor Rahman', email: 'lutforrahman@example.com', mobile: '01922334466', address: 'Hospital Mor, Kushtia', city: 'Kushtia' },
  { username: 'samiasultana', name: 'Samia Sultana', email: 'samiasultana@example.com', mobile: '01533445577', address: 'Main Road, Gazipur', city: 'Gazipur' },
  { username: 'rezwanulkarim', name: 'Rezwanul Karim', email: 'rezwanulkarim@example.com', mobile: '01744556688', address: 'Court Point, Coxs Bazar', city: 'Coxs Bazar' },
  { username: 'nazneenferdaus', name: 'Nazneen Ferdaus', email: 'nazneenferdaus@example.com', mobile: '01855667799', address: 'Sadar Hospital Road, Feni', city: 'Feni' },
  { username: 'habiburrahman', name: 'Habibur Rahman', email: 'habiburrahman@example.com', mobile: '01966778800', address: 'Purana Paltan, Dhaka', city: 'Dhaka' },
  { username: 'rokeyabegum', name: 'Rokeya Begum', email: 'rokeyabegum@example.com', mobile: '01677889911', address: 'Gopalgonj Sadar', city: 'Gopalgonj' },
  { username: 'imranhossain', name: 'Imran Hossain', email: 'imranhossain@example.com', mobile: '01788990022', address: 'Chawkbazar, Barishal', city: 'Barishal' },
  { username: 'naziaparveen', name: 'Nazia Parveen', email: 'naziaparveen@example.com', mobile: '01899001133', address: 'Shyamoli, Dhaka', city: 'Dhaka' },
  { username: 'anwarhossain', name: 'Anwar Hossain', email: 'anwarhossain@example.com', mobile: '01900112244', address: 'Halishahar, Chattogram', city: 'Chattogram' },
  { username: 'khadijatulhabiba', name: 'Khadijatul Habiba', email: 'khadijatulhabiba@example.com', mobile: '01511223366', address: 'Amborkhana, Sylhet', city: 'Sylhet' },
  { username: 'moniruzzaman', name: 'Moniruzzaman', email: 'moniruzzaman@example.com', mobile: '01722334477', address: 'Zero Point, Rajshahi', city: 'Rajshahi' },
  { username: 'bilkispanna', name: 'Bilkis Panna', email: 'bilkispanna@example.com', mobile: '01833445588', address: 'Khan Jahan Ali Road, Khulna', city: 'Khulna' },
  { username: 'sajjadhossain', name: 'Sajjad Hossain', email: 'sajjadhossain@example.com', mobile: '01944556699', address: 'Badarganj Road, Rangpur', city: 'Rangpur' },
  { username: 'polychowdhury', name: 'Poly Chowdhury', email: 'polychowdhury@example.com', mobile: '01823456789', address: 'Boalia, Rajshahi', city: 'Rajshahi' }
];

// 20 Categories from the report
const categories = [
  { name: 'Mobile Phones', slug: 'mobile-phones', icon: 'smartphone', desc: 'Smartphones and feature phones from all major brands' },
  { name: 'Laptops & Computers', slug: 'laptops-computers', icon: 'laptop', desc: 'Laptops, desktops, and computer peripherals' },
  { name: "Men's Fashion", slug: 'mens-fashion', icon: 'shirt', desc: 'Clothing and accessories for men' },
  { name: "Women's Fashion", slug: 'womens-fashion', icon: 'sparkles', desc: 'Clothing and accessories for women' },
  { name: "Kids' Fashion", slug: 'kids-fashion', icon: 'smile', desc: 'Clothing and footwear for children' },
  { name: 'Home Appliances', slug: 'home-appliances', icon: 'tv', desc: 'Appliances for everyday home use' },
  { name: 'Kitchen & Dining', slug: 'kitchen-dining', icon: 'utensils', desc: 'Cookware, dinnerware, and kitchen tools' },
  { name: 'Furniture', slug: 'furniture', icon: 'sofa', desc: 'Home and office furniture' },
  { name: 'Groceries', slug: 'groceries', icon: 'shopping-basket', desc: 'Daily grocery and food essentials' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', icon: 'heart', desc: 'Skincare, haircare, and personal hygiene products' },
  { name: 'Health & Wellness', slug: 'health-wellness', icon: 'activity', desc: 'Health monitoring and wellness products' },
  { name: 'Sports & Outdoor', slug: 'sports-outdoor', icon: 'trophy', desc: 'Sports gear and outdoor equipment' },
  { name: 'Books & Stationery', slug: 'books-stationery', icon: 'book', desc: 'Books, notebooks, and office stationery' },
  { name: 'Toys & Games', slug: 'toys-games', icon: 'gamepad-2', desc: 'Toys and games for children' },
  { name: 'Automotive Accessories', slug: 'automotive-accessories', icon: 'car', desc: 'Accessories and gadgets for vehicles' },
  { name: 'Mobile Accessories', slug: 'mobile-accessories', icon: 'headphones', desc: 'Chargers, cases, and other phone accessories' },
  { name: 'Footwear', slug: 'footwear', icon: 'footprints', desc: 'Shoes and sandals for all ages' },
  { name: 'Bags & Luggage', slug: 'bags-luggage', icon: 'briefcase', desc: 'Bags, backpacks, and travel luggage' },
  { name: 'Watches & Jewelry', slug: 'watches-jewelry', icon: 'watch', desc: 'Watches and fashion jewelry' },
  { name: 'Electronics Accessories', slug: 'electronics-accessories', icon: 'plug', desc: 'Cables, adapters, and small electronics' }
];

// 50 Products from the report and catalog
const rawProducts = [
  { ownerIdx: 0, catIdx: 0, title: 'Smartphone X10', price: 12450.00, origPrice: 13999.00, stock: 84, brand: 'Xiaomi', sku: 'X10-MOB-01', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97' },
  { ownerIdx: 1, catIdx: 1, title: 'Ultrabook 14 inch', price: 9875.50, origPrice: 11200.00, stock: 46, brand: 'Asus', sku: 'ULTRA-14-02', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853' },
  { ownerIdx: 2, catIdx: 2, title: 'Cotton Panjabi', price: 1450.00, origPrice: 1800.00, stock: 120, brand: 'Aarong', sku: 'PANJ-COT-03', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf' },
  { ownerIdx: 3, catIdx: 3, title: 'Silk Saree Elegance', price: 4200.00, origPrice: 5500.00, stock: 35, brand: 'Monipuri', sku: 'SAR-SLK-04', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c' },
  { ownerIdx: 4, catIdx: 4, title: 'Kids Denim Dungaree', price: 1250.00, origPrice: 1500.00, stock: 60, brand: 'Yellow Kids', sku: 'KID-DEN-05', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea' },
  { ownerIdx: 5, catIdx: 5, title: 'Inverter Air Conditioner 1.5 Ton', price: 54000.00, origPrice: 58000.00, stock: 15, brand: 'Gree', sku: 'AC-15T-06', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e' },
  { ownerIdx: 6, catIdx: 6, title: 'Non-Stick Cookware Set 7 Pcs', price: 3800.00, origPrice: 4500.00, stock: 40, brand: 'Kiam', sku: 'CW-7PC-07', img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7' },
  { ownerIdx: 7, catIdx: 7, title: 'Ergonomic Mesh Office Chair', price: 6500.00, origPrice: 7800.00, stock: 25, brand: 'Otobi', sku: 'CHR-OFF-08', img: 'https://images.unsplash.com/photo-1580481077194-43666f2095f9' },
  { ownerIdx: 8, catIdx: 8, title: 'Premium Basmati Rice 5kg', price: 680.00, origPrice: 750.00, stock: 200, brand: 'Pran', sku: 'GRO-BAS-09', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c' },
  { ownerIdx: 9, catIdx: 9, title: 'Vitamin C Brightening Serum 30ml', price: 1150.00, origPrice: 1400.00, stock: 90, brand: 'The Ordinary', sku: 'SKN-SER-10', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be' },
  { ownerIdx: 10, catIdx: 10, title: 'Digital Blood Pressure Monitor', price: 2100.00, origPrice: 2600.00, stock: 50, brand: 'Omron', sku: 'HLT-BPM-11', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae' },
  { ownerIdx: 11, catIdx: 11, title: 'Carbon Fiber Badminton Racket', price: 3200.00, origPrice: 3900.00, stock: 45, brand: 'Yonex', sku: 'SPT-BAD-12', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea' },
  { ownerIdx: 12, catIdx: 12, title: 'Classic Fountain Pen & Notebook Set', price: 950.00, origPrice: 1200.00, stock: 110, brand: 'Parker', sku: 'STA-PEN-13', img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd' },
  { ownerIdx: 13, catIdx: 13, title: 'Magnetic Educational Building Blocks', price: 1750.00, origPrice: 2200.00, stock: 75, brand: 'Lego', sku: 'TOY-MAG-14', img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b' },
  { ownerIdx: 14, catIdx: 14, title: 'Multi-Function Car Tire Inflator', price: 2450.00, origPrice: 2900.00, stock: 55, brand: 'Baseus', sku: 'CAR-INF-15', img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738' },
  { ownerIdx: 0, catIdx: 15, title: 'Fast Charging 65W GaN Charger', price: 1850.00, origPrice: 2200.00, stock: 130, brand: 'Anker', sku: 'ACC-GAN-16', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0' },
  { ownerIdx: 1, catIdx: 16, title: 'Men Genuine Leather Loafers', price: 3450.00, origPrice: 4200.00, stock: 65, brand: 'Apex', sku: 'SH-LOA-17', img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509' },
  { ownerIdx: 2, catIdx: 17, title: 'Water-Resistant Travel Backpack 35L', price: 2650.00, origPrice: 3200.00, stock: 80, brand: 'Wildcraft', sku: 'BAG-TRV-18', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62' },
  { ownerIdx: 3, catIdx: 18, title: 'Stainless Steel Chronograph Watch', price: 5800.00, origPrice: 7200.00, stock: 30, brand: 'Casio Edifice', sku: 'WTC-EDF-19', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d' },
  { ownerIdx: 4, catIdx: 19, title: 'Extension Socket 4-Way with Surge Protection', price: 650.00, origPrice: 850.00, stock: 200, brand: 'Havells', sku: 'ELC-EXT-20', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' },
  // 21-35
  { ownerIdx: 5, catIdx: 0, title: 'Samsung Galaxy A55 5G', price: 42500.00, origPrice: 45000.00, stock: 28, brand: 'Samsung', sku: 'SAM-A55-21', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf' },
  { ownerIdx: 6, catIdx: 1, title: 'MacBook Air M2 13.6-inch', price: 118000.00, origPrice: 125000.00, stock: 12, brand: 'Apple', sku: 'APL-MBA-22', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
  { ownerIdx: 7, catIdx: 2, title: 'Slim Fit Casual Denim Shirt', price: 1650.00, origPrice: 2100.00, stock: 70, brand: 'Cats Eye', sku: 'CAT-SHT-23', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c' },
  { ownerIdx: 8, catIdx: 3, title: 'Embroidered Lawn Three Piece', price: 3800.00, origPrice: 4600.00, stock: 45, brand: 'Kay Kraft', sku: 'KAY-3PC-24', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b' },
  { ownerIdx: 9, catIdx: 4, title: 'Baby Soft Cotton Romper 3-Pack', price: 990.00, origPrice: 1300.00, stock: 85, brand: 'Mothercare', sku: 'KID-ROM-25', img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8' },
  { ownerIdx: 10, catIdx: 5, title: 'Smart Microwave Oven 28L', price: 18500.00, origPrice: 21000.00, stock: 20, brand: 'Walton', sku: 'WAL-MW-26', img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078' },
  { ownerIdx: 11, catIdx: 6, title: 'Electric Rice Cooker 2.8L', price: 2950.00, origPrice: 3600.00, stock: 60, brand: 'Miyako', sku: 'MIY-RC-27', img: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b' },
  { ownerIdx: 12, catIdx: 7, title: 'Wooden 6-Seater Dining Table', price: 32000.00, origPrice: 38000.00, stock: 8, brand: 'Hatil', sku: 'HAT-DIN-28', img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200' },
  { ownerIdx: 13, catIdx: 8, title: 'Pure Mustard Oil 2 Liters', price: 440.00, origPrice: 490.00, stock: 150, brand: 'Radhuni', sku: 'RAD-OIL-29', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5' },
  { ownerIdx: 14, catIdx: 9, title: 'Gentle Facial Cleanser 150ml', price: 850.00, origPrice: 1050.00, stock: 110, brand: 'Cetaphil', sku: 'CET-CLN-30', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03' },
  { ownerIdx: 0, catIdx: 10, title: 'Electric Heating Heating Pad', price: 1450.00, origPrice: 1800.00, stock: 70, brand: 'Beurer', sku: 'BEU-HTP-31', img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843' },
  { ownerIdx: 1, catIdx: 11, title: 'Professional Gym Dumbbell Set 20kg', price: 4800.00, origPrice: 5900.00, stock: 35, brand: 'Cosco', sku: 'SPT-DMB-32', img: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a' },
  { ownerIdx: 2, catIdx: 12, title: 'Wireless Laser Barcode Scanner', price: 2350.00, origPrice: 2900.00, stock: 45, brand: 'Netum', sku: 'STA-SCN-33', img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147' },
  { ownerIdx: 3, catIdx: 13, title: 'Remote Control RC Stunt Car', price: 1650.00, origPrice: 2100.00, stock: 50, brand: 'Syma', sku: 'TOY-RC-34', img: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f' },
  { ownerIdx: 4, catIdx: 14, title: 'High Pressure Car Washer Machine', price: 6800.00, origPrice: 8200.00, stock: 18, brand: 'Bosch', sku: 'BOS-WSH-35', img: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f' },
  // 36-50
  { ownerIdx: 5, catIdx: 15, title: 'True Wireless Bluetooth Earbuds', price: 2150.00, origPrice: 2700.00, stock: 120, brand: 'Realme Buds', sku: 'RLM-TWS-36', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df' },
  { ownerIdx: 6, catIdx: 16, title: 'Women Comfortable Block Heels', price: 2250.00, origPrice: 2800.00, stock: 55, brand: 'Bata', sku: 'BAT-HEL-37', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2' },
  { ownerIdx: 7, catIdx: 17, title: 'Hard Shell Luggage Trolley 24 inch', price: 4950.00, origPrice: 6200.00, stock: 24, brand: 'President', sku: 'PRS-TRL-38', img: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87' },
  { ownerIdx: 8, catIdx: 18, title: 'Smart Fitness Tracker Smartwatch', price: 2850.00, origPrice: 3500.00, stock: 90, brand: 'Amazfit', sku: 'AMZ-FIT-39', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1' },
  { ownerIdx: 9, catIdx: 19, title: 'HDMI to VGA Converter Adapter', price: 450.00, origPrice: 600.00, stock: 180, brand: 'Ugreen', sku: 'UGR-H2V-40', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' },
  { ownerIdx: 10, catIdx: 0, title: 'Google Pixel 8a 128GB', price: 56000.00, origPrice: 60000.00, stock: 14, brand: 'Google', sku: 'GGL-PX8-41', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
  { ownerIdx: 11, catIdx: 1, title: 'Mechanical Gaming Keyboard RGB', price: 3400.00, origPrice: 4200.00, stock: 40, brand: 'Redragon', sku: 'RDR-KBD-42', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3' },
  { ownerIdx: 12, catIdx: 2, title: 'Men Formal Oxford Shoes', price: 4100.00, origPrice: 5000.00, stock: 35, brand: 'Bay Emporium', sku: 'BAY-OXF-43', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4' },
  { ownerIdx: 13, catIdx: 3, title: 'Designer Handcrafted Kurti', price: 1850.00, origPrice: 2400.00, stock: 65, brand: 'Sailor', sku: 'SLR-KRT-44', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb' },
  { ownerIdx: 14, catIdx: 4, title: 'Kids LED Sports Sneaker Shoes', price: 1450.00, origPrice: 1900.00, stock: 50, brand: 'Lotto Kids', sku: 'LOT-LED-45', img: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782' },
  { ownerIdx: 0, catIdx: 5, title: 'Stand Fan with Remote Control 16 inch', price: 4600.00, origPrice: 5400.00, stock: 30, brand: 'Vision', sku: 'VIS-FAN-46', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d' },
  { ownerIdx: 1, catIdx: 6, title: 'Multi-Blade Kitchen Food Processor', price: 5200.00, origPrice: 6300.00, stock: 22, brand: 'Philips', sku: 'PHL-FP-47', img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078' },
  { ownerIdx: 2, catIdx: 7, title: 'Foldable Computer Study Desk', price: 4200.00, origPrice: 5200.00, stock: 25, brand: 'Regal', sku: 'REG-DSK-48', img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd' },
  { ownerIdx: 3, catIdx: 8, title: 'Organic Green Tea 100 Bags', price: 380.00, origPrice: 450.00, stock: 160, brand: 'Kazi & Kazi', sku: 'KZI-TEA-49', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3' },
  { ownerIdx: 4, catIdx: 19, title: 'Fast USB-C to USB-C Braided Cable 2M', price: 420.00, origPrice: 550.00, stock: 220, brand: 'Baseus', sku: 'BAS-USBC-50', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0' }
];

function generateSQL() {
  let sql = `-- ====================================================================
-- SELLORA Multi-Vendor E-Commerce Platform Database Baseline
-- Compatible with XAMPP MySQL & Neon Coders MultiVendor Report
-- Generated: 2026-09-07
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS \`sellora_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`sellora_db\`;

-- --------------------------------------------------------------------
-- 1. Table Definitions
-- --------------------------------------------------------------------

DROP TABLE IF EXISTS \`activity_logs\`;
DROP TABLE IF EXISTS \`coupons\`;
DROP TABLE IF EXISTS \`vendor_withdrawals\`;
DROP TABLE IF EXISTS \`revenue\`;
DROP TABLE IF EXISTS \`payments\`;
DROP TABLE IF EXISTS \`order_status_history\`;
DROP TABLE IF EXISTS \`order_items\`;
DROP TABLE IF EXISTS \`orders\`;
DROP TABLE IF EXISTS \`cart_items\`;
DROP TABLE IF EXISTS \`cart\`;
DROP TABLE IF EXISTS \`product_questions\`;
DROP TABLE IF EXISTS \`product_variants\`;
DROP TABLE IF EXISTS \`product_images\`;
DROP TABLE IF EXISTS \`products\`;
DROP TABLE IF EXISTS \`categories\`;
DROP TABLE IF EXISTS \`user_addresses\`;
DROP TABLE IF EXISTS \`vendors\`;
DROP TABLE IF EXISTS \`users\`;
DROP TABLE IF EXISTS \`site_settings\`;

-- Users Table
CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`username\` VARCHAR(50) DEFAULT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) DEFAULT '',
  \`mobile\` VARCHAR(20) DEFAULT '',
  \`role\` ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'ORDER_MANAGER') NOT NULL DEFAULT 'CUSTOMER',
  \`address\` VARCHAR(255) DEFAULT '',
  \`avatar_url\` VARCHAR(500) DEFAULT NULL,
  \`is_email_verified\` TINYINT(1) DEFAULT 1,
  \`vendor_id\` VARCHAR(100) DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_users_email\` (\`email\`),
  INDEX \`idx_users_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Addresses Table
CREATE TABLE \`user_addresses\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`full_name\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`street\` VARCHAR(500) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`area\` VARCHAR(100) NOT NULL,
  \`postal_code\` VARCHAR(20) DEFAULT NULL,
  \`is_default\` TINYINT(1) DEFAULT 0,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_addresses_user\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendors Table
CREATE TABLE \`vendors\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`owner_id\` INT NOT NULL UNIQUE,
  \`store_name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`logo_url\` VARCHAR(500) DEFAULT NULL,
  \`banner_url\` VARCHAR(500) DEFAULT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`phone\` VARCHAR(50) DEFAULT '',
  \`email\` VARCHAR(255) NOT NULL,
  \`status\` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'APPROVED',
  \`commission_rate\` DECIMAL(5,2) DEFAULT 5.00,
  \`balance\` DECIMAL(12,2) DEFAULT 0.00,
  \`street\` VARCHAR(255) DEFAULT '',
  \`city\` VARCHAR(100) DEFAULT 'Dhaka',
  \`area\` VARCHAR(100) DEFAULT 'Central',
  \`rating\` DECIMAL(3,2) DEFAULT 5.00,
  \`review_count\` INT DEFAULT 0,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_vendors_slug\` (\`slug\`),
  INDEX \`idx_vendors_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table
CREATE TABLE \`categories\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`parent_id\` INT DEFAULT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`icon\` VARCHAR(255) DEFAULT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`status\` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL,
  INDEX \`idx_categories_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE \`products\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`vendor_id\` INT NOT NULL,
  \`category_id\` INT DEFAULT NULL,
  \`category\` VARCHAR(255) NOT NULL,
  \`brand\` VARCHAR(255) NOT NULL DEFAULT 'Generic',
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(100) NOT NULL UNIQUE,
  \`description\` TEXT NOT NULL,
  \`price\` DECIMAL(12,2) NOT NULL,
  \`original_price\` DECIMAL(12,2) DEFAULT NULL,
  \`discount_percentage\` DECIMAL(5,2) DEFAULT 0.00,
  \`stock\` INT NOT NULL DEFAULT 0,
  \`image_url\` VARCHAR(500) NOT NULL,
  \`video_url\` VARCHAR(500) DEFAULT NULL,
  \`specifications_json\` JSON DEFAULT NULL,
  \`in_the_box\` TEXT DEFAULT NULL,
  \`warranty\` VARCHAR(255) DEFAULT NULL,
  \`features_json\` JSON DEFAULT NULL,
  \`rating\` DECIMAL(3,2) DEFAULT 4.80,
  \`review_count\` INT DEFAULT 12,
  \`is_published\` TINYINT(1) DEFAULT 1,
  \`is_approved\` TINYINT(1) DEFAULT 1,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL,
  INDEX \`idx_products_vendor\` (\`vendor_id\`),
  INDEX \`idx_products_category\` (\`category\`),
  INDEX \`idx_products_sku\` (\`sku\`),
  INDEX \`idx_products_published\` (\`is_published\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Images Table
CREATE TABLE \`product_images\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT NOT NULL,
  \`image_url\` VARCHAR(500) NOT NULL,
  \`is_primary\` TINYINT(1) DEFAULT 0,
  \`sort_order\` INT DEFAULT 0,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_images_product\` (\`product_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Variants Table
CREATE TABLE \`product_variants\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`sku\` VARCHAR(100) NOT NULL UNIQUE,
  \`price_delta\` DECIMAL(12,2) DEFAULT 0.00,
  \`stock\` INT NOT NULL DEFAULT 0,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_variants_product\` (\`product_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Questions Table
CREATE TABLE \`product_questions\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT NOT NULL,
  \`user_name\` VARCHAR(255) NOT NULL,
  \`question\` TEXT NOT NULL,
  \`answer\` TEXT DEFAULT NULL,
  \`answered_by\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_questions_product\` (\`product_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shopping Cart Table (Report Specification)
CREATE TABLE \`cart\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`customer_id\` INT NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_cart_customer\` (\`customer_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Items Table (Report Specification)
CREATE TABLE \`cart_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`cart_id\` INT NOT NULL,
  \`product_id\` INT NOT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`cart_id\`) REFERENCES \`cart\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_cart_items_cart\` (\`cart_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE \`orders\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_number\` VARCHAR(100) NOT NULL UNIQUE,
  \`customer_id\` INT NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`customer_email\` VARCHAR(255) NOT NULL,
  \`customer_phone\` VARCHAR(50) NOT NULL,
  \`subtotal\` DECIMAL(12,2) NOT NULL,
  \`shipping_fee\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`discount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`total_amount\` DECIMAL(12,2) NOT NULL,
  \`payment_method\` VARCHAR(50) NOT NULL DEFAULT 'CASH_ON_DELIVERY',
  \`payment_status\` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  \`order_status\` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  \`shipping_address_json\` JSON NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_orders_customer\` (\`customer_id\`),
  INDEX \`idx_orders_number\` (\`order_number\`),
  INDEX \`idx_orders_status\` (\`order_status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE \`order_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT NOT NULL,
  \`product_id\` INT NOT NULL,
  \`vendor_id\` INT NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`image_url\` VARCHAR(500) NOT NULL,
  \`price\` DECIMAL(12,2) NOT NULL,
  \`quantity\` INT NOT NULL,
  \`subtotal\` DECIMAL(12,2) NOT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_order_items_order\` (\`order_id\`),
  INDEX \`idx_order_items_vendor\` (\`vendor_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Status History Table
CREATE TABLE \`order_status_history\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT NOT NULL,
  \`status\` VARCHAR(50) NOT NULL,
  \`note\` VARCHAR(500) DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_history_order\` (\`order_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table (Report Extension)
CREATE TABLE \`payments\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT NOT NULL,
  \`amount\` DECIMAL(12,2) NOT NULL,
  \`payment_method\` ENUM('CASH', 'BKASH', 'NAGAD', 'CARD', 'CASH_ON_DELIVERY') DEFAULT 'CASH',
  \`payment_status\` ENUM('PENDING', 'PAID', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  \`transaction_id\` VARCHAR(255) DEFAULT NULL,
  \`payment_date\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_payments_order\` (\`order_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Revenue Table (Report Extension)
CREATE TABLE \`revenue\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`owner_id\` INT NOT NULL UNIQUE,
  \`total_revenue\` DECIMAL(12,2) DEFAULT 0.00,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Withdrawals Table
CREATE TABLE \`vendor_withdrawals\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`vendor_id\` INT NOT NULL,
  \`amount\` DECIMAL(12,2) NOT NULL,
  \`payment_method\` VARCHAR(50) NOT NULL,
  \`account_details\` VARCHAR(255) NOT NULL,
  \`status\` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
  \`transaction_ref\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_withdrawals_vendor\` (\`vendor_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupons Table
CREATE TABLE \`coupons\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(100) NOT NULL UNIQUE,
  \`discount_type\` ENUM('PERCENTAGE', 'FIXED') NOT NULL DEFAULT 'PERCENTAGE',
  \`discount_value\` DECIMAL(12,2) NOT NULL,
  \`min_spend\` DECIMAL(12,2) DEFAULT 0.00,
  \`max_discount\` DECIMAL(12,2) DEFAULT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`valid_till\` DATETIME DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_coupons_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings Table
CREATE TABLE \`site_settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`site_name\` VARCHAR(255) DEFAULT 'SELLORA Bangladesh',
  \`site_logo\` VARCHAR(500) DEFAULT NULL,
  \`support_phone\` VARCHAR(50) DEFAULT '+880 9612-345678',
  \`support_email\` VARCHAR(255) DEFAULT 'support@sellora.com',
  \`announcement_text\` TEXT DEFAULT NULL,
  \`default_commission_rate\` DECIMAL(5,2) DEFAULT 5.00,
  \`banners_json\` JSON DEFAULT NULL,
  \`hero_config_json\` JSON DEFAULT NULL,
  \`brand_week_config_json\` JSON DEFAULT NULL,
  \`categories_config_json\` JSON DEFAULT NULL,
  \`brands_config_json\` JSON DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Logs Table
CREATE TABLE \`activity_logs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT DEFAULT NULL,
  \`user_name\` VARCHAR(255) DEFAULT 'System',
  \`action\` VARCHAR(100) NOT NULL,
  \`module\` VARCHAR(100) NOT NULL,
  \`target_id\` VARCHAR(100) DEFAULT NULL,
  \`details_json\` JSON DEFAULT NULL,
  \`ip_address\` VARCHAR(50) DEFAULT NULL,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_activity_action\` (\`action\`),
  INDEX \`idx_activity_module\` (\`module\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Stored Procedures (As Required by Neon Coders Project Report)
-- --------------------------------------------------------------------

DROP PROCEDURE IF EXISTS \`RegisterUser\`;
DROP PROCEDURE IF EXISTS \`SearchProducts\`;
DROP PROCEDURE IF EXISTS \`Checkout\`;
DROP PROCEDURE IF EXISTS \`AddProduct\`;
DROP PROCEDURE IF EXISTS \`ViewOrdersByOwner\`;

DELIMITER $$

-- Procedure 1: RegisterUser
CREATE PROCEDURE \`RegisterUser\`(
  IN p_username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_role VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
  INSERT INTO \`users\` (\`name\`, \`username\`, \`email\`, \`password_hash\`, \`role\`)
  VALUES (p_username, p_username, p_email, p_password, p_role);
END$$

-- Procedure 2: SearchProducts
CREATE PROCEDURE \`SearchProducts\`(IN p_keyword VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci)
BEGIN
  SELECT p.id AS product_id, p.title AS product_name, p.description, p.price,
         p.stock AS stock_qty, c.name AS category_name, v.store_name AS store_owner
  FROM \`products\` p
  LEFT JOIN \`categories\` c ON p.category_id = c.id
  LEFT JOIN \`vendors\` v ON p.vendor_id = v.id
  WHERE p.title LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci
     OR c.name LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci
     OR p.category LIKE CONCAT('%', p_keyword, '%') COLLATE utf8mb4_unicode_ci;
END$$

-- Procedure 3: Checkout
CREATE PROCEDURE \`Checkout\`(IN p_customer_id INT, OUT p_order_id INT)
BEGIN
  DECLARE v_order_num VARCHAR(100);
  DECLARE v_subtotal DECIMAL(12,2) DEFAULT 0;
  DECLARE v_cust_name VARCHAR(255);
  DECLARE v_cust_email VARCHAR(255);
  DECLARE v_cust_phone VARCHAR(50);
  DECLARE v_cart_id INT;

  SELECT id INTO v_cart_id FROM \`cart\` WHERE customer_id = p_customer_id ORDER BY id DESC LIMIT 1;

  IF v_cart_id IS NOT NULL THEN
    SELECT name, email, phone INTO v_cust_name, v_cust_email, v_cust_phone FROM \`users\` WHERE id = p_customer_id;
    SET v_order_num = CONCAT('ORD-', UNIX_TIMESTAMP(), '-', FLOOR(100 + RAND() * 900));

    SELECT IFNULL(SUM(p.price * ci.quantity), 0) INTO v_subtotal
    FROM \`cart_items\` ci
    JOIN \`products\` p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    INSERT INTO \`orders\` (
      order_number, customer_id, customer_name, customer_email, customer_phone,
      subtotal, shipping_fee, discount, total_amount, payment_method, payment_status, order_status, shipping_address_json
    )
    VALUES (
      v_order_num, p_customer_id, IFNULL(v_cust_name, 'Customer'), IFNULL(v_cust_email, ''),
      IFNULL(v_cust_phone, ''), v_subtotal, 60.00, 0.00, v_subtotal + 60.00,
      'CASH_ON_DELIVERY', 'PENDING', 'PENDING', '{"address": "Customer Primary Address"}'
    );

    SET p_order_id = LAST_INSERT_ID();

    INSERT INTO \`order_items\` (order_id, product_id, vendor_id, title, image_url, price, quantity, subtotal)
    SELECT p_order_id, p.id, p.vendor_id, p.title, p.image_url, p.price, ci.quantity, (p.price * ci.quantity)
    FROM \`cart_items\` ci
    JOIN \`products\` p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    UPDATE \`products\` p
    JOIN \`cart_items\` ci ON p.id = ci.product_id
    SET p.stock = GREATEST(0, p.stock - ci.quantity)
    WHERE ci.cart_id = v_cart_id;

    DELETE FROM \`cart_items\` WHERE cart_id = v_cart_id;
  END IF;
END$$

-- Procedure 4: AddProduct
CREATE PROCEDURE \`AddProduct\`(
  IN p_owner_id INT,
  IN p_category_id INT,
  IN p_product_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_description VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_price DECIMAL(10,2),
  IN p_stock_qty INT
)
BEGIN
  DECLARE v_vendor_id INT;
  SELECT id INTO v_vendor_id FROM \`vendors\` WHERE owner_id = p_owner_id LIMIT 1;
  IF v_vendor_id IS NULL THEN
    INSERT INTO \`vendors\` (owner_id, store_name, slug, email)
    VALUES (p_owner_id, CONCAT('Store of Owner #', p_owner_id), CONCAT('store-', p_owner_id), 'vendor@sellora.com');
    SET v_vendor_id = LAST_INSERT_ID();
  END IF;

  INSERT INTO \`products\` (vendor_id, category_id, category, title, slug, sku, description, price, stock, image_url)
  VALUES (
    v_vendor_id, p_category_id, 'General', p_product_name,
    LOWER(REPLACE(p_product_name, ' ', '-')), CONCAT('SKU-', UNIX_TIMESTAMP(), '-', FLOOR(RAND()*1000)),
    p_description, p_price, p_stock_qty, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
  );
END$$

-- Procedure 5: ViewOrdersByOwner
CREATE PROCEDURE \`ViewOrdersByOwner\`(IN p_owner_id INT)
BEGIN
  SELECT o.id AS order_id, o.created_at AS order_date, o.customer_name,
         oi.title AS product_name, oi.quantity, oi.price, o.order_status AS status
  FROM \`order_items\` oi
  JOIN \`orders\` o ON oi.order_id = o.id
  JOIN \`vendors\` v ON oi.vendor_id = v.id
  WHERE v.owner_id = p_owner_id
  ORDER BY o.created_at DESC;
END$$

DELIMITER ;

-- --------------------------------------------------------------------
-- 3. Seed Data Insertion
-- --------------------------------------------------------------------

-- Insert Super Admin (ID: 1)
INSERT INTO \`users\` (\`id\`, \`name\`, \`username\`, \`email\`, \`password_hash\`, \`phone\`, \`role\`, \`address\`)
VALUES (1, 'SELLORA Super Admin', 'admin', 'admin@sellora.com', '${adminHash}', '+880 1700-000000', 'SUPER_ADMIN', 'Headquarters, Gulshan, Dhaka');
`;

  // Insert 15 Owners (IDs: 2 to 16)
  sql += `\n-- Insert 15 Store Owners (IDs: 2 to 16)\n`;
  owners.forEach((o, idx) => {
    const id = idx + 2;
    sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`username\`, \`email\`, \`password_hash\`, \`phone\`, \`mobile\`, \`role\`, \`address\`)
VALUES (${id}, '${o.name}', '${o.username}', '${o.email}', '${userHash}', '${o.mobile}', '${o.mobile}', 'SELLER', '${o.address}');\n`;
  });

  // Insert Vendors for 15 Owners
  sql += `\n-- Insert 15 Vendors corresponding to Owners\n`;
  owners.forEach((o, idx) => {
    const vendorId = idx + 1;
    const ownerId = idx + 2;
    const slug = o.store.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sql += `INSERT INTO \`vendors\` (\`id\`, \`owner_id\`, \`store_name\`, \`slug\`, \`email\`, \`phone\`, \`city\`, \`street\`, \`rating\`, \`status\`, \`balance\`)
VALUES (${vendorId}, ${ownerId}, '${o.store}', '${slug}', '${o.email}', '${o.mobile}', '${o.city}', '${o.address}', 4.9, 'APPROVED', 25400.00);\n`;
  });

  // Link vendor_id in users table for owners
  owners.forEach((_, idx) => {
    const vendorId = idx + 1;
    const ownerId = idx + 2;
    sql += `UPDATE \`users\` SET \`vendor_id\` = '${vendorId}' WHERE \`id\` = ${ownerId};\n`;
  });

  // Insert 30 Customers (IDs: 17 to 46)
  sql += `\n-- Insert 30 Customers (IDs: 17 to 46)\n`;
  customers.forEach((c, idx) => {
    const id = idx + 17;
    sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`username\`, \`email\`, \`password_hash\`, \`phone\`, \`mobile\`, \`role\`, \`address\`)
VALUES (${id}, '${c.name}', '${c.username}', '${c.email}', '${userHash}', '${c.mobile}', '${c.mobile}', 'CUSTOMER', '${c.address}');\n`;
  });

  // Insert User Addresses for Customers
  sql += `\n-- Insert Addresses for Customers\n`;
  customers.forEach((c, idx) => {
    const userId = idx + 17;
    sql += `INSERT INTO \`user_addresses\` (\`user_id\`, \`full_name\`, \`phone\`, \`street\`, \`city\`, \`area\`, \`is_default\`)
VALUES (${userId}, '${c.name}', '${c.mobile}', '${c.address}', '${c.city}', 'Central Area', 1);\n`;
  });

  const esc = (val: string) => (val ? String(val).replace(/'/g, "''") : '');

  // Insert 20 Categories
  sql += `\n-- Insert 20 Categories\n`;
  categories.forEach((cat, idx) => {
    const id = idx + 1;
    sql += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`icon\`, \`description\`, \`status\`)
VALUES (${id}, '${esc(cat.name)}', '${esc(cat.slug)}', '${esc(cat.icon)}', '${esc(cat.desc)}', 'ACTIVE');\n`;
  });

  // Insert 50 Products
  sql += `\n-- Insert 50 Products\n`;
  rawProducts.forEach((p, idx) => {
    const id = idx + 1;
    const vendorId = p.ownerIdx + 1;
    const catId = p.catIdx + 1;
    const catName = categories[p.catIdx].name;
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const desc = `${p.title} - high quality authentic product listed under ${catName}. Complete manufacturer warranty and tested durability.`;
    const discount = Math.round(((p.origPrice - p.price) / p.origPrice) * 100);
    const features = JSON.stringify(['100% Original Authentic Item', 'Official Brand Warranty Included', 'Fast 48-Hour Nationwide Delivery', '7 Days Easy Return Policy']).replace(/'/g, "''");

    sql += `INSERT INTO \`products\` (
  \`id\`, \`vendor_id\`, \`category_id\`, \`category\`, \`brand\`, \`title\`, \`slug\`, \`sku\`,
  \`description\`, \`price\`, \`original_price\`, \`discount_percentage\`, \`stock\`, \`image_url\`,
  \`features_json\`, \`rating\`, \`review_count\`, \`is_published\`, \`is_approved\`
)
VALUES (
  ${id}, ${vendorId}, ${catId}, '${esc(catName)}', '${esc(p.brand)}', '${esc(p.title)}', '${esc(slug)}', '${esc(p.sku)}',
  '${esc(desc)}', ${p.price}, ${p.origPrice}, ${discount}, ${p.stock}, '${esc(p.img)}',
  '${features}', 4.8, 18, 1, 1
);\n`;
  });

  // Insert 50 Sample Orders, Order Items, and Payments
  sql += `\n-- Insert 50 Orders, Order Items, and Payments\n`;
  for (let i = 1; i <= 50; i++) {
    const custIdx = (i - 1) % customers.length;
    const cust = customers[custIdx];
    const custId = custIdx + 17;
    const prod1Idx = (i - 1) % rawProducts.length;
    const prod1 = rawProducts[prod1Idx];
    const prod1Id = prod1Idx + 1;
    const vendor1Id = prod1.ownerIdx + 1;
    const qty = ((i % 3) + 1);
    const subtotal = prod1.price * qty;
    const shipping = 60.00;
    const total = subtotal + shipping;
    const orderNum = `ORD-${Date.now().toString().slice(0, 6)}-${1000 + i}`;
    const statuses = ['DELIVERED', 'SHIPPED', 'CONFIRMED', 'DELIVERED', 'PROCESSING', 'PENDING'];
    const orderStatus = statuses[i % statuses.length];
    const payMethods = ['BKASH', 'NAGAD', 'CASH', 'CARD'];
    const payMethod = payMethods[i % payMethods.length];
    const daysAgo = Math.floor(Math.random() * 45) + 1;
    const addrJson = JSON.stringify({ fullName: cust.name, phone: cust.mobile, street: cust.address, city: cust.city, area: 'Main Zone' });

    sql += `INSERT INTO \`orders\` (\`id\`, \`order_number\`, \`customer_id\`, \`customer_name\`, \`customer_email\`, \`customer_phone\`, \`subtotal\`, \`shipping_fee\`, \`discount\`, \`total_amount\`, \`payment_method\`, \`payment_status\`, \`order_status\`, \`shipping_address_json\`, \`created_at\`)
VALUES (${i}, '${orderNum}', ${custId}, '${cust.name}', '${cust.email}', '${cust.mobile}', ${subtotal}, ${shipping}, 0.00, ${total}, '${payMethod}', 'PAID', '${orderStatus}', '${addrJson}', NOW() - INTERVAL ${daysAgo} DAY);\n`;

    sql += `INSERT INTO \`order_items\` (\`order_id\`, \`product_id\`, \`vendor_id\`, \`title\`, \`image_url\`, \`price\`, \`quantity\`, \`subtotal\`)
VALUES (${i}, ${prod1Id}, ${vendor1Id}, '${prod1.title}', '${prod1.img}', ${prod1.price}, ${qty}, ${subtotal});\n`;

    sql += `INSERT INTO \`payments\` (\`order_id\`, \`amount\`, \`payment_method\`, \`payment_status\`, \`transaction_id\`, \`payment_date\`)
VALUES (${i}, ${total}, '${payMethod}', 'COMPLETED', 'TRX-${889000 + i}', NOW() - INTERVAL ${daysAgo} DAY);\n`;
  }

  // Calculate & Populate Initial Revenue for Owners
  sql += `\n-- Populate Initial Revenue for 15 Shop Owners\n`;
  sql += `INSERT INTO \`revenue\` (\`owner_id\`, \`total_revenue\`)
SELECT
  v.owner_id,
  SUM(oi.subtotal) AS total_revenue
FROM \`order_items\` oi
JOIN \`vendors\` v ON oi.vendor_id = v.id
JOIN \`orders\` o ON oi.order_id = o.id
JOIN \`payments\` pay ON pay.order_id = o.id
WHERE pay.payment_status IN ('COMPLETED', 'PAID')
GROUP BY v.owner_id
ON DUPLICATE KEY UPDATE total_revenue = VALUES(total_revenue);\n`;

  // Seed baseline site settings
  sql += `\n-- Seed Baseline Site Settings\n`;
  const heroJson = JSON.stringify({
    title: 'Discover Amazing Deals Across Bangladesh',
    subtitle: 'Over 50+ Verified Multi-Vendor Stores with 100% Genuine Guaranteed Products',
    badge: 'Mega Summer Sale 2026'
  });
  const bannersJson = JSON.stringify([
    { id: 1, title: 'Super Gadget Deals', discount: 'Up to 35% OFF', link: '/campaigns/electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
    { id: 2, title: 'Lifestyle & Fashion Week', discount: 'Flat 25% OFF', link: '/campaigns/fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050' }
  ]);

  sql += `INSERT INTO \`site_settings\` (\`id\`, \`site_name\`, \`support_phone\`, \`support_email\`, \`announcement_text\`, \`hero_config_json\`, \`banners_json\`)
VALUES (1, 'SELLORA Multi-Vendor Bangladesh', '+880 9612-345678', 'support@sellora.com', 'Welcome to SELLORA Multi-Vendor Marketplace - Enjoy Free Shipping on orders over BDT 5,000!', '${heroJson}', '${bannersJson}');\n`;

  sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n-- End of SELLORA Database Initialization Script\n`;

  return sql;
}

const targetPath = path.resolve(process.cwd(), '../sellora_multivendor_full.sql');
fs.writeFileSync(targetPath, generateSQL(), 'utf8');
console.log('Successfully generated complete SQL script at:', targetPath);
