# 🌿 Evergreen Depot Market - E-Commerce Plant Store

A full-stack e-commerce website for selling plants online with a Pakistani local store feel. Built with Node.js, Express, MongoDB, and React.

## ✅ Features Implemented (All Requirements from Checklist)

### Frontend Features
- ✅ **Local Shop Feel** - Pakistani themed UI with Urdu text support
- ✅ **User Dashboard** - Complete user account management
- ✅ **Admin Dashboard** - Full admin control panel
- ✅ **Current Operations Performance** - Real-time stats and analytics
- ✅ **On-page SEO** - Meta tags, structured data, SEO-friendly URLs
- ✅ **Header Section Meta Tags** - Dynamic meta information
- ✅ **Meta Description for All Pages** - SEO optimized descriptions
- ✅ **Product Description According to SEO** - Rich product information
- ✅ **Dynamic Content** - Real-time data from database
- ✅ **SEO Friendly Links** - Clean URL structure with slugs
- ✅ **CDN Ready** - Cloudinary integration for images
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **No Content Redundancy** - Efficient component structure

### Backend Features
- ✅ User Authentication (JWT)
- ✅ Product Management
- ✅ Order Processing
- ✅ Shopping Cart
- ✅ Wishlist
- ✅ Reviews & Ratings
- ✅ Cloud Image Storage (Cloudinary)
- ✅ Payment Integration Ready
- ✅ Admin Controls

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Git

### Step 1: Clone/Setup the Project

```bash
# If you have all files in evergreen-depot folder
cd evergreen-depot

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment Variables

Edit the `.env` file in the root directory:

```env
# MongoDB - Use MongoDB Atlas for free cloud database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/evergreen-depot

# JWT Secret - Change this to a random string
JWT_SECRET=your_super_secret_jwt_key_here_123

# Cloudinary (for images) - Sign up free at cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Keep other settings as is
PORT=5000
NODE_ENV=development
```

### Step 3: Setup MongoDB

#### Option A: MongoDB Atlas (Recommended - Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a new cluster (free tier)
4. Create database user
5. Get connection string and add to `.env`

#### Option B: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

### Step 4: Setup Cloudinary (For Images)

1. Sign up at [Cloudinary](https://cloudinary.com) (free tier)
2. Get your credentials from dashboard
3. Add to `.env` file

### Step 5: Seed Initial Data

```bash
# Create seed script first
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

async function seedData() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@evergreendepot.pk',
    password: 'Admin@123',
    phone: '03001234567',
    role: 'admin'
  });
  
  // Create sample products
  const products = [
    {
      name: 'Money Plant',
      slug: 'money-plant',
      description: 'Beautiful indoor money plant for good luck',
      shortDescription: 'Indoor money plant',
      category: 'indoor-plants',
      price: 500,
      stock: 50,
      sku: 'MP001',
      images: [{url: 'https://source.unsplash.com/400x400/?money-plant', isPrimary: true}]
    },
    {
      name: 'Rose Plant',
      slug: 'rose-plant',
      description: 'Fresh rose plant with multiple colors',
      shortDescription: 'Beautiful rose plant',
      category: 'flowering-plants',
      price: 800,
      stock: 30,
      sku: 'RP001',
      images: [{url: 'https://source.unsplash.com/400x400/?rose-plant', isPrimary: true}]
    }
  ];
  
  await Product.insertMany(products);
  console.log('Data seeded successfully!');
  process.exit();
}

seedData();
"
```

### Step 6: Run the Application

```bash
# Run both backend and frontend
npm run dev-all

# OR run separately:
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: admin@evergreendepot.pk / Admin@123

## 🌐 Deployment Guide

### Option 1: Deploy to Vercel (Recommended - Free)

#### Backend Deployment (Using Vercel)

1. Create account at [Vercel](https://vercel.com)
2. Install Vercel CLI:
```bash
npm i -g vercel
```

3. Create `vercel.json` in root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "./server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

4. Deploy:
```bash
vercel --prod
```

#### Frontend Deployment (Vercel/Netlify)

```bash
cd client

# Update API URL in your code to point to deployed backend
# Create .env.production
echo "REACT_APP_API_URL=https://your-backend.vercel.app" > .env.production

# Build
npm run build

# Deploy to Vercel
vercel --prod

# OR Deploy to Netlify
# 1. Go to netlify.com
# 2. Drag and drop build folder
```

### Option 2: Deploy to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create evergreen-depot

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_name

# Deploy
git add .
git commit -m "Deploy"
git push heroku main
```

### Option 3: Deploy to VPS (DigitalOcean/AWS)

```bash
# SSH to your server
ssh user@your-server-ip

# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# Clone your code
git clone your-repo
cd evergreen-depot

# Install dependencies
npm install
cd client && npm install && npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name evergreen-depot
pm2 save
pm2 startup

# Setup Nginx
sudo apt-get install nginx
# Configure nginx to proxy to your Node app
```

## 📱 Testing the Website

### Test User Accounts
```
Customer: customer@test.com / Test@123
Admin: admin@evergreendepot.pk / Admin@123
```

### Test Payment
- Cash on Delivery (COD) is enabled by default
- For card payments, integrate Stripe/JazzCash/EasyPaisa

## 🛠️ Customization

### Change Store Name
1. Update in `client/src/pages/Home.js`
2. Update in `client/public/index.html`
3. Update backend responses

### Change Theme Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change green to your color
    500: '#your-color',
  }
}
```

### Add Payment Gateway

For JazzCash/EasyPaisa:
```javascript
// In routes/orders.js
const JazzCash = require('jazzcash-checkout');
// Add integration code
```

## 📊 Admin Features

Access admin panel at `/admin`:
- Dashboard with statistics
- Product management (Add/Edit/Delete)
- Order management
- User management
- Reviews moderation
- Reports generation

## 🔧 Troubleshooting

### MongoDB Connection Error
- Check MongoDB URI in `.env`
- Ensure MongoDB is running
- Check network/firewall settings

### Images Not Uploading
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper internet connection

### Frontend Not Loading
- Check if backend is running on port 5000
- Clear browser cache
- Check console for errors

## 📞 Support & Contact

For Pakistani hosting and domain:
- **PTCL Hosting**: https://hosting.ptcl.com.pk
- **Paknic Domains**: https://paknic.com
- **.PK Domain**: https://pknic.net.pk

## 🎯 Next Steps

1. **Get Domain**: Buy domain like evergreendepot.pk
2. **SSL Certificate**: Use Let's Encrypt (free)
3. **SEO**: Submit sitemap to Google
4. **Marketing**: Setup Google My Business
5. **Analytics**: Add Google Analytics
6. **Social Media**: Create Facebook/Instagram pages

## 📄 License

This project is ready to use for your business!

---

**Made with 💚 for Pakistan's Green Future**
