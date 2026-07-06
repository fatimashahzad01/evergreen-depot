const Product = require('../models/Product');

// Track product impression
const trackImpression = async (productId) => {
  try {
    await Product.findByIdAndUpdate(
      productId,
      { 
        $inc: { 'analytics.impressions': 1 },
        $set: { 'analytics.lastTracked': new Date() }
      }
    );
  } catch (error) {
    console.error('Track impression error:', error);
  }
};

// Track product click
const trackClick = async (productId) => {
  try {
    await Product.findByIdAndUpdate(
      productId,
      { 
        $inc: { 'analytics.clicks': 1 },
        $set: { 'analytics.lastTracked': new Date() }
      }
    );
  } catch (error) {
    console.error('Track click error:', error);
  }
};

// Track add to cart
const trackAddToCart = async (productId) => {
  try {
    await Product.findByIdAndUpdate(
      productId,
      { 
        $inc: { 'analytics.addToCart': 1 },
        $set: { 'analytics.lastTracked': new Date() }
      }
    );
  } catch (error) {
    console.error('Track add to cart error:', error);
  }
};

// Track purchase
const trackPurchase = async (productId) => {
  try {
    await Product.findByIdAndUpdate(
      productId,
      { 
        $inc: { 'analytics.purchases': 1 },
        $set: { 'analytics.lastTracked': new Date() }
      }
    );
  } catch (error) {
    console.error('Track purchase error:', error);
  }
};

// Get analytics data for product
const getProductAnalytics = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId)
      .select('name analytics views sold');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const conversionRate = product.analytics.clicks > 0 
      ? ((product.analytics.purchases / product.analytics.clicks) * 100).toFixed(2)
      : 0;

    const cartConversionRate = product.analytics.addToCart > 0
      ? ((product.analytics.purchases / product.analytics.addToCart) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      analytics: {
        productName: product.name,
        impressions: product.analytics.impressions || 0,
        clicks: product.analytics.clicks || 0,
        addToCart: product.analytics.addToCart || 0,
        purchases: product.analytics.purchases || 0,
        views: product.views || 0,
        sold: product.sold || 0,
        conversionRate: `${conversionRate}%`,
        cartConversionRate: `${cartConversionRate}%`,
        lastTracked: product.analytics.lastTracked
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  trackImpression,
  trackClick,
  trackAddToCart,
  trackPurchase,
  getProductAnalytics
};