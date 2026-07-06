const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const aiService = require('../services/aiService');
const Product = require('../models/Product');

// @route   POST /api/ai/generate-description
// @desc    Generate product description using AI
// @access  Private/Admin
router.post('/generate-description', adminAuth, async (req, res) => {
  try {
    const { productName, category, specifications } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateProductDescription(
      productName,
      category,
      specifications
    );

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate description',
        error: result.error 
      });
    }

    res.json({
      success: true,
      description: result.content,
      model: result.model,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Generate description error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/generate-seo
// @desc    Generate SEO metadata using AI
// @access  Private/Admin
router.post('/generate-seo', adminAuth, async (req, res) => {
  try {
    const { productName, description, category } = req.body;

    if (!productName || !description || !category) {
      return res.status(400).json({ 
        message: 'Product name, description, and category are required' 
      });
    }

    const result = await aiService.generateSEOMetaData(
      productName,
      description,
      category
    );

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate SEO data',
        error: result.error 
      });
    }

    res.json({
      success: true,
      seo: result.data,
      model: result.model,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Generate SEO error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/generate-features
// @desc    Generate product features using AI
// @access  Private/Admin
router.post('/generate-features', adminAuth, async (req, res) => {
  try {
    const { productName, category, description } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateFeatures(
      productName,
      category,
      description
    );

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate features',
        error: result.error 
      });
    }

    res.json({
      success: true,
      features: result.features,
      model: result.model,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Generate features error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/generate-care-instructions
// @desc    Generate care instructions using AI
// @access  Private/Admin
router.post('/generate-care-instructions', adminAuth, async (req, res) => {
  try {
    const { productName, category, specifications } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateCareInstructions(
      productName,
      category,
      specifications
    );

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate care instructions',
        error: result.error 
      });
    }

    res.json({
      success: true,
      careInstructions: result.content,
      model: result.model,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('Generate care instructions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/generate-complete
// @desc    Generate all AI content for a product at once
// @access  Private/Admin
router.post('/generate-complete', adminAuth, async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.name || !productData.category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateCompleteContent(productData);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate complete content',
        error: result.error 
      });
    }

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Generate complete content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/generate-benefits
// @desc    Generate product benefits using AI
// @access  Private/Admin
router.post('/generate-benefits', adminAuth, async (req, res) => {
  try {
    const { productName, category } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateBenefits(productName, category);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate benefits',
        error: result.error 
      });
    }

    res.json({
      success: true,
      benefits: result.benefits,
      model: result.model
    });
  } catch (error) {
    console.error('Generate benefits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/improve-content
// @desc    Improve existing content using AI
// @access  Private/Admin
router.post('/improve-content', adminAuth, async (req, res) => {
  try {
    const { content, contentType } = req.body;

    if (!content) {
      return res.status(400).json({ 
        message: 'Content is required' 
      });
    }

    const result = await aiService.improveContent(content, contentType);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to improve content',
        error: result.error 
      });
    }

    res.json({
      success: true,
      improvedContent: result.content,
      model: result.model
    });
  } catch (error) {
    console.error('Improve content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ai/product/:id/apply-ai-content
// @desc    Apply AI-generated content to a product
// @access  Private/Admin
router.put('/product/:id/apply-ai-content', adminAuth, async (req, res) => {
  try {
    const { aiContent, fieldsToApply } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Apply selected fields
    if (fieldsToApply.description && aiContent.description) {
      product.description = aiContent.description;
      product.aiGeneratedContent.description = {
        content: aiContent.description,
        generatedAt: new Date(),
        model: 'gpt-4o-mini',
        status: 'approved'
      };
    }

    if (fieldsToApply.seo && aiContent.seo) {
      product.seo = {
        ...product.seo,
        ...aiContent.seo,
        aiGenerated: {
          ...aiContent.seo,
          generatedAt: new Date(),
          approved: true
        }
      };
    }

    if (fieldsToApply.features && aiContent.features) {
      product.features = aiContent.features;
      product.aiGeneratedContent.features = {
        content: aiContent.features,
        generatedAt: new Date(),
        model: 'gpt-4o-mini'
      };
    }

    if (fieldsToApply.benefits && aiContent.benefits) {
      product.benefits = aiContent.benefits;
      product.aiGeneratedContent.benefits = {
        content: aiContent.benefits,
        generatedAt: new Date(),
        model: 'gpt-4o-mini'
      };
    }

    if (fieldsToApply.slug && aiContent.slug) {
      product.slug = aiContent.slug;
    }

    await product.save();

    res.json({
      success: true,
      message: 'AI content applied successfully',
      product
    });
  } catch (error) {
    console.error('Apply AI content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// @route   POST /api/ai/generate-faqs
// @desc    Generate FAQs for product using AI
// @access  Private/Admin
router.post('/generate-faqs', adminAuth, async (req, res) => {
  try {
    const { productName, category, description } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateFAQs(productName, category, description);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate FAQs',
        error: result.error 
      });
    }

    res.json({
      success: true,
      faqs: result.faqs,
      model: result.model
    });
  } catch (error) {
    console.error('Generate FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// @route   POST /api/ai/generate-image
// @desc    Generate single product image using DALL-E
// @access  Private/Admin
router.post('/generate-image', adminAuth, async (req, res) => {
  try {
    const { productName, category, description } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateProductImage(productName, category, description);

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate image',
        error: result.error 
      });
    }

    res.json({
      success: true,
      imageUrl: result.imageUrl,
      prompt: result.prompt
    });
  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/generate-multiple-images
// @desc    Generate multiple product images using DALL-E
// @access  Private/Admin
router.post('/generate-multiple-images', adminAuth, async (req, res) => {
  try {
    const { productName, category, description, count } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ 
        message: 'Product name and category are required' 
      });
    }

    const result = await aiService.generateMultipleImages(
      productName, 
      category, 
      description, 
      count || 1
    );

    if (!result.success) {
      return res.status(500).json({ 
        message: 'Failed to generate images',
        error: result.error 
      });
    }

    res.json({
      success: true,
      images: result.images
    });
  } catch (error) {
    console.error('Generate multiple images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;