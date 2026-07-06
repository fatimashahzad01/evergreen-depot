const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    const products = await Product.find({}, 'name price stock slug images');
    
    console.log(`📦 Total Products: ${products.length}\n`);
    
    if (products.length === 0) {
      console.log('⚠️  No products found!');
      console.log('   You need to add products before placing orders.');
      console.log('   Go to: http://localhost:3000/admin/products');
    } else {
      console.log('Products in Database:');
      console.log('='.repeat(60));
      products.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log(`   Price: Rs. ${p.price}`);
        console.log(`   Stock: ${p.stock || 0}`);
        console.log(`   ID: ${p._id}`);
        console.log(`   Has Images: ${p.images?.length > 0 ? '✅' : '❌'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkProducts();