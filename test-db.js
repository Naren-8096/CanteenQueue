require('dotenv').config();
const mongoose = require('mongoose');

const testDB = async () => {
  try {
    console.log('🔍 Testing MongoDB Connection...\n');
    
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Database Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}\n`);

    // Get database info
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📦 Collections Found: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   • ${col.name}`);
    });

    // Test Models
    console.log('\n🧪 Testing Models...');
    const User = require('./src/models/User');
    const MenuItem = require('./src/models/MenuItem');
    const Order = require('./src/models/Order');
    const QueueRecord = require('./src/models/QueueRecord');

    const userCount = await User.countDocuments();
    const menuCount = await MenuItem.countDocuments();
    const orderCount = await Order.countDocuments();
    const queueCount = await QueueRecord.countDocuments();

    console.log(`   • Users: ${userCount}`);
    console.log(`   • Menu Items: ${menuCount}`);
    console.log(`   • Orders: ${orderCount}`);
    console.log(`   • Queue Records: ${queueCount}`);

    console.log('\n✨ Database is working perfectly!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Database Error: ${error.message}`);
    process.exit(1);
  }
};

testDB();
