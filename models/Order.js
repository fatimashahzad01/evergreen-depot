const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: Number,
    image: String
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    postalCode: String,
    country: {
      type: String,
      default: 'Pakistan'
    },
    landmark: String,
    deliveryInstructions: String
  },
  billingAddress: {
    sameAsShipping: {
      type: Boolean,
      default: true
    },
    fullName: String,
    phone: String,
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: String
  },
  payment: {
    method: {
      type: String,
      enum: ['cod', 'jazzcash', 'easypaisa', 'bank-transfer', 'card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    amount: Number
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    deliveryCharges: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 
           'out-for-delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tracking: {
    company: String,
    number: String,
    url: String,
    estimatedDelivery: Date
  },
  delivery: {
    type: {
      type: String,
      enum: ['standard', 'express', 'same-day'],
      default: 'standard'
    },
    date: Date,
    time: String,
    deliveredAt: Date,
    deliveredBy: String,
    signature: String,
    photo: String
  },
  notes: {
    customer: String,
    admin: String,
    delivery: String
  },
  couponCode: String,
  source: {
    type: String,
    enum: ['website', 'mobile', 'phone', 'whatsapp', 'facebook', 'instagram'],
    default: 'website'
  },
  userAgent: String,
  ipAddress: String,
  refundReason: String,
  refundAmount: Number,
  refundDate: Date,
  cancelReason: String,
  cancelDate: Date,
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.city': 1 });

// Generate orderNumber before validation
orderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    this.orderNumber = `EDM${year}${month}${day}${random}`;
  }
  next();
});

orderSchema.pre('save', async function(next) {
  // Calculate subtotal for each item
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  
  // Add to status history if status changed
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      note: `Order status updated to ${this.status}`
    });
  }
  
  next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  const diff = Date.now() - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
});

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, userId) {
  this.status = 'cancelled';
  this.cancelReason = reason;
  this.cancelDate = new Date();
  this.statusHistory.push({
    status: 'cancelled',
    date: new Date(),
    note: `Order cancelled: ${reason}`,
    updatedBy: userId
  });
  return this.save();
};

// Method to update delivery status
orderSchema.methods.updateDeliveryStatus = function(status, note, userId) {
  this.status = status;
  if (status === 'delivered') {
    this.delivery.deliveredAt = new Date();
    this.payment.status = 'completed';
  }
  this.statusHistory.push({
    status,
    date: new Date(),
    note,
    updatedBy: userId
  });
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);