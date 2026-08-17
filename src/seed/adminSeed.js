require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/canteenqueue';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@canteen.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Canteen Administrator';

    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      admin.name = adminName;
      admin.role = 'admin';
      admin.password = adminPassword;
      await admin.save();
      console.log(`👑 Updated existing Admin account: ${adminEmail}`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`👑 Created new Admin account: ${adminEmail}`);
    }

    console.log(`🔑 Credentials -> Email: ${adminEmail} | Password: ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Admin seed error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
