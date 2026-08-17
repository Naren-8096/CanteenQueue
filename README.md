# 🍽️ CanteenQueue

> **Digital College Canteen Ordering & Queue Management System**  
> A full-stack web application designed for campus cafeterias and canteens. Students and customers can browse the live menu, place orders online, pay seamlessly via Razorpay, receive unique order tokens with secure OTPs, and track their preparation and queue status in real-time. Administrators and canteen staff have access to a live dashboard for managing incoming orders, updating menu items, toggling item availability, and validating OTPs at the delivery counter.

---

## ✨ Key Features

### For Students & Customers 👨‍🎓
- 📜 **Live Digital Menu**: Browse categorized items (Breakfast, Lunch, Snacks, Beverages) with real-time stock and availability.
- 🛒 **Interactive Cart**: Instant quantity adjustment, preparation time estimation, and subtotal calculation.
- 💳 **Seamless Checkout**: Razorpay online payment integration (with instant test mode support).
- 🎫 **Token & OTP Generation**: Automated generation of secure collection tokens and verification OTPs.
- ⏱️ **Real-Time Queue Tracking**: Live position tracking and preparation status (Pending → Preparing → Ready → Delivered).
- 📜 **Order History**: Review past orders, download summaries, and track delivery history.
- 🔐 **Modern Authentication**: Email/Password authentication + Google OAuth 2.0 single sign-on.

### For Administrators & Canteen Staff 👨‍💼
- 📊 **Real-Time Operations Dashboard**: Live view of pending, preparing, and ready orders with audio alerts.
- 🔢 **Live Queue Monitor**: Visual FIFO order queue with estimated wait times.
- 🔑 **OTP Counter Verification**: Quick 4-digit OTP verification system to prevent unauthorized pickups.
- 🍔 **Menu Management**: Add new dishes, edit prices, upload image URLs, and delete discontinued items.
- ⚡ **Stock & Availability Toggle**: Instantly mark items as In-Stock / Out-of-Stock.
- 👥 **Role-Based Access Control**: Granular protection across Customer, Staff, and Admin roles.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server or MongoDB Atlas cluster)

### 1. Installation
Clone the repository and install dependencies:
```bash
# Navigate to project directory
cd CanteenQueue

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (or configure `.env` directly):
```bash
cp .env.example .env
```

Your `.env` should look like this:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/canteenqueue
JWT_SECRET=canteenqueue_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
SESSION_SECRET=canteenqueue_session_secret_key_2026
NODE_ENV=development

# Razorpay Payment Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX

# Staff Registration Secret
STAFF_SECRET=x9Pq2!mK#8vL$5wNz@7rY*4cT^1bJ&0dF

# Primary Admin Account Configuration
ADMIN_NAME=Canteen Administrator
ADMIN_EMAIL=admin@canteen.com
ADMIN_PASSWORD=admin123

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## 🗄️ Database Management & Formatting

### Reset & Format Database (Complete Fresh Start)
To remove all existing customer accounts, old orders, queue logs, and reset the menu and admin account to a clean initial state:
```bash
npm run db:reset
```

> **What `db:reset` does:**
> 1. Clears all users (customer, staff, and old admin accounts).
> 2. Clears all orders and queue history.
> 3. Populates 15 standard, rich menu items with photos, prices, and prep times.
> 4. Creates a fresh primary Admin account (`admin@canteen.com` / `admin123`).

### Other Useful Database Commands
```bash
# Test database connection and count records
npm run db:test

# Seed only menu items
npm run seed

# Seed/Reset only the Admin account
npm run seed:admin
```

---

## 💻 Starting the Application

### Development Mode (with hot-reloading)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Open your browser and visit: **`http://localhost:3000`**

---

## 🔑 Default Credentials

| Role | Email | Password | Access / Portal |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@canteen.com` | `admin123` | `/admin-dashboard.html` |
| **👥 Customer / Student** | Register new via `/register.html` | User created | `/customer-dashboard.html` |

### Test Razorpay Payment Credentials (Test Mode)
When prompted in the checkout modal:
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: `12/28`
- **CVV**: `123`
- **OTP**: Any 4-6 digit number (e.g. `123456`)

---

## 📁 Project Directory Structure

```
CanteenQueue/
├── server.js                      # Express application entry point
├── package.json                   # Project metadata, scripts & dependencies
├── test-db.js                     # MongoDB connection & model diagnostic script
├── .env                           # Environment configuration
├── .env.example                   # Environment configuration template
│
├── frontend/                      # Frontend Single Page Applications & UI
│   ├── index.html                 # Landing / Welcome page
│   ├── login.html                 # User & Admin login
│   ├── register.html              # Customer registration page
│   ├── customer-dashboard.html    # Menu browsing, cart, and live order drawer
│   ├── checkout.html              # Payment review & Razorpay checkout
│   ├── order-confirmation.html    # Real-time token & OTP live tracker
│   ├── my-orders.html             # Customer order history
│   ├── admin-dashboard.html       # Canteen admin order processing & menu manager
│   ├── forgot-password.html       # Password reset request
│   ├── reset-password.html        # New password entry form
│   ├── css/
│   │   └── style.css              # Unified UI theme & responsive styling
│   └── js/
│       ├── api.js                 # Unified API client & notification handler
│       └── auth.js                # Auth helpers, token storage & RBAC guards
│
└── src/                           # Backend Source Code
    ├── config/
    │   ├── db.js                  # Mongoose MongoDB connection handler
    │   └── passport.js            # Google OAuth 2.0 strategy setup
    ├── models/
    │   ├── User.js                # User schema (Customer, Staff, Admin)
    │   ├── MenuItem.js            # Menu item schema
    │   ├── Order.js               # Order schema with OTP, token & status
    │   └── QueueRecord.js         # Live FIFO queue positioning model
    ├── controllers/
    │   ├── authController.js      # Register, Login, Admin creation, OAuth
    │   ├── menuController.js      # Menu item CRUD operations
    │   ├── orderController.js     # Create order, OTP verification & updates
    │   ├── queueController.js     # FIFO queue tracking calculations
    │   ├── paymentController.js   # Razorpay order generation & verification
    │   └── availabilityController.js # Stock & instant item availability
    ├── routes/
    │   ├── auth.js                # /api/auth/*
    │   ├── menu.js                # /api/menu/*
    │   ├── order.js               # /api/order/*
    │   ├── queue.js               # /api/queue/*
    │   ├── payment.js             # /api/payment/*
    │   └── availability.js        # /api/availability/*
    ├── middleware/
    │   ├── auth.js                # JWT token verification & role enforcement
    │   └── errorHandler.js        # Centralized HTTP error handler
    ├── utils/
    │   └── sendEmail.js           # Email delivery utility (Nodemailer)
    └── seed/
        ├── resetDb.js             # Full DB wipe & fresh seed script
        ├── adminSeed.js           # Admin account seeding script
        └── menuSeed.js            # Menu items seeding script
```

---

## 🔌 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Login with email & password |
| `POST` | `/api/auth/admin/create-admin` | Admin | Create an additional Admin account |
| `GET` | `/api/auth/me` | JWT | Get current user profile |
| `PUT` | `/api/auth/me` | JWT | Update current user profile |
| `POST` | `/api/auth/forgotpassword` | Public | Send password reset email |
| `PUT` | `/api/auth/resetpassword/:token`| Public | Reset password with token |
| `GET` | `/api/auth/google` | Public | Initiate Google OAuth 2.0 login |
| `GET` | `/api/auth/google/callback` | Public | Google OAuth 2.0 callback URL |

### Menu Management (`/api/menu`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu` | Public | List all active menu items |
| `POST` | `/api/menu` | Admin / Staff | Add a new menu item |
| `PUT` | `/api/menu/:id` | Admin / Staff | Update menu item details |
| `DELETE` | `/api/menu/:id` | Admin / Staff | Remove menu item |
| `PUT` | `/api/availability/update` | Admin / Staff | Bulk update stock / availability |

### Order & Queue Management (`/api/order` & `/api/queue`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/order/create` | JWT | Place new food order |
| `GET` | `/api/order/my-orders` | JWT | Fetch orders belonging to logged-in user |
| `GET` | `/api/order/all` | Admin / Staff | Fetch all active canteen orders |
| `GET` | `/api/order/completed` | Admin / Staff | Fetch archived / completed orders |
| `GET` | `/api/order/status/:id` | JWT | Fetch status of specific order |
| `POST` | `/api/order/verify-otp` | Admin / Staff | Verify order pickup OTP |
| `PUT` | `/api/order/status/:id` | Admin / Staff | Update order lifecycle status |
| `GET` | `/api/queue` | Admin / Staff | Live FIFO queue stream |
| `GET` | `/api/queue/position/:orderId` | JWT | Get live queue spot for order |

### Payments (`/api/payment`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/create-order` | JWT | Create Razorpay order instance |
| `POST` | `/api/payment/verify` | JWT | Verify Razorpay payment signature |

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
