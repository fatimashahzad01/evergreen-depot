const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
      featured,
      inStock,
      city
    } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    
    if (city) {
      query.availableInCities = city;
    }
    
    // Build sort
    let sortOptions = {};
    switch (sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { sold: -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const products = await Product
      .find(query)
      .select('-reviews')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip)
      .lean();
    
    // Get total count
    const total = await Product.countDocuments(query);
    
    // Add to user's recently viewed if authenticated
    if (req.user && products.length > 0) {
      // This could be implemented as a separate collection
    }
    
    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product
      .find({ featured: true, isActive: true, stock: { $gt: 0 } })
      .select('name slug price discountPrice images category rating')
      .limit(8)
      .lean();
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/categories
// @desc    Get all categories with count
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }},
      { $sort: { count: -1 } }
    ]);
    
    const categoryInfo = categories.map(cat => ({
      name: cat._id,
      displayName: cat._id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: cat.count,
      avgPrice: Math.round(cat.avgPrice)
    }));
    
    res.json({
      success: true,
      categories: categoryInfo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug with SEO data
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await Product
      .findOne({ slug: req.params.slug, isActive: true })
      .populate('relatedProducts', 'name slug price discountPrice images category rating')
      .populate({
        path: 'reviews',
        match: { status: 'approved' },
        populate: {
          path: 'user',
          select: 'name profileImage'
        },
        options: { limit: 5, sort: { createdAt: -1 } }
      })
      .lean();
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Increment views
    await Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } });
    
    // Get related products if not already populated
    if (!product.relatedProducts || product.relatedProducts.length === 0) {
      const related = await Product
        .find({
          category: product.category,
          _id: { $ne: product._id },
          isActive: true
        })
        .select('name slug price discountPrice images rating')
        .limit(4)
        .lean();
      
      product.relatedProducts = related;
    }

    // Generate JSON-LD structured data
    const { generateProductJsonLD, generateBreadcrumbJsonLD } = require('../middleware/seo');
    
    const jsonLD = {
      product: generateProductJsonLD(product, req),
      breadcrumb: generateBreadcrumbJsonLD(product)
    };

    // Generate meta tags
    const metaTags = {
      title: product.seo?.metaTitle || product.metaTitle || `${product.name} - Evergreen Depot Market`,
      description: product.seo?.metaDescription || product.metaDescription || product.shortDescription,
      keywords: product.seo?.metaKeywords || product.metaKeywords || [],
      canonical: `${process.env.SITE_URL}/products/${product.slug}`,
      
      // Open Graph tags
      ogTitle: product.seo?.ogTitle || product.name,
      ogDescription: product.seo?.ogDescription || product.shortDescription,
      ogImage: product.images && product.images.length > 0 ? product.images[0].url : '',
      ogUrl: `${process.env.SITE_URL}/products/${product.slug}`,
      ogType: 'product',
      
      // Twitter Card tags
      twitterCard: product.seo?.twitterCard || 'summary_large_image',
      twitterTitle: product.seo?.twitterTitle || product.name,
      twitterDescription: product.seo?.twitterDescription || product.shortDescription,
      twitterImage: product.images && product.images.length > 0 ? product.images[0].url : ''
    };
    
    res.json({
      success: true,
      product,
      seo: {
        metaTags,
        jsonLD
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const productData = req.body;
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => 
        uploadToCloudinary(file, 'products').then(result => ({
          url: result.url,
          publicId: result.publicId,
          altText: `${productData.name} - Image ${index + 1}`,
          isPrimary: index === 0
        }))
      );
      
      productData.images = await Promise.all(imagePromises);
    }
    
    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = `EDM-${Date.now()}`;
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updates = req.body;
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => 
        uploadToCloudinary(file, 'products').then(result => ({
          url: result.url,
          publicId: result.publicId,
          altText: `${updates.name || product.name} - Image`,
          isPrimary: false
        }))
      );
      
      const newImages = await Promise.all(imagePromises);
      updates.images = [...(product.images || []), ...newImages];
    }
    
    // Update product
    Object.keys(updates).forEach(key => {
      product[key] = updates[key];
    });
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(img => deleteFromCloudinary(img.publicId))
      );
    }
    
    // Soft delete (set inactive) instead of hard delete
    product.isActive = false;
    await product.save();
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, title, comment, orderId } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: product._id,
      user: req.userId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    const review = new Review({
      product: product._id,
      user: req.userId,
      order: orderId,
      rating,
      title,
      comment,
      status: 'approved' // Auto-approve for now
    });
    
    await review.save();
    
    // Add review to product
    product.reviews.push(review._id);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

module.exports = router;
