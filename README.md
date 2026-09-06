# 🥐 Artisan Crumbs — Handcrafted Bakery & E-Commerce Platform

A modern, full-stack e-commerce web application for **Artisan Crumbs Bakery**, built with **React**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit**, **Node.js**, **Express**, and **MongoDB**.

![Artisan Crumbs](https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop)

---

## 🌟 Key Features

### 🛒 **Customer Experience**
- **Interactive Shop & Menu**: Browse handcrafted bakery products categorized into *Cakes*, *Muffins*, *Croissants*, *Breads*, and *Tarts*.
- **Custom Cake Builder**: Design personalized custom cakes with selectable sizes, flavors, fillings, frostings, toppings, and custom message inscriptions.
- **Product Reviews & Ratings**: View real user reviews, average ratings, and submit verified customer reviews.
- **Slide-out Cart & Live Checkout**: Real-time cart state management with quantity adjustments and instant total calculation using Redux Toolkit.
- **User Accounts & Order History**: User profile dashboard with order status tracking (*Pending*, *Processing*, *Completed*, *Declined*) and password management.
- **Dark Mode**: Seamless dark/light theme switching powered by persistent local storage.

### 🛡️ **Admin Portal**
- **Admin Dashboard**: Visual overview of total users, active products, total revenue, and live orders.
- **Product Management**: Full CRUD operations for bakery products including stock updates, category tagging, and image uploads.
- **Order Management**: Monitor customer orders in real-time, update fulfillment status, and decline/approve orders.

### ⚡ **Backend & Database**
- **JWT Authentication**: Secure JSON Web Token authentication with bcrypt password hashing.
- **High-Performance Image Serving**: Optimized database image storage with a dedicated lightweight base64/URL image caching endpoint.
- **Database Sync Scripts**: One-click scripts to seed local databases or sync real production data from MongoDB Atlas.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 with TypeScript & Vite
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Animations**: Framer Motion
- **Icons & UI Tools**: Lucide React icons, React Toastify notifications
- **Routing**: React Router v6

### **Backend**
- **Runtime**: Node.js & Express.js (TypeScript)
- **Database**: MongoDB & Mongoose ORM
- **Security & Auth**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Utilities**: `compression`, `cors`, `dotenv`, `nodemailer`

---

## 📁 Project Architecture

```
artisan-crumbs/
├── frontend/                  # React + Vite Frontend Application
│   ├── src/
│   │   ├── assets/            # Static assets & bakery images
│   │   ├── components/        # Reusable UI components (Cart, Layout, ReviewsModal, etc.)
│   │   ├── features/          # Redux slices (auth, cart, products, theme)
│   │   ├── pages/             # Page components (Home, Shop, CustomCake, AdminDashboard, etc.)
│   │   ├── utils/             # API helpers & base configurations
│   │   ├── App.tsx            # Main application router
│   │   └── main.tsx           # React entry point
│   ├── index.html             # HTML entry document
│   └── vite.config.ts         # Vite server proxy configuration
│
└── backend/                   # Node.js + Express API Backend
    ├── src/
    │   ├── middleware/        # Authentication & Role Authorization middlewares
    │   ├── models/            # Mongoose schemas (User, Product, Order, Review, Settings)
    │   ├── routes/            # Express API endpoints (auth, products, orders, reviews, etc.)
    │   └── app.ts             # Express app setup & server initialization
    ├── scripts/               # Utility scripts (seed-products.js, sync-from-atlas.js)
    └── package.json           # Backend dependencies & npm scripts
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **pnpm** or **npm**
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

---

### 1. **Clone the Repository**
```bash
git clone https://github.com/Will24300/artisan-crumbs.git
cd artisan-crumbs
```

---

### 2. **Setup and Run the Backend**

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file (or use existing defaults)
# Example .env:
# PORT=5001
# MONGO_URI=mongodb://127.0.0.1:27017/artisan-crumbs
# JWT_SECRET=your_secret_key_here

# Seed the local database with products (Optional)
npm run seed:products

# Or sync real products directly from MongoDB Atlas (Optional)
npm run sync:atlas

# Start the backend development server
npm run dev
```
The backend API will run on **`http://localhost:5001`**.

---

### 3. **Setup and Run the Frontend**

```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Start the Vite development server
pnpm dev
```
The frontend application will be available at **`http://localhost:5173`**.

---

## 📜 Available NPM Scripts

### **Backend Scripts** (`/backend`)
- `npm run dev`: Starts the backend server with `nodemon` and `ts-node`.
- `npm run build`: Compiles TypeScript files to `dist/`.
- `npm run start`: Runs the compiled production code from `dist/app.js`.
- `npm run seed:products`: Seeds the local database with initial bakery products.
- `npm run sync:atlas`: Syncs real products and images directly from MongoDB Atlas to your local database.
- `npm run test`: Executes unit tests with Vitest.

### **Frontend Scripts** (`/frontend`)
- `pnpm dev`: Runs the Vite development server.
- `pnpm build`: Builds the production bundle.
- `pnpm preview`: Previews the production build locally.

---

## 🔒 Environment Variables

### **Backend (`backend/.env`)**
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/artisan-crumbs
JWT_SECRET=your_jwt_secret
TOKEN_EXPIRATION=1d
```

### **Frontend (`frontend/.env`)**
```env
VITE_API_URL=
```
*(In local development, `VITE_API_URL` can be left empty as Vite's proxy automatically routes `/api` calls to `http://localhost:5001`).*

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

© 2026 **Artisan Crumbs Bakery**. Handcrafted with passion.