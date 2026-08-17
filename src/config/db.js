const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const isPlaceholder = !mongoUri || mongoUri.includes('<') || mongoUri.includes('>');

    if (isPlaceholder) {
      console.log('⚠️ No valid MongoDB URI found. Starting in-memory MongoDB for local development...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const conn = await mongoose.connect(mongoMemoryServer.getUri());
      console.log(`✅ MongoDB Connected (memory): ${conn.connection.host}`);
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  try {
    if (mongoMemoryServer) await mongoMemoryServer.stop();
    await mongoose.disconnect();
  } finally {
    process.exit(0);
  }
});

module.exports = connectDB;
