# 🍽️ CanteenQueue

> **Digital College Canteen Ordering & Queue Management System**  
> A comprehensive platform where students can order food online, pay securely via Razorpay, receive a token with OTP, and track their queue position in real-time. Staff can verify OTPs, manage orders, update availability, and monitor the queue from a dedicated dashboard.

---

## ✨ Features

### For Students 👨‍🎓
- ✅ Browse menu with real-time availability
- ✅ Add items to cart with quantity control
- ✅ Secure payment via Razorpay (with test mode)
- ✅ Receive unique token number + OTP
- ✅ Track live queue position and food prep status
- ✅ View order history
- ✅ Password reset via email

### For Staff 👨‍💼
- ✅ Real-time order dashboard
- ✅ Verify customer OTP at counter
- ✅ Update order status (Preparing → Delivered)
- ✅ Manage menu items (add/edit/delete)
- ✅ Toggle item availability & stock levels
- ✅ View all active orders and queue

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB Atlas** account (free tier sufficient)
- **Razorpay** account (for test payments)
- **Nodemailer** (uses Ethereal for demo emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/CanteenQueue.git
cd CanteenQueue

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Configure .env with your credentials
# MongoDB URI
# JWT Secret
# Razorpay keys (get from Razorpay Dashboard)
# Staff Registration Key

# 4. Seed the database with 15 sample menu items
npm run seed

# 5. Start the server
npm start

# OR for development (with auto-reload via nodemon):
npm run dev
```

**Server will start on** `http://localhost:5000`

### Test Credentials (after seeding)

```
🎓 Student Account
Email: student@example.com
Password: password123

👨‍💼 Staff Account
Email: staff@example.com
Password: password123
Staff Key: admin-secret-2024
```

### Test Razorpay Card
```
Card Number: 4111 1111 1111 1111
Expiry: 12/28
CVV: 123
```

---

## 📁 Project Structure

```
CanteenQueue/
├── server.js                      # Express.js entry point
├── package.json                   # Dependencies & scripts
├── .env.example                   # Environment variables template
├── .gitignore
│
├── frontend/                      # Static frontend (SPA)
│   ├── index.html                 # Landing page
│   ├── login.html                 # Login form
│   ├── register.html              # Registration (student/staff)
│   ├── student-dashboard.html     # Menu browse + shopping cart
│   ├── checkout.html              # Razorpay payment interface
│   ├── order-confirmation.html    # Token, OTP, live tracker
│   ├── my-orders.html             # Order history
│   ├── staff-dashboard.html       # Order management + queue
│   ├── forgot-password.html       # Password recovery
│   ├── reset-password.html        # Password reset form
│   ├── css/
│   │   └── style.css              # Global design system (variables + components)
│   └── js/
│       ├── api.js                 # Fetch wrapper + notification helpers
│       └── auth.js                # JWT storage + role-based navigation
│
└── src/                           # Backend (Node.js)
    ├── config/
    │   ├── db.js                  # MongoDB connection
    │   └── passport.js            # Passport authentication config
    ├── models/
    │   ├── User.js                # Student & Staff schema
    │   ├── MenuItem.js            # Menu items with stock/availability
    │   ├── Order.js               # Order schema with OTP & token
    │   └── QueueRecord.js         # Queue position tracking
    ├── controllers/
    │   ├── authController.js      # Register, login, password reset
    │   ├── menuController.js      # Menu CRUD operations
    │   ├── orderController.js     # Create order, verify OTP
    │   ├── queueController.js     # Queue position calculations
    │   ├── paymentController.js   # Razorpay integration
    │   └── availabilityController.js  # Availability & stock updates
    ├── routes/
    │   ├── auth.js                # /api/auth/*
    │   ├── menu.js                # /api/menu/*
    │   ├── order.js               # /api/order/*
    │   ├── queue.js               # /api/queue/*
    │   ├── payment.js             # /api/payment/*
    │   └── availability.js        # /api/availability/*
    ├── middleware/
    │   ├── auth.js                # JWT verification + role checks
    │   └── errorHandler.js        # Global error handler
    ├── utils/
    │   └── sendEmail.js           # Nodemailer email service
    └── seed/
        └── menuSeed.js            # Populate 15 sample menu items
```

---

## 🔌 API Endpoints

### Authentication
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register (student/staff) |
| POST | `/api/auth/login` | — | Login → JWT token |
| GET | `/api/auth/me` | JWT | Get current user profile |
| PUT | `/api/auth/me` | JWT | Update profile |
| POST | `/api/auth/forgotpassword` | — | Request password reset |
| PUT | `/api/auth/resetpassword/:token` | — | Reset password with token |

### Menu Management
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/menu` | — | Get all menu items |
| POST | `/api/menu` | Staff | Create menu item |
| PUT | `/api/menu/:id` | Staff | Update menu item |
| DELETE | `/api/menu/:id` | Staff | Delete menu item |
| PUT | `/api/availability/update` | Staff | Update availability & stock |

### Orders
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/order/create` | Student | Place new order |
| GET | `/api/order/my-orders` | Student | Get my orders |
| GET | `/api/order/all` | Staff | Get all active orders |
| GET | `/api/order/completed` | Staff | Get completed orders |
| GET | `/api/order/status/:id` | JWT | Get order status |
| POST | `/api/order/verify-otp` | Staff | Verify customer OTP |
| PUT | `/api/order/status/:id` | Staff | Update order status |
| PUT | `/api/order/batch-status` | Staff | Bulk update multiple orders |

### Queue Management
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/queue` | Staff | Get live FIFO queue |
| GET | `/api/queue/position/:orderId` | JWT | Get queue position |
| GET | `/api/queue/item-positions/:orderId` | JWT | Get item prep times |

### Payment (Razorpay)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/payment/create-order` | JWT | Create Razorpay order |
| POST | `/api/payment/verify` | JWT | Verify payment signature |

---

## 🔄 Order Flow & User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ STUDENT JOURNEY                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  Register/Login                                             │
│       └─→ Redirected to Student Dashboard                       │
│                                                                  │
│  2️⃣  Browse Menu & Add to Cart                                  │
│       └─→ Items fetched from /api/menu                          │
│       └─→ Cart stored in localStorage                           │
│                                                                  │
│  3️⃣  Checkout & Payment                                         │
│       └─→ POST /api/order/create (reserve items, generate OTP)  │
│       └─→ Receive: token_number, otp_code, order_id            │
│       └─→ POST /api/payment/create-order (Razorpay)            │
│       └─→ Modal popup for card details                         │
│       └─→ POST /api/payment/verify (HMAC signature check)      │
│                                                                  │
│  4️⃣  Order Confirmation & Tracking                              │
│       └─→ Token number displayed prominently                    │
│       └─→ OTP shown for verification at counter                 │
│       └─→ Live queue position & item prep times               │
│       └─→ Poll /api/queue/position/:orderId every 3s          │
│                                                                  │
│  5️⃣  Order Delivery                                             │
│       └─→ Staff calls token & verifies OTP                      │
│       └─→ Order marked as "Delivered"                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STAFF JOURNEY                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  Login (with staff key)                                     │
│       └─→ Redirected to Staff Dashboard                         │
│                                                                  │
│  2️⃣  Monitor Orders                                             │
│       └─→ GET /api/order/all → Active orders list              │
│       └─→ GET /api/queue → Live FIFO queue                     │
│                                                                  │
│  3️⃣  Verify Customer at Counter                                 │
│       └─→ Customer shows OTP                                    │
│       └─→ POST /api/order/verify-otp (confirm OTP)            │
│       └─→ Order status updates to "In Queue"                    │
│                                                                  │
│  4️⃣  Update Order Status                                        │
│       └─→ PUT /api/order/status/:id → "Preparing"             │
│       └─→ Student app updates in real-time                      │
│       └─→ PUT /api/order/status/:id → "Delivered"             │
│                                                                  │
│  5️⃣  Manage Menu & Availability                                 │
│       └─→ Add/edit/delete items                                 │
│       └─→ Update stock & availability                           │
│       └─→ Mark items unavailable (maintenance/out-of-stock)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security

- **JWT Authentication** (7-day token expiry) with bearer token validation
- **Password Security** (bcryptjs with 12-round salt hashing)
- **Payment Verification** (HMAC SHA-256 Razorpay signature verification)
- **Role-Based Access Control** (student/staff separation at route level)
- **OTP Verification** (4-digit OTP for in-person delivery confirmation)
- **Secure Cookies** (HTTP-only, secure flag in production)
- **Input Validation** (Joi schema validation on all requests)

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas), Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Payment Gateway** | Razorpay (REST API) |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Email Service** | Nodemailer (Ethereal for demo) |
| **Utilities** | OTP Generator, Passport.js |
| **Styling** | CSS Variables, Flexbox, Grid |
| **Fonts** | Google Fonts (Outfit family) |

---

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'staff',
  createdAt, updatedAt
}
```

### MenuItem
```javascript
{
  item_name: String,
  description: String,
  price: Number,
  category: 'Breakfast' | 'Lunch' | 'Snacks' | 'Beverages' | 'Dinner',
  availability: Boolean,
  stock: Number | null,
  image_url: String,
  prep_time: Number (minutes),
  createdAt, updatedAt
}
```

### Order
```javascript
{
  user_id: ObjectId,
  items: [{ item_id, item_name, price, quantity }],
  total_price: Number,
  token_number: Number (auto-assigned 1001+),
  otp_code: String,
  otp_verified: Boolean,
  queue_position: Number,
  order_status: 'Ordered' | 'OTP Verified' | 'In Queue' | 'Preparing' | 'Delivered' | 'Cancelled',
  payment_id: String,
  payment_status: 'pending' | 'paid' | 'failed',
  razorpay_order_id: String,
  createdAt, updatedAt
}
```

### QueueRecord
```javascript
{
  order_id: ObjectId,
  user_id: ObjectId,
  queue_position: Number,
  status: 'waiting' | 'preparing' | 'completed',
  createdAt, updatedAt
}
```

---

## � Environment Setup

### 1. MongoDB Atlas (Database)
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a cluster (M0 free tier)
4. Get connection string: mongodb+srv://user:password@cluster.mongodb.net/canteenqueue
5. Add to .env as MONGO_URI
```

### 2. Razorpay Account (Payments)
```
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Copy Key ID and Key Secret (test mode)
4. Add to .env as RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
```

### 3. Generate JWT Secrets
```bash
# Generate a strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env as JWT_SECRET and SESSION_SECRET
```

### 4. Environment File (.env)
```bash
# Create .env file at project root
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/canteenqueue?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRES_IN=7d
SESSION_SECRET=another_random_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
STAFF_SECRET=admin-secret-2024
PAYMENT_MODE=mock  # or 'live' for production
```

---

## 🧪 Testing

### 1. Register & Login
```bash
# Student Account
Email: student@example.com
Password: password123

# Staff Account (requires STAFF_SECRET)
Email: staff@example.com
Password: password123
Staff Key: admin-secret-2024
```

### 2. Test Order Flow
- Login as student → Browse menu
- Add 2-3 items to cart → Proceed to checkout
- Use test card: `4111 1111 1111 1111`
- Receive token number & OTP
- Login as staff → Verify OTP
- Update order status → See real-time updates

### 3. Test API Endpoints (using cURL)
```bash
# Get all menu items
curl http://localhost:5000/api/menu

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Get queue position (with JWT token)
curl http://localhost:5000/api/queue/position/ORDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ Error: MONGO_URI not set or invalid
✅ Solution: Check .env file and MongoDB Atlas IP whitelist
```

### Razorpay Payment Failing
```
❌ Error: Payment verification failed
✅ Solution: Check Razorpay keys in .env
✅ Tip: Use PAYMENT_MODE=mock for testing
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000
```

### Email Not Sending
```
❌ Error: Email service error
✅ Solution: Nodemailer uses Ethereal (test email service)
✅ Check console for test email links
```

### JWT Token Expired
```
❌ Error: Token invalid or expired
✅ Solution: Login again to get fresh token
```

---

## 📖 API Usage Examples

### Register Student
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Raj Kumar',
    email: 'raj@example.com',
    password: 'secure123',
    role: 'student'
  })
});
const data = await response.json();
// data.token → Save to localStorage
```

### Create Order
```javascript
const response = await fetch('/api/order/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [
      { item_id: '507f1f77bcf86cd799439011', quantity: 2 },
      { item_id: '507f1f77bcf86cd799439012', quantity: 1 }
    ]
  })
});
const data = await response.json();
// data.data.order_id → Use for payment
// data.data.otp_code → Show to student
// data.data.token_number → Display at counter
```

### Verify Payment
```javascript
const response = await fetch('/api/payment/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    razorpay_order_id: 'order_123456',
    razorpay_payment_id: 'pay_123456',
    razorpay_signature: 'signature_hash',
    order_id: 'mongodb_order_id'
  })
});
```

---

## 📱 Screenshots & UI Features

- **Responsive Design** (Mobile-first CSS)
- **Dark Mode Support** (CSS variables)
- **Toast Notifications** (Success/Error alerts)
- **Loading States** (Spinner overlays)
- **Real-time Updates** (Polling every 3 seconds)
- **Modal Dialogs** (Payment, confirmations)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Submit Pull Request

### Code Style
- Use consistent indentation (2 spaces)
- Follow existing naming conventions
- Add comments for complex logic
- Test before submitting PR

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Authors

- **Naren Ragam** - Full Stack Development

---

## 📞 Support & Contact

For issues, bugs, or feature requests:
- Open a [GitHub Issue](https://github.com/yourusername/CanteenQueue/issues)
- Email: your.email@example.com

---

## 🎯 Future Enhancements

- [ ] Email notifications when order ready
- [ ] Push notifications for students
- [ ] Analytics dashboard for staff
- [ ] Multi-language support
- [ ] Item ratings & reviews
- [ ] Favorite items saved
- [ ] Dietary preference filters
- [ ] Integration with canteen admin
- [ ] Mobile app (React Native)
- [ ] WhatsApp notifications

---

**Happy Ordering! 🍔🍕🍜**
