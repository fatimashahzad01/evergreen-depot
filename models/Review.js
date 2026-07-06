const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  pros: [String],
  cons: [String],
  images: [{
    url: String,
    publicId: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  reported: {
    isReported: {
      type: Boolean,
      default: false
    },
    reason: String,
    reportedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  adminResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNotes: String,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });

// Check if user purchased the product
reviewSchema.pre('save', async function(next) {
  if (!this.isVerifiedPurchase && this.order) {
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.order);
    
    if (order && order.user.toString() === this.user.toString() && 
        order.status === 'delivered') {
      const productInOrder = order.items.some(item => 
        item.product.toString() === this.product.toString()
      );
      this.isVerifiedPurchase = productInOrder;
    }
  }
  next();
});

// Update product rating after save
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const reviews = await this.constructor.find({ 
    product: this.product, 
    status: 'approved' 
  });
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  
  await Product.findByIdAndUpdate(this.product, {
    'rating.average': Math.round(averageRating * 10) / 10,
    'rating.count': reviews.length
  });
});

// Method to mark review as helpful
reviewSchema.methods.markAsHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
  }
  return this.save();
};

// Method to report review
reviewSchema.methods.reportReview = function(userId, reason) {
  if (!this.reported.reportedBy.includes(userId)) {
    this.reported.reportedBy.push(userId);
    this.reported.isReported = true;
    this.reported.reason = reason;
  }
  return this.save();
};

module.exports = mongoose.model('Review', reviewSchema);
