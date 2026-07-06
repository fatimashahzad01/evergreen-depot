const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { adminAuth } = require('../middleware/auth');

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Get comprehensive statistics
    const [
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      todayOrders,
      totalRevenue,
      monthRevenue,
      topSellingProducts,
      recentOrders,
      ordersByStatus,
      salesByCategory
    ] = await Promise.all([
      // Users
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ 
        role: 'customer',
        createdAt: { $gte: today } 
      }),
      User.countDocuments({ 
        role: 'customer',
        createdAt: { $gte: thisWeek } 
      }),
      
      // Products
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),
      
      // Orders
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      
      // Revenue
      Order.aggregate([
        { $match: { 'payment.status': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.aggregate([
        { $match: { 
          'payment.status': 'completed',
          createdAt: { $gte: thisMonth }
        }},
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      
      // Top selling products
      Product
        .find({ isActive: true })
        .sort({ sold: -1 })
        .limit(5)
        .select('name slug sold price images'),
        
      // Recent orders
      Order
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .select('orderNumber status pricing.total createdAt'),
        
      // Orders by status
      Order.aggregate([
        { $group: { 
          _id: '$status', 
          count: { $sum: 1 }
        }}
      ]),
      
      // Sales by category
      Order.aggregate([
        { $unwind: '$items' },
        { $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }},
        { $unwind: '$product' },
        { $group: {
          _id: '$product.category',
          total: { $sum: '$items.subtotal' },
          count: { $sum: '$items.quantity' }
        }},
        { $sort: { total: -1 } }
      ])
    ]);
    
    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          today: todayOrders
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: monthRevenue[0]?.total || 0
        },
        topSellingProducts,
        recentOrders,
        ordersByStatus,
        salesByCategory
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User
      .find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .lean();
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user status/role
// @access  Private/Admin
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { isActive, role } = req.body;
    
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role) updates.role = role;
    
    const user = await User
      .findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      )
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews
// @access  Private/Admin
router.get('/reviews', adminAuth, async (req, res) => {
  try {
    const { status, rating, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (rating) {
      query.rating = Number(rating);
    }
    
    const skip = (page - 1) * limit;
    
    const reviews = await Review
      .find(query)
      .populate('product', 'name slug')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .lean();
    
    const total = await Review.countDocuments(query);
    
    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   PUT /api/admin/reviews/:id
// @desc    Approve/reject review
// @access  Private/Admin
router.put('/reviews/:id', adminAuth, async (req, res) => {
  try {
    const { status, moderationNotes, featured } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status,
          moderationNotes,
          featured: featured || false
        }
      },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error updating review' });
  }
});

// @route   GET /api/admin/reports/sales
// @desc    Get sales report
// @access  Private/Admin
router.get('/reports/sales', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const matchQuery = {
      'payment.status': 'completed'
    };
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }
    
    // Determine date format based on grouping
    let dateFormat;
    switch (groupBy) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-W%V';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'year':
        dateFormat = '%Y';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }
    
    const salesData = await Order.aggregate([
      { $match: matchQuery },
      { $group: {
        _id: { 
          $dateToString: { 
            format: dateFormat, 
            date: '$createdAt' 
          }
        },
        totalSales: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: '$pricing.total' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      salesData
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({ message: 'Server error fetching sales report' });
  }
});

// @route   GET /api/admin/reports/inventory
// @desc    Get inventory report
// @access  Private/Admin
router.get('/reports/inventory', adminAuth, async (req, res) => {
  try {
    const inventoryData = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        avgPrice: { $avg: '$price' },
        totalValue: { $sum: { $multiply: ['$stock', '$price'] } },
        lowStock: {
          $sum: {
            $cond: [{ $lt: ['$stock', 10] }, 1, 0]
          }
        },
        outOfStock: {
          $sum: {
            $cond: [{ $eq: ['$stock', 0] }, 1, 0]
          }
        }
      }},
      { $sort: { totalValue: -1 } }
    ]);
    
    const summary = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        totalValue: { $sum: { $multiply: ['$stock', '$price'] } },
        avgPrice: { $avg: '$price' }
      }}
    ]);
    
    res.json({
      success: true,
      inventoryData,
      summary: summary[0] || {}
    });
  } catch (error) {
    console.error('Get inventory report error:', error);
    res.status(500).json({ message: 'Server error fetching inventory report' });
  }
});

module.exports = router;
