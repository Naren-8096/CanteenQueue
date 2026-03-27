# 🍽️ CanteenQueue

> **Digital College Canteen Ordering & Queue Management System**  
> Students order food online, pay via Razorpay, get a token + OTP, and track their queue position in real-time. Staff verify OTPs and manage orders from a dedicated dashboard.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Razorpay account (test mode)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Razorpay keys

# 3. Seed the database with 15 sample menu items
npm run seed

# 4. Start the server
npm start
# OR for development with auto-reload:
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```
CanteenQueue/
├── server.js                   # Express entry point
├── .env.example                # Environment template
├── frontend/                   # Static HTML/CSS/JS pages
│   ├── index.html              # Landing page
│   ├── login.html
│   ├── register.html           # Role selection (Student / Staff)
│   ├── student-dashboard.html  # Menu + Cart
│   ├── checkout.html           # Razorpay payment
│   ├── order-confirmation.html # Token, OTP, live status tracker
│   ├── staff-dashboard.html    # Orders, OTP verify, queue, availability, menu mgmt
│   ├── css/style.css           # Global design system
│   └── js/
│       ├── api.js              # Fetch wrapper + toast helper
│       └── auth.js             # JWT + role-based redirect
└── src/
    ├── config/db.js
    ├── models/                 # User, MenuItem, Order, QueueRecord
    ├── controllers/            # authController, menuController, orderController, queueController, availabilityController, paymentController
    ├── routes/                 # auth, menu, order, queue, availability, payment
    ├── middleware/             # auth.js (JWT), errorHandler.js
    └── seed/menuSeed.js        # 15 sample Indian canteen items
```

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register (student/staff) |
| POST | `/api/auth/login` | — | Login → JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/menu` | — | All menu items |
| POST | `/api/menu` | Staff | Add item |
| PUT | `/api/menu/:id` | Staff | Update item |
| DELETE | `/api/menu/:id` | Staff | Delete item |
| POST | `/api/order/create` | Student | Place order |
| GET | `/api/order/my-orders` | Student | My orders |
| GET | `/api/order/all` | Staff | All active orders |
| GET | `/api/order/status/:id` | JWT | Order status |
| POST | `/api/order/verify-otp` | Staff | Verify customer OTP |
| PUT | `/api/order/status/:id` | Staff | Update order status |
| GET | `/api/queue` | Staff | Live FIFO queue |
| GET | `/api/queue/position/:orderId` | JWT | Queue position |
| PUT | `/api/availability/update` | Staff | Toggle item availability |
| POST | `/api/payment/create-order` | JWT | Create Razorpay order |
| POST | `/api/payment/verify` | JWT | Verify payment signature |

---

## 🔄 Order Flow

```
Student Orders → Payment Verified → Token + OTP Generated
     → OTP Verified at Counter → Queue Assigned
          → Food Preparing → Delivered
```

---

## 🔐 Security

- **JWT** authentication (7-day expiry)
- **bcrypt** password hashing (12 salt rounds)
- **HMAC SHA-256** Razorpay signature verification
- Role-based route protection (student / staff)

---

## 🚢 Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Payment | Razorpay |
| Frontend | HTML5, CSS3, Vanilla JS |
| Fonts | Google Fonts (Outfit) |
