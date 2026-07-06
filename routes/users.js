const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User
      .findById(req.userId)
      .select('-password')
      .populate('wishlist', 'name slug price images')
      .populate('cart.product', 'name slug price discountPrice images stock')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'address'];
    
    // Filter out non-allowed updates
    const filteredUpdates = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });
    
    // Handle profile image upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'profiles');
      filteredUpdates.profileImage = result.url;
    }
    
    const user = await User
      .findByIdAndUpdate(
        req.userId,
        { $set: filteredUpdates },
        { new: true, runValidators: true }
      )
      .select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.userId);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// @route   POST /api/users/cart
// @desc    Add item to cart
// @access  Private
router.post('/cart', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists and has stock
    const product = await Product.findById(productId);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    const user = await User.findById(req.userId);
    
    // Check if product already in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );
    
    if (cartItemIndex > -1) {
      // Update quantity
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity,
        addedAt: new Date()
      });
    }
    
    await user.save();
    
    // Populate cart for response
    await user.populate('cart.product', 'name slug price discountPrice images stock');
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
});

// @route   PUT /api/users/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/cart/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    // Check product stock
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    const user = await User.findById(req.userId);
    
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );
    
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart' });
    }
    
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();
    
    await user.populate('cart.product', 'name slug price discountPrice images stock');
    
    res.json({
      success: true,
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
});

// @route   DELETE /api/users/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/cart/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.userId);
    
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );
    
    await user.save();
    
    await user.populate('cart.product', 'name slug price discountPrice images stock');
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing from cart' });
  }
});

// @route   DELETE /api/users/cart
// @desc    Clear cart
// @access  Private
router.delete('/cart', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.userId,
      { $set: { cart: [] } }
    );
    
    res.json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
});

// @route   POST /api/users/wishlist/:productId
// @desc    Add/remove from wishlist
// @access  Private
router.post('/wishlist/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const user = await User.findById(req.userId);
    
    const wishlistIndex = user.wishlist.indexOf(productId);
    
    if (wishlistIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(wishlistIndex, 1);
      await user.save();
      
      res.json({
        success: true,
        message: 'Removed from wishlist',
        inWishlist: false
      });
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      await user.save();
      
      res.json({
        success: true,
        message: 'Added to wishlist',
        inWishlist: true
      });
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({ message: 'Server error updating wishlist' });
  }
});

// @route   GET /api/users/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User
      .findById(req.userId)
      .populate('wishlist', 'name slug price discountPrice images rating stock')
      .lean();
    
    res.json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
});

module.exports = router;
