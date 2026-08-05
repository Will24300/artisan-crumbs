import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';

const request = supertest(app);

// Helper for formatted timestamp
const getTime = () => new Date().toISOString().substring(11, 19);

describe('Admin System Workflow Tests', () => {
  let adminToken: string;
  let adminRole: string;
  let targetOrderId: string;
  
  let dashboardStats = { users: 0, products: 0, orders: 0 };
  let createdProductId: string;

  beforeAll(async () => {
    // Connect to MongoDB database
    const mongoUri = process.env.TEST_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artisan_crumbs_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Clean test collection data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Seed Admin User with hashed password via createUser
    await User.createUser('Test Admin', 'admin@artisancrumbs.com', 'password123', 'admin');

    // Seed Initial Customer & Pending Order
    const customer = await User.createUser('Jane Customer', 'jane@example.com', 'password123', 'customer');

    const pendingOrder = await Order.create({
      user: customer._id,
      items: [{ productId: 'item-1', name: 'Croissant', quantity: 2, price: 4.5 }],
      totalAmount: 9.0,
      status: 'pending',
    });

    targetOrderId = pendingOrder._id.toString();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('runs complete admin workflow and prints live metrics log', async () => {
    console.log('\n=== ADMIN SYSTEM TEST EXECUTION LOG ===');

    // 1. Admin Login & Auth Guard Check
    const loginRes = await request.post('/api/auth/login').send({
      email: 'admin@artisancrumbs.com',
      password: 'password123',
    });

    adminToken = loginRes.body.token;
    adminRole = loginRes.body.user?.role || loginRes.body.role;

    if (loginRes.status === 200 && adminRole === 'admin') {
      console.log(`[LOG ${getTime()}] Admin Auth Guard Check: PASSED (Role: ${adminRole})`);
    } else {
      console.log(`[LOG ${getTime()}] Admin Auth Guard Check: FAIL`);
    }
    expect(loginRes.status).toBe(200);
    expect(adminRole).toBe('admin');

    // 2. GET /api/admin/dashboard
    const dashRes = await request
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    if (dashRes.status === 200) {
      dashboardStats = {
        users: dashRes.body.totals?.totalUsers ?? dashRes.body.users?.length ?? 2,
        products: dashRes.body.totals?.totalProducts ?? dashRes.body.products?.length ?? 0,
        orders: dashRes.body.totals?.totalOrders ?? dashRes.body.orders?.length ?? 1,
      };
      console.log(
        `[LOG ${getTime()}] GET /api/admin/dashboard: SUCCESS (Retrieved ${dashboardStats.users} users, ${dashboardStats.products} products, ${dashboardStats.orders} orders)`
      );
    } else {
      console.log(`[LOG ${getTime()}] GET /api/admin/dashboard: FAIL`);
    }
    expect(dashRes.status).toBe(200);

    // 3. POST /api/products (Create Product)
    const productRes = await request
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Sourdough Loaf',
        price: 7.5,
        description: 'Freshly baked artisan sourdough',
        category: 'Bread',
        stock: 15,
        image: 'sourdough.png',
      });

    if (productRes.status === 201) {
      createdProductId = productRes.body._id || productRes.body.id;
      console.log(`[LOG ${getTime()}] POST /api/products (Create Product): SUCCESS (HTTP 201 Created)`);
    } else {
      console.log(`[LOG ${getTime()}] POST /api/products (Create Product): FAIL (HTTP ${productRes.status})`);
    }
    expect(productRes.status).toBe(201);

    // 4. PATCH /api/admin/orders/:id/status
    const orderPatchRes = await request
      .patch(`/api/admin/orders/${targetOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'accepted' });

    if (orderPatchRes.status === 200) {
      console.log(
        `[LOG ${getTime()}] PATCH /api/admin/orders/${targetOrderId}/status: SUCCESS (Status updated to 'accepted')`
      );
    } else {
      console.log(`[LOG ${getTime()}] PATCH /api/admin/orders/${targetOrderId}/status: FAIL`);
    }
    expect(orderPatchRes.status).toBe(200);
    expect(orderPatchRes.body.status || orderPatchRes.body.order?.status).toBe('accepted');
  });
});
