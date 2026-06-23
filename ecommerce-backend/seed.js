const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const connectDB = require('./db');

dotenv.config();
connectDB();

const products = [
  { name: 'Neon Cyber Keyboard', description: 'Premium mechanical keyboard with deep glassmorphic RGB.', price: 149.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212', stock: 50 },
  { name: 'Quantum Mouse', description: 'Ultra-lightweight gaming mouse with neon glow.', price: 89.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527814050087-379381547969', stock: 100 },
  { name: 'Aurora Monitors', description: 'Ultrawide 4K monitor perfect for dark mode setups.', price: 599.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', stock: 20 },
  { name: 'Holo Headset', description: 'Over-ear headphones with active noise cancellation.', price: 199.99, category: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', stock: 40 },
  { name: 'Stellar Smartwatch', description: 'OLED smartwatch with violet neon aesthetics.', price: 299.99, category: 'Wearables', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a', stock: 30 },
  { name: 'Plasma Gamepad', description: 'Wireless controller with translucent shell.', price: 69.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08', stock: 75 },
  { name: 'Void Speakers', description: 'Bluetooth speakers dropping heavy bass with blue LED rings.', price: 129.99, category: 'Audio', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', stock: 60 },
  { name: 'Nebula PC Case', description: 'Glassmorphic ATX case.', price: 159.99, category: 'PC Parts', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b', stock: 15 },
  { name: 'Ether Earbuds', description: 'In-ear true wireless earbuds.', price: 149.99, category: 'Audio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', stock: 120 },
  { name: 'Lumina Microphone', description: 'Studio condenser mic with RGB.', price: 109.99, category: 'Audio', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc', stock: 45 },
  { name: 'Nova Router', description: 'Wi-Fi 6E gaming router.', price: 249.99, category: 'Networking', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874', stock: 25 },
  { name: 'Eclipse Webcam', description: '1080p 60fps webcam for streaming.', price: 79.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63', stock: 80 },
  { name: 'Astro Desk Mat', description: 'XL RGB extended mousepad.', price: 39.99, category: 'Accessories', image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd', stock: 200 },
  { name: 'Zenith Chair', description: 'Ergonomic mesh office chair.', price: 349.99, category: 'Furniture', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267', stock: 10 },
  { name: 'Pulsar GPU', description: 'Next-gen graphics card.', price: 899.99, category: 'PC Parts', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704', stock: 5 },
  { name: 'Vortex Cooler', description: 'AIO Liquid cooler with LCD screen.', price: 199.99, category: 'PC Parts', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086', stock: 22 },
  { name: 'Ion Power Supply', description: '850W Gold Rated PSU.', price: 129.99, category: 'PC Parts', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7', stock: 35 },
  { name: 'Matrix SSD', description: '2TB NVMe PCIe 4.0 storage.', price: 179.99, category: 'PC Parts', image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec', stock: 90 },
  { name: 'Prism RAM', description: '32GB DDR5 memory kit.', price: 149.99, category: 'PC Parts', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186', stock: 55 },
  { name: 'Hyper Drone', description: '4K FPV Drone with neon accents.', price: 499.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1507582020474-9a35e7d74594', stock: 18 }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('20 Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

importData();
