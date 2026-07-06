const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, adminAuth } = require('../middleware/auth');
const aiService = require('../services/aiService');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'blogs' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// @route   GET /api/blogs
// @desc    Get all published blogs (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Don't send full content in list

    const count = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/admin
// @desc    Get all blogs (admin)
// @access  Private/Admin
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json({ blogs });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create new blog
// @access  Private/Admin
router.post('/', adminAuth, upload.single('featuredImage'), async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      seo,
      aiGenerated,
      isPublished
    } = req.body;

    // Generate slug from title
    const slugify = require('slugify');
    const baseSlug = slugify(title, { lower: true, strict: true });
    const timestamp = Date.now().toString().slice(-6);
    const slug = `${baseSlug}-${timestamp}`;

    // Upload featured image if provided
    let featuredImage = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      featuredImage = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    // Parse JSON fields
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    const parsedSeo = typeof seo === 'string' ? JSON.parse(seo) : seo;

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      category,
      tags: parsedTags || [],
      seo: parsedSeo || {},
      featuredImage,
      author: req.user.id,
      aiGenerated: aiGenerated === 'true' || aiGenerated === true,
      isPublished: isPublished !== 'false' && isPublished !== false
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Private/Admin
router.put('/:id', adminAuth, upload.single('featuredImage'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      seo,
      isPublished
    } = req.body;

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (tags) blog.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    if (seo) blog.seo = typeof seo === 'string' ? JSON.parse(seo) : seo;
    if (isPublished !== undefined) blog.isPublished = isPublished !== 'false' && isPublished !== false;

    // Update slug if title changed
    if (title && title !== blog.title) {
      const slugify = require('slugify');
      const baseSlug = slugify(title, { lower: true, strict: true });
      const timestamp = Date.now().toString().slice(-6);
      blog.slug = `${baseSlug}-${timestamp}`;
    }

    // Upload new featured image if provided
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (blog.featuredImage && blog.featuredImage.publicId) {
        await cloudinary.uploader.destroy(blog.featuredImage.publicId);
      }

      const result = await uploadToCloudinary(req.file.buffer);
      blog.featuredImage = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    await blog.save();

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete featured image from Cloudinary if exists
    if (blog.featuredImage && blog.featuredImage.publicId) {
      await cloudinary.uploader.destroy(blog.featuredImage.publicId);
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============= AI GENERATION ROUTES =============

// @route   POST /api/blogs/ai/generate-titles
// @desc    Generate blog title suggestions
// @access  Private/Admin
router.post('/ai/generate-titles', adminAuth, async (req, res) => {
  try {
    const { topic, count = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const result = await aiService.generateBlogTitles(topic, count);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to generate titles', error: result.error });
    }

    res.json({
      success: true,
      titles: result.titles
    });
  } catch (error) {
    console.error('Generate titles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/ai/generate-content
// @desc    Generate blog content
// @access  Private/Admin
router.post('/ai/generate-content', adminAuth, async (req, res) => {
  try {
    const { title, category, keywords = [] } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const result = await aiService.generateBlogPost(title, category, keywords);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to generate content', error: result.error });
    }

    res.json({
      success: true,
      content: result.content,
      model: result.model
    });
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/ai/generate-complete
// @desc    Generate complete blog post with all metadata
// @access  Private/Admin
router.post('/ai/generate-complete', adminAuth, async (req, res) => {
  try {
    const { topic, category = 'plant-care' } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const result = await aiService.generateCompleteBlogPost(topic, category);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to generate blog post', error: result.error });
    }

    res.json({
      success: true,
      blog: result.data
    });
  } catch (error) {
    console.error('Generate complete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/ai/generate-excerpt
// @desc    Generate blog excerpt
// @access  Private/Admin
router.post('/ai/generate-excerpt', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const result = await aiService.generateBlogExcerpt(title, content);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to generate excerpt', error: result.error });
    }

    res.json({
      success: true,
      excerpt: result.excerpt
    });
  } catch (error) {
    console.error('Generate excerpt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/ai/generate-tags
// @desc    Generate blog tags
// @access  Private/Admin
router.post('/ai/generate-tags', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const result = await aiService.generateBlogTags(title, content);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to generate tags', error: result.error });
    }

    res.json({
      success: true,
      tags: result.tags
    });
  } catch (error) {
    console.error('Generate tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/ai/generate-seo
// @desc    Generate blog SEO metadata
// @access  Private/Admin
router.post('/ai/generate-seo', adminAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const result = await aiService.generateBlogSEO(title, content);

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to generate SEO', error: result.error });
    }

    res.json({
      success: true,
      seo: result.seo
    });
  } catch (error) {
    console.error('Generate SEO error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;