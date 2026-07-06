const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

// @route   GET /api/dashboard/overview
// @desc    Get user dashboard overview
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user's statistics
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalSpent,
      wishlistCount,
      cartCount,
      recentOrders,
      reviewsCount
    ] = await Promise.all([
      Order.countDocuments({ user: userId }),
      Order.countDocuments({ user: userId, status: 'pending' }),
      Order.countDocuments({ user: userId, status: 'delivered' }),
      Order.aggregate([
        { $match: { 
          user: userId,
          'payment.status': 'completed'
        }},
        { $group: { 
          _id: null, 
          total: { $sum: '$pricing.total' } 
        }}
      ]),
      User.findById(userId).select('wishlist').then(user => 
        user ? user.wishlist.length : 0
      ),
      User.findById(userId).select('cart').then(user => 
        user ? user.cart.length : 0
      ),
      Order
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber status pricing.total createdAt items')
        .lean(),
      Review.countDocuments({ user: userId })
    ]);
    
    res.json({
      success: true,
      overview: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          delivered: deliveredOrders
        },
        totalSpent: totalSpent[0]?.total || 0,
        wishlistCount,
        cartCount,
        recentOrders,
        reviewsCount
      }
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/dashboard/order-history
// @desc    Get detailed order history
// @access  Private
router.get('/order-history', auth, async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;
    
    const query = { user: req.userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order
      .find(query)
      .populate('items.product', 'name slug images')
      .sort(sort)
      .limit(Number(limit))
      .skip(skip)
      .lean();
    
    const total = await Order.countDocuments(query);
    
    // Calculate order statistics
    const statistics = await Order.aggregate([
      { $match: { user: req.userId } },
      { $group: {
        _id: null,
        totalSpent: { $sum: '$pricing.total' },
        avgOrderValue: { $avg: '$pricing.total' },
        totalOrders: { $sum: 1 }
      }}
    ]);
    
    res.json({
      success: true,
      orders,
      statistics: statistics[0] || {},
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ message: 'Server error fetching order history' });
  }
});

// @route   GET /api/dashboard/addresses
// @desc    Get saved addresses
// @access  Private
router.get('/addresses', auth, async (req, res) => {
  try {
    const user = await User
      .findById(req.userId)
      .select('address')
      .lean();
    
    // Get addresses from recent orders
    const recentAddresses = await Order
      .find({ user: req.userId })
      .select('shippingAddress')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Remove duplicates and format
    const uniqueAddresses = [];
    const addressSet = new Set();
    
    // Add primary address
    if (user.address && user.address.street) {
      const key = `${user.address.street}-${user.address.city}`;
      if (!addressSet.has(key)) {
        addressSet.add(key);
        uniqueAddresses.push({
          ...user.address,
          isPrimary: true,
          _id: 'primary'
        });
      }
    }
    
    // Add order addresses
    recentAddresses.forEach(order => {
      const addr = order.shippingAddress;
      const key = `${addr.street}-${addr.city}`;
      if (!addressSet.has(key) && uniqueAddresses.length < 5) {
        addressSet.add(key);
        uniqueAddresses.push({
          ...addr,
          isPrimary: false,
          _id: order._id
        });
      }
    });
    
    res.json({
      success: true,
      addresses: uniqueAddresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error fetching addresses' });
  }
});

// @route   GET /api/dashboard/recommendations
// @desc    Get product recommendations based on user history
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    // Get user's order history
    const orders = await Order
      .find({ user: req.userId })
      .select('items.product')
      .lean();
    
    const purchasedProducts = orders.flatMap(order => 
      order.items.map(item => item.product)
    );
    
    // Get categories of purchased products
    const purchasedCategories = await Product
      .find({ _id: { $in: purchasedProducts } })
      .distinct('category');
    
    // Get recommendations based on categories
    const recommendations = await Product
      .find({
        category: { $in: purchasedCategories },
        _id: { $nin: purchasedProducts },
        isActive: true,
        stock: { $gt: 0 }
      })
      .select('name slug price discountPrice images rating category')
      .sort({ 'rating.average': -1, sold: -1 })
      .limit(8)
      .lean();
    
    // If not enough recommendations, add popular products
    if (recommendations.length < 8) {
      const popularProducts = await Product
        .find({
          _id: { $nin: [...purchasedProducts, ...recommendations.map(r => r._id)] },
          isActive: true,
          stock: { $gt: 0 }
        })
        .select('name slug price discountPrice images rating category')
        .sort({ sold: -1, 'rating.average': -1 })
        .limit(8 - recommendations.length)
        .lean();
      
      recommendations.push(...popularProducts);
    }
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching recommendations' });
  }
});

// @route   GET /api/dashboard/reviews
// @desc    Get user's reviews
// @access  Private
router.get('/reviews', auth, async (req, res) => {
  try {
    const reviews = await Review
      .find({ user: req.userId })
      .populate('product', 'name slug images')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   GET /api/dashboard/activity
// @desc    Get user activity timeline
// @access  Private
router.get('/activity', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Get various activities
    const [orders, reviews] = await Promise.all([
      Order
        .find({ user: req.userId })
        .select('orderNumber status createdAt pricing.total')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean(),
      Review
        .find({ user: req.userId })
        .select('product rating createdAt')
        .populate('product', 'name slug')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean()
    ]);
    
    // Combine and sort activities
    const activities = [];
    
    orders.forEach(order => {
      activities.push({
        type: 'order',
        data: order,
        date: order.createdAt,
        description: `Order #${order.orderNumber} - ${order.status}`
      });
    });
    
    reviews.forEach(review => {
      activities.push({
        type: 'review',
        data: review,
        date: review.createdAt,
        description: `Reviewed ${review.product.name} - ${review.rating} stars`
      });
    });
    
    // Sort by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      success: true,
      activities: activities.slice(0, Number(limit))
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error fetching activity' });
  }
});

// @route   POST /api/dashboard/export-data
// @desc    Export user data
// @access  Private
router.post('/export-data', auth, async (req, res) => {
  try {
    const { dataType } = req.body;
    
    let exportData;
    
    switch (dataType) {
      case 'orders':
        exportData = await Order
          .find({ user: req.userId })
          .populate('items.product', 'name')
          .lean();
        break;
        
      case 'profile':
        exportData = await User
          .findById(req.userId)
          .select('-password -resetPasswordToken')
          .lean();
        break;
        
      case 'all':
        const [userData, ordersData, reviewsData] = await Promise.all([
          User.findById(req.userId).select('-password -resetPasswordToken').lean(),
          Order.find({ user: req.userId }).lean(),
          Review.find({ user: req.userId }).lean()
        ]);
        
        exportData = {
          profile: userData,
          orders: ordersData,
          reviews: reviewsData
        };
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid data type' });
    }
    
    res.json({
      success: true,
      data: exportData,
      exportedAt: new Date()
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ message: 'Server error exporting data' });
  }
});

module.exports = router;
