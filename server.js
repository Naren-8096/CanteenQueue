require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
require('./src/config/passport');

// Debug: Check environment variables
console.log('DEBUG - MONGO_URI:', process.env.MONGO_URI?.substring(0, 30) + '...');
console.log('DEBUG - NODE_ENV:', process.env.NODE_ENV);

// Route imports
const authRoutes = require('./src/routes/auth');
const menuRoutes = require('./src/routes/menu');
const orderRoutes = require('./src/routes/order');
const queueRoutes = require('./src/routes/queue');
const availabilityRoutes = require('./src/routes/availability');
const paymentRoutes = require('./src/routes/payment');

const app = express();

// Trust reverse proxy for production deployments (Render, Railway, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware with persistent MongoDB store
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<')) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day
  });
}

app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/payment', paymentRoutes);

// Serve frontend for any non-API route
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🍽️  CanteenQueue Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
})();

module.exports = app;
