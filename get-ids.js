const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:s3fMvveIg3iA4OZX@ecommerce-db.unpuix1.mongodb.net/ecommercedb?appName=ecommerce-db';

async function getIds() {
  try {
    console.log('\n🔍 Fetching IDs from Database...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    console.log('='.repeat(70));

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Get Products
    console.log('\n📦 PRODUCTS:');
    console.log('-'.repeat(70));
    const products = await Product.find({}, 'name _id slug category price');
    
    if (products.length === 0) {
      console.log('❌ No products found!');
      console.log('   Add products first via: http://localhost:3000/admin/products');
    } else {
      products.forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   ID: ${p._id}`);
        console.log(`   Slug: ${p.slug || 'N/A'}`);
        console.log(`   Category: ${p.category || 'N/A'}`);
        console.log(`   Price: Rs. ${p.price || 0}`);
      });
    }
    
    // Get Users
    console.log('\n\n👥 USERS:');
    console.log('-'.repeat(70));
    const users = await User.find({}, 'name email _id role');
    
    if (users.length === 0) {
      console.log('❌ No users found!');
      console.log('   Run: node create-admin.js');
    } else {
      users.forEach((u, i) => {
        console.log(`\n${i + 1}. ${u.name} (${u.role.toUpperCase()})`);
        console.log(`   ID: ${u._id}`);
        console.log(`   Email: ${u.email}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n📝 How to Use These IDs:\n');
    console.log('When creating a review manually, you need:');
    console.log('- A Product ID (from the products list above)');
    console.log('- A User ID (from the users list above)');
    console.log('\nExample review document:');
    console.log('```json');
    console.log('{');
    console.log(`  "product": "${products[0]?._id || 'PRODUCT_ID_HERE'}",`);
    console.log(`  "user": "${users[0]?._id || 'USER_ID_HERE'}",`);
    console.log('  "rating": 5,');
    console.log('  "title": "Great product!",');
    console.log('  "comment": "I love this plant...",');
    console.log('  "status": "approved"');
    console.log('}');
    console.log('```\n');
    
    console.log('💡 TIP: Copy these IDs to use in MongoDB Compass or Atlas\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB\n');
    process.exit(0);
  }
}

getIds();