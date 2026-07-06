// Test script to verify admin orders endpoint
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const API_BASE = 'http://localhost:5000/api';

async function testOrdersAPI() {
  try {
    // Connect to MongoDB to get admin user
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evergreen-depot');
    
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('❌ No admin user found in database');
      return;
    }
    
    console.log(`✅ Found admin user: ${adminUser.name} (${adminUser.email})`);
    
    // Generate a test token
    const token = jwt.sign(
      { _id: adminUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log(`Generated test token: ${token.substring(0, 20)}...`);
    
    // Test the admin orders endpoint
    console.log(`\nTesting GET /api/orders/admin/all...`);
    
    const response = await axios.get(`${API_BASE}/orders/admin/all`, {
      params: { limit: 100 },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Success! Status: ${response.status}`);
    console.log(`Orders found: ${response.data.orders?.length || 0}`);
    console.log(`Total orders: ${response.data.pagination?.total || 0}`);
    
    if (response.data.orders?.length > 0) {
      console.log(`\nFirst order:`);
      const order = response.data.orders[0];
      console.log(`  - Order #: ${order.orderNumber}`);
      console.log(`  - Customer: ${order.user?.name}`);
      console.log(`  - Status: ${order.status}`);
      console.log(`  - Payment Status: ${order.payment?.status}`);
      console.log(`  - Total: Rs. ${order.pricing?.total}`);
      console.log(`  - Items: ${order.items?.length || 0}`);
    }
    
  } catch (error) {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status}`);
      console.error(`Response:`, error.response.data);
    } else {
      console.error(`❌ Error:`, error.message);
    }
  } finally {
    await mongoose.disconnect();
  }
}

testOrdersAPI();
