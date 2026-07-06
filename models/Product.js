const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  nameUrdu: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 160
  },
  
  // ========== NEW: AI Generated Content ==========
  aiGeneratedContent: {
    description: {
      content: String,
      generatedAt: Date,
      model: String,
      status: {
        type: String,
        enum: ['pending', 'generated', 'approved', 'rejected'],
        default: 'pending'
      }
    },
    features: {
      content: [String],
      generatedAt: Date,
      model: String
    },
    benefits: {
      content: [String],
      generatedAt: Date,
      model: String
    },
    careInstructions: {
      content: String,
      generatedAt: Date,
      model: String
    }
  },
  
  category: {
    type: String,
    required: true,
    enum: ['indoor-plants', 'outdoor-plants', 'flowering-plants', 'succulents', 
           'herbs', 'trees', 'seeds', 'planters', 'tools', 'fertilizers']
  },
  subcategory: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    altText: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  features: [String],
  specifications: {
    scientificName: String,
    sunlight: {
      type: String,
      enum: ['full-sun', 'partial-sun', 'shade', 'indirect-light']
    },
    watering: {
      type: String,
      enum: ['daily', 'twice-weekly', 'weekly', 'bi-weekly', 'monthly']
    },
    height: String,
    spread: String,
    potSize: String,
    soilType: String,
    temperature: String,
    humidity: String,
    growthRate: String,
    lifespan: String,
    origin: String
  },
  careInstructions: {
    watering: String,
    light: String,
    temperature: String,
    fertilizing: String,
    pruning: String,
    repotting: String,
    propagation: String
  },
  benefits: [String],
  faqs: [{
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  aiGenerated: {
    type: Boolean,
    default: false
  }
}],
  tags: [String],
  
  // ========== ENHANCED SEO FIELDS ==========
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    metaKeywords: [String],
    focusKeyword: String,
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterCard: {
      type: String,
      default: 'summary_large_image'
    },
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    
    // AI Generated SEO
    aiGenerated: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      generatedAt: Date,
      approved: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // ========== JSON-LD STRUCTURED DATA ==========
  structuredData: {
    type: {
      type: String,
      default: 'Product'
    },
    brand: String,
    gtin: String,
    mpn: String,
    aggregateRating: {
      ratingValue: Number,
      reviewCount: Number
    },
    offers: {
      price: Number,
      priceCurrency: String,
      availability: String,
      url: String,
      seller: {
        name: String,
        url: String
      }
    },
    customData: mongoose.Schema.Types.Mixed
  },
  
  // Keep existing fields
  metaTitle: {
    type: String,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  metaKeywords: [String],
  
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  sold: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availableInCities: {
    type: [String],
    default: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
              'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot']
  },
  deliveryTime: {
    type: String,
    default: '2-3 business days'
  },
  deliveryCharges: {
    type: Number,
    default: 150
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1
  },
  maximumOrderQuantity: {
    type: Number,
    default: 10
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  vendor: {
    name: String,
    contact: String,
    location: String
  },
  
  // ========== ANALYTICS TRACKING ==========
  analytics: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    addToCart: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    },
    lastTracked: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ 'seo.focusKeyword': 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for current price (considering discount)
productSchema.virtual('currentPrice').get(function() {
  return this.discountPrice || this.price;
});

// Virtual for availability status
productSchema.virtual('availabilityStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= 5) return 'limited-stock';
  return 'in-stock';
});

// Virtual for JSON-LD
productSchema.virtual('jsonLD').get(function() {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": this.name,
    "description": this.shortDescription || this.description,
    "image": this.images.length > 0 ? this.images[0].url : '',
    "sku": this.sku,
    "brand": {
      "@type": "Brand",
      "name": this.structuredData?.brand || "Evergreen Depot"
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.SITE_URL}/products/${this.slug}`,
      "priceCurrency": this.currency,
      "price": this.currentPrice,
      "availability": this.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Evergreen Depot Market"
      }
    },
    "aggregateRating": this.rating.count > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": this.rating.average,
      "reviewCount": this.rating.count
    } : undefined
  };
});

// Method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'decrease') {
  if (operation === 'decrease') {
    this.stock = Math.max(0, this.stock - quantity);
    this.sold += quantity;
  } else {
    this.stock += quantity;
  }
  return this.save();
};

// Method to increment views
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to generate SEO-friendly slug
productSchema.methods.generateSlug = function() {
  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  if (this.isNew) {
    this.slug = `${baseSlug}-${Date.now()}`;
  } else {
    this.slug = baseSlug;
  }
};

// Pre-validate middleware to generate slug and SEO fields
productSchema.pre('validate', function(next) {
  // Generate slug if not exists
  if (!this.slug && this.name) {
    this.generateSlug();
  }

  // Auto-generate shortDescription from description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 157) + '...';
  }

  // Set meta fields if not provided
  if (!this.metaTitle && this.name) {
    this.metaTitle = `${this.name} - Evergreen Depot Market`;
  }
  
  if (!this.metaDescription && this.category) {
    this.metaDescription = this.shortDescription ||
      `Buy ${this.name} online at best prices in Pakistan. ${this.category.replace('-', ' ')} available with fast delivery.`;
  }

  // Initialize SEO object if doesn't exist
  if (!this.seo) {
    this.seo = {};
  }

  // Sync old meta fields with new seo object
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.metaTitle;
  }
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.metaDescription;
  }
  if (!this.seo.metaKeywords || this.seo.metaKeywords.length === 0) {
    this.seo.metaKeywords = this.metaKeywords || [];
  }

  // Set structured data
  if (!this.structuredData) {
    this.structuredData = {};
  }
  if (!this.structuredData.brand) {
    this.structuredData.brand = 'Evergreen Depot';
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);