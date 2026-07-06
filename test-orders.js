const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./models/Order');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evergreen-depot';

async function testOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Count all orders
    const totalOrders = await Order.countDocuments();
    console.log(`\nTotal orders in database: ${totalOrders}`);

    // Count all users
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const customerUsers = await User.countDocuments({ role: 'customer' });
    
    console.log(`Total users: ${totalUsers}`);
    console.log(`  - Admin users: ${adminUsers}`);
    console.log(`  - Customer users: ${customerUsers}`);

    // Show recent orders
    console.log(`\nRecent 5 orders:`);
    const recentOrders = await Order
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email role')
      .lean();

    recentOrders.forEach((order, idx) => {
      console.log(`  ${idx + 1}. Order ${order.orderNumber} - User: ${order.user?.name} (${order.user?.email}) - Status: ${order.status}`);
    });

    // Show admin users
    if (adminUsers > 0) {
      console.log(`\nAdmin users:`);
      const admins = await User
        .find({ role: 'admin' })
        .select('name email')
        .lean();
      
      admins.forEach((admin, idx) => {
        console.log(`  ${idx + 1}. ${admin.name} (${admin.email})`);
      });
    } else {
      console.log(`\n⚠️  No admin users found! Create an admin user first.`);
    }

    console.log('\n✅ Test complete');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testOrders();
