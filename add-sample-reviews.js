const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:s3fMvveIg3iA4OZX@ecommerce-db.unpuix1.mongodb.net/ecommercedb?appName=ecommerce-db';

// Sample reviews data
const sampleReviews = [
  {
    rating: 5,
    title: "Amazing plant! Highly recommended",
    comment: "This plant arrived in perfect condition. It's healthy, vibrant, and exactly as described. The packaging was excellent and it survived the delivery perfectly. Very happy with my purchase!",
    pros: ["Healthy plant", "Great packaging", "Fast delivery", "Value for money"],
    cons: [],
    status: "approved",
    featured: true
  },
  {
    rating: 4,
    title: "Good quality, slight delay in delivery",
    comment: "The plant quality is excellent and it's growing well in my garden. Only reason for 4 stars instead of 5 is that delivery took a bit longer than expected. But overall very satisfied!",
    pros: ["Good quality", "Healthy plant", "Good price"],
    cons: ["Slightly delayed delivery"],
    status: "approved"
  },
  {
    rating: 5,
    title: "Perfect for my balcony garden!",
    comment: "I ordered this for my balcony and it's thriving! The plant was well-packaged and the seller provided great care instructions. Customer service was also very responsive to my questions.",
    pros: ["Great customer service", "Excellent packaging", "Detailed care instructions"],
    cons: [],
    status: "approved"
  },
  {
    rating: 3,
    title: "Plant is okay but smaller than expected",
    comment: "The plant arrived healthy but it's smaller than what I expected from the photos. Still growing it and hoping it will grow bigger. Quality is decent though.",
    pros: ["Healthy plant", "Affordable price"],
    cons: ["Smaller than expected"],
    status: "approved"
  },
  {
    rating: 5,
    title: "Best nursery in Pakistan! 🌿",
    comment: "I've ordered multiple times from Evergreen Depot and they never disappoint. Plants are always fresh, delivery is on time, and prices are very reasonable. Highly recommend!",
    pros: ["Reliable seller", "Fresh plants", "Reasonable prices", "Multiple orders successful"],
    cons: [],
    status: "approved",
    featured: true
  },
  {
    rating: 4,
    title: "Great plant, good service",
    comment: "Very happy with my purchase. Plant is healthy and adapting well. The only improvement I'd suggest is to include more detailed care instructions specific to Pakistani climate.",
    pros: ["Healthy plant", "Good service", "Fair pricing"],
    cons: ["Need more care instructions"],
    status: "approved"
  },
  {
    rating: 5,
    title: "Excellent for indoor decoration",
    comment: "This plant has transformed my living room! It's easy to maintain and looks beautiful. Perfect size for indoor spaces. Delivery was quick and plant was well-protected.",
    pros: ["Beautiful", "Easy to maintain", "Perfect size", "Quick delivery"],
    cons: [],
    status: "approved"
  },
  {
    rating: 4,
    title: "Good purchase, happy customer",
    comment: "Plant arrived healthy and is doing well in my garden. Seller was responsive to queries. Would definitely order again.",
    pros: ["Healthy plant", "Responsive seller", "Good quality"],
    cons: [],
    status: "approved"
  }
];

async function addSampleReviews() {
  try {
    console.log('\n🌟 Adding Sample Reviews to Database...\n');
    console.log('='.repeat(70));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get models
    const Review = mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    // Check if products exist
    const products = await Product.find({ isActive: true });
    if (products.length === 0) {
      console.log('❌ No products found in database!');
      console.log('   Please add products first via admin panel.');
      await mongoose.disconnect();
      process.exit(1);
      return;
    }
    console.log(`📦 Found ${products.length} products`);

    // Check if users exist
    const users = await User.find({ role: 'customer' });
    if (users.length === 0) {
      console.log('⚠️  No customer users found!');
      console.log('   Creating a sample customer user...\n');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('customer123', 10);
      
      const sampleUser = new User({
        name: 'Sample Customer',
        email: 'customer@example.com',
        password: hashedPassword,
        phone: '+923001234567',
        role: 'customer',
        address: {
          city: 'Lahore',
          province: 'Punjab',
          country: 'Pakistan'
        },
        isActive: true,
        emailVerified: true
      });
      
      await sampleUser.save();
      users.push(sampleUser);
      console.log('✅ Created sample customer user');
    }
    console.log(`👥 Found ${users.length} customer users\n`);

    // Clear existing reviews (optional)
    const existingReviews = await Review.countDocuments();
    if (existingReviews > 0) {
      console.log(`⚠️  Found ${existingReviews} existing reviews`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      await new Promise((resolve) => {
        readline.question('Do you want to delete existing reviews and add new ones? (yes/no): ', (answer) => {
          if (answer.toLowerCase() === 'yes') {
            Review.deleteMany({}).then(() => {
              console.log('✅ Deleted existing reviews\n');
              resolve();
            });
          } else {
            console.log('❌ Keeping existing reviews. Exiting...\n');
            mongoose.disconnect();
            process.exit(0);
          }
          readline.close();
        });
      });
    }

    // Add reviews
    console.log('Adding sample reviews...\n');
    let addedCount = 0;

    for (let i = 0; i < products.length && i < sampleReviews.length; i++) {
      const product = products[i];
      const reviewData = sampleReviews[i];
      const user = users[i % users.length]; // Cycle through users

      const review = new Review({
        product: product._id,
        user: user._id,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        pros: reviewData.pros,
        cons: reviewData.cons,
        status: reviewData.status,
        featured: reviewData.featured || false,
        isVerifiedPurchase: false // Set to true if you want verified purchases
      });

      await review.save();
      addedCount++;

      console.log(`${addedCount}. Added review for: ${product.name}`);
      console.log(`   Rating: ${'⭐'.repeat(reviewData.rating)}`);
      console.log(`   By: ${user.name}`);
      console.log(`   Title: ${reviewData.title}`);
      console.log('');
    }

    // If we have more reviews than products, add multiple reviews to products
    if (sampleReviews.length > products.length) {
      for (let i = products.length; i < sampleReviews.length; i++) {
        const product = products[i % products.length]; // Cycle through products
        const reviewData = sampleReviews[i];
        const user = users[i % users.length];

        const review = new Review({
          product: product._id,
          user: user._id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          pros: reviewData.pros,
          cons: reviewData.cons,
          status: reviewData.status,
          featured: reviewData.featured || false,
          isVerifiedPurchase: false
        });

        await review.save();
        addedCount++;

        console.log(`${addedCount}. Added additional review for: ${product.name}`);
        console.log(`   Rating: ${'⭐'.repeat(reviewData.rating)}`);
        console.log('');
      }
    }

    console.log('='.repeat(70));
    console.log(`\n✅ Successfully added ${addedCount} reviews!\n`);

    // Update product ratings
    console.log('Updating product ratings...');
    for (const product of products) {
      const productReviews = await Review.find({ 
        product: product._id, 
        status: 'approved' 
      });
      
      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        await Product.findByIdAndUpdate(product._id, {
          'rating.average': Math.round(averageRating * 10) / 10,
          'rating.count': productReviews.length
        });
        
        console.log(`  ${product.name}: ${averageRating.toFixed(1)}⭐ (${productReviews.length} reviews)`);
      }
    }

    console.log('\n✅ Product ratings updated!');
    console.log('\n📊 Summary:');
    console.log('='.repeat(70));
    console.log(`Total Reviews Added: ${addedCount}`);
    console.log(`Products with Reviews: ${products.length}`);
    console.log(`Average Rating: ${(sampleReviews.reduce((s, r) => s + r.rating, 0) / sampleReviews.length).toFixed(1)}⭐`);
    console.log('='.repeat(70));
    
    console.log('\n🎉 Done! You can now view reviews in your database.');
    console.log('\n📝 Next Steps:');
    console.log('1. Refresh your MongoDB Atlas Data Explorer');
    console.log('2. Check the "reviews" collection');
    console.log('3. View product pages to see reviews displayed');
    console.log('4. Go to admin panel to manage reviews\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB\n');
    process.exit(0);
  }
}

addSampleReviews();