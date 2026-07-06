const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      deliveryType,
      couponCode,
      notes
    } = req.body;
    
    // Validate and calculate order total
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.product}` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }
      
      const itemPrice = product.discountPrice || product.price;
      const itemSubtotal = itemPrice * item.quantity;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        image: product.images[0]?.url || ''
      });
      
      subtotal += itemSubtotal;
    }
    
    // Calculate delivery charges
    const deliveryCharges = subtotal >= 2000 ? 0 : 150; // Free delivery over Rs. 2000
    
    // Calculate total
    const total = subtotal + deliveryCharges;
    
    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || { sameAsShipping: true },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'processing',
        amount: total
      },
      pricing: {
        subtotal,
        deliveryCharges,
        discount: 0,
        tax: 0,
        total
      },
      delivery: {
        type: deliveryType || 'standard'
      },
      notes: {
        customer: notes
      },
      source: 'website',
      userAgent: req.get('user-agent'),
      ipAddress: req.ip
    });
    
    const savedOrder = await order.save();
    console.log('Order saved:', savedOrder._id);
    
    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { 
          $inc: { 
            stock: -item.quantity,
            sold: item.quantity
          }
        }
      );
    }
    
    // Add order to user's orders
    await User.findByIdAndUpdate(
      req.userId,
      { 
        $push: { orders: savedOrder._id },
        $set: { cart: [] } // Clear cart
      }
    );
    
    // Populate order details for response
    await savedOrder.populate('user', 'name email phone');
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Server error creating order' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.userId };
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order
      .find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate('items.product', 'name slug images')
      .lean();
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order
      .findOne({ _id: req.params.id, user: req.userId })
      .populate('items.product', 'name slug images category')
      .populate('user', 'name email phone')
      .lean();
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order can be cancelled
    const nonCancellableStatuses = ['shipped', 'out-for-delivery', 'delivered', 'cancelled'];
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }
    
    // Cancel order
    await order.cancelOrder(reason, req.userId);
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { 
          $inc: { 
            stock: item.quantity,
            sold: -item.quantity
          }
        }
      );
    }
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error cancelling order' });
  }
});

// Admin Routes

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query['payment.status'] = paymentStatus;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    console.log('Fetching admin orders with query:', query);
    
    const orders = await Order
      .find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images sku')
      .lean();
    
    const total = await Order.countDocuments(query);
    
    console.log(`Found ${orders.length} orders out of ${total} total`);
    
    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching orders' });
  }
});

// @route   PUT /api/orders/admin/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, note, trackingNumber, trackingCompany } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update status
    await order.updateDeliveryStatus(status, note, req.userId);
    
    // Update tracking if provided
    if (trackingNumber) {
      order.tracking.number = trackingNumber;
      order.tracking.company = trackingCompany;
      await order.save();
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

// @route   GET /api/orders/admin/stats
// @desc    Get order statistics (Admin)
// @access  Private/Admin
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Get various stats
    const [
      totalOrders,
      todayOrders,
      monthOrders,
      pendingOrders,
      totalRevenue,
      todayRevenue,
      monthRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { 'payment.status': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.aggregate([
        { $match: { 
          'payment.status': 'completed',
          createdAt: { $gte: today }
        }},
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.aggregate([
        { $match: { 
          'payment.status': 'completed',
          createdAt: { $gte: thisMonth }
        }},
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ])
    ]);
    
    res.json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          today: todayOrders,
          thisMonth: monthOrders,
          pending: pendingOrders
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          today: todayRevenue[0]?.total || 0,
          thisMonth: monthRevenue[0]?.total || 0
        }
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

module.exports = router;
