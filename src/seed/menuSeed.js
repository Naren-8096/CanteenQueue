require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const menuItems = [
  { item_name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 80, category: 'Lunch', availability: true, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', prep_time: 15 },
  { item_name: 'Veg Biryani', description: 'Fragrant rice with mixed vegetables', price: 60, category: 'Lunch', availability: true, image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', prep_time: 12 },
  { item_name: 'Masala Dosa', description: 'Crispy dosa with spiced potato filling', price: 40, category: 'Breakfast', availability: true, image_url: 'https://images.unsplash.com/photo-1630409351241-e90a5d1f1d7a?w=400', prep_time: 8 },
  { item_name: 'Idli Sambar', description: '3 soft idlis with sambar and chutneys', price: 30, category: 'Breakfast', availability: true, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', prep_time: 5 },
  { item_name: 'Poori Curry', description: 'Puffy pooris with spicy potato curry', price: 35, category: 'Breakfast', availability: true, image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', prep_time: 10 },
  { item_name: 'Rice & Rajma', description: 'Steamed rice with kidney bean curry', price: 55, category: 'Lunch', availability: true, image_url: 'https://images.unsplash.com/photo-1585540083814-ea6ee8af9e4f?w=400', prep_time: 5 },
  { item_name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato gravy', price: 70, category: 'Lunch', availability: true, image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', prep_time: 12 },
  { item_name: 'Samosa (2 pcs)', description: 'Crispy pastry with spiced potato stuffing', price: 20, category: 'Snacks', availability: true, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', prep_time: 3 },
  { item_name: 'Vada Pav', description: 'Mumbai street-style spicy potato burger', price: 15, category: 'Snacks', availability: true, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', prep_time: 5 },
  { item_name: 'Masala Chai', description: 'Spiced milk tea', price: 10, category: 'Beverages', availability: true, image_url: 'https://images.unsplash.com/photo-1571934811356-5cc98c0f716f?w=400', prep_time: 3 },
  { item_name: 'Cold Coffee', description: 'Chilled blended coffee with milk', price: 30, category: 'Beverages', availability: true, image_url: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=400', prep_time: 4 },
  { item_name: 'Fresh Lime Soda', description: 'Refreshing lime with soda and sugar', price: 20, category: 'Beverages', availability: true, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', prep_time: 2 },
  { item_name: 'Noodles', description: 'Stir-fried hakka noodles with vegetables', price: 45, category: 'Snacks', availability: true, image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', prep_time: 8 },
  { item_name: 'Chole Bhature', description: 'Spicy chickpea curry with fried bread', price: 50, category: 'Lunch', availability: true, image_url: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=400', prep_time: 10 },
  { item_name: 'Pasta Arrabiata', description: 'Penne pasta in spicy tomato sauce', price: 55, category: 'Snacks', availability: false, image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', prep_time: 10 },
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`🍽️  Seeded ${inserted.length} menu items successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedMenu();
