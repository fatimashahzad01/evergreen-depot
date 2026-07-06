const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featuredImage: {
    url: String,
    publicId: String
  },
  category: {
    type: String,
    enum: ['plant-care', 'gardening-tips', 'indoor-plants', 'outdoor-plants', 'plant-guides', 'news', 'diy'],
    default: 'plant-care'
  },
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    focusKeyword: String
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search and SEO
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);