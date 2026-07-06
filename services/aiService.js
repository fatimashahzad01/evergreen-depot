const fetch = require('node-fetch');

class AIService {
  
  // Call Groq API
  async callGroqAPI(prompt, maxTokens = 300) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: maxTokens
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Groq API error');
      }

      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  }
  
  // Generate product description
  async generateProductDescription(productName, category, specifications = {}) {
    try {
      const prompt = `Write a compelling 150-200 word SEO-optimized product description for an e-commerce plant store in Pakistan.

Product: ${productName}
Category: ${category}

Write naturally and include:
- Benefits and features
- Care tips
- Why customers should buy
- Mention "Pakistan" and "delivery"

Write ONLY the description, no extra text:`;

      const content = await this.callGroqAPI(prompt, 350);

      return {
        success: true,
        content: content.trim(),
        model: 'Mixtral-8x7B (Groq)',
        tokensUsed: 0
      };
    } catch (error) {
      console.error('AI Description Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate SEO metadata
  async generateSEOMetaData(productName, description, category) {
    try {
      const prompt = `Generate SEO metadata for this product:
Product: ${productName}
Category: ${category}

Return ONLY valid JSON (no markdown, no extra text):
{
  "metaTitle": "60 char max, include 'Buy' and 'Pakistan'",
  "metaDescription": "155 char max, compelling with CTA",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "focusKeyword": "main keyword"
}`;

      const content = await this.callGroqAPI(prompt, 200);
      
      let result;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        result = {
          metaTitle: `Buy ${productName} Online in Pakistan | Evergreen Depot`,
          metaDescription: `Shop premium ${productName} in Pakistan. High quality ${category.replace(/-/g, ' ')} with fast delivery. Order now!`.substring(0, 155),
          keywords: [productName, category.replace(/-/g, ' '), 'Pakistan', 'buy online', 'plants'],
          focusKeyword: productName
        };
      }
      
      return {
        success: true,
        data: result,
        model: 'Mixtral-8x7B (Groq)',
        tokensUsed: 0
      };
    } catch (error) {
      console.error('AI SEO Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate features
  async generateFeatures(productName, category, description) {
    try {
      const prompt = `Generate 6 product features for ${productName} (${category}).

Return ONLY valid JSON array (no markdown, no extra text):
["Feature 1 (5-8 words)", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6"]`;

      const content = await this.callGroqAPI(prompt, 200);
      
      let features;
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        features = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        features = [
          'Air purifying properties',
          'Low maintenance care required',
          'Perfect for indoor spaces',
          'Enhances home decor naturally',
          'Fast delivery across Pakistan',
          'Healthy and thriving plants'
        ];
      }
      
      return {
        success: true,
        features: features,
        model: 'Mixtral-8x7B (Groq)',
        tokensUsed: 0
      };
    } catch (error) {
      console.error('AI Features Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate benefits
  async generateBenefits(productName, category) {
    try {
      const prompt = `Generate 5 customer benefits for buying ${productName}.

Return ONLY valid JSON array (no markdown, no extra text):
["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"]`;

      const content = await this.callGroqAPI(prompt, 200);
      
      let benefits;
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        benefits = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        benefits = [
          'Improves indoor air quality',
          'Reduces stress and anxiety',
          'Easy to care for beginners',
          'Adds natural beauty to your space',
          'Long-lasting with proper care'
        ];
      }
      
      return {
        success: true,
        benefits: benefits,
        model: 'Mixtral-8x7B (Groq)'
      };
    } catch (error) {
      console.error('AI Benefits Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate FAQs
  async generateFAQs(productName, category, description) {
    try {
      const prompt = `Generate 5 FAQ pairs for ${productName} (${category}).

Return ONLY valid JSON (no markdown, no extra text):
{
  "faqs": [
    {"question": "How do I care for this plant?", "answer": "2-3 sentences"},
    {"question": "Question 2", "answer": "Answer 2"},
    {"question": "Question 3", "answer": "Answer 3"},
    {"question": "Question 4", "answer": "Answer 4"},
    {"question": "Question 5", "answer": "Answer 5"}
  ]
}`;

      const content = await this.callGroqAPI(prompt, 500);
      
      let result;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        result = {
          faqs: [
            {
              question: `How do I care for ${productName}?`,
              answer: 'Water when soil is dry, provide appropriate light, and maintain moderate humidity. Detailed care instructions included.'
            },
            {
              question: 'How is it shipped?',
              answer: 'Carefully packaged with protective materials. Shipped within 2-3 business days across Pakistan.'
            },
            {
              question: 'What size will I receive?',
              answer: 'Size mentioned in description. All plants are healthy and well-established.'
            },
            {
              question: 'Do you deliver across Pakistan?',
              answer: 'Yes! We deliver to all major cities including Karachi, Lahore, Islamabad, and more.'
            },
            {
              question: 'What if it arrives damaged?',
              answer: 'Contact us within 24 hours with photos for prompt resolution.'
            }
          ]
        };
      }
      
      return {
        success: true,
        faqs: result.faqs || [],
        model: 'Mixtral-8x7B (Groq)'
      };
    } catch (error) {
      console.error('AI FAQs Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate slug
  async generateSlug(productName) {
    try {
      const slugify = require('slugify');
      
      const slug = slugify(productName, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });

      const timestamp = Date.now().toString().slice(-6);
      const finalSlug = `${slug}-${timestamp}`;

      return {
        success: true,
        slug: finalSlug
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate complete content
  async generateCompleteContent(productData) {
    try {
      const results = {};

      const description = await this.generateProductDescription(
        productData.name,
        productData.category,
        productData.specifications
      );
      if (description.success) {
        results.description = description.content;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const seoData = await this.generateSEOMetaData(
        productData.name,
        results.description || productData.description,
        productData.category
      );
      if (seoData.success) {
        results.seo = seoData.data;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const features = await this.generateFeatures(
        productData.name,
        productData.category,
        results.description || productData.description
      );
      if (features.success) {
        results.features = features.features;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const benefits = await this.generateBenefits(
        productData.name,
        productData.category
      );
      if (benefits.success) {
        results.benefits = benefits.benefits;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const faqs = await this.generateFAQs(
        productData.name,
        productData.category,
        results.description || productData.description
      );
      if (faqs.success) {
        results.faqs = faqs.faqs;
      }

      const slug = await this.generateSlug(productData.name);
      if (slug.success) {
        results.slug = slug.slug;
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('AI Complete Content Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate product image using Pollinations.ai (100% FREE!)
  async generateProductImage(productName, category, description) {
    try {
      const prompt = encodeURIComponent(`Professional product photography of ${productName}, ${category.replace(/-/g, ' ')}, high quality, well lit, white background, centered, commercial photography, 4k`);
      
      const seed = Math.floor(Math.random() * 100000);
      const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&model=flux&seed=${seed}&nologo=true`;

      return {
        success: true,
        imageUrl: imageUrl,
        prompt: decodeURIComponent(prompt)
      };
    } catch (error) {
      console.error('AI Image Generation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate multiple images
  async generateMultipleImages(productName, category, description, count = 1) {
    try {
      const images = [];
      
      const variations = [
        'front view, professional product photography',
        'side angle view, professional product photography',
        'top view with details, professional product photography'
      ];
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const prompt = encodeURIComponent(`Professional product photography of ${productName}, ${variations[i]}, ${category.replace(/-/g, ' ')}, high quality, well lit, white background, centered, commercial photography, 4k`);
        
        const seed = Math.floor(Math.random() * 100000) + i * 1000;
        const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&model=flux&seed=${seed}&nologo=true`;

        images.push({
          url: imageUrl,
          prompt: decodeURIComponent(prompt),
          view: variations[i]
        });
      }

      return {
        success: true,
        images: images
      };
    } catch (error) {
      console.error('AI Multiple Images Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Improve content
  async improveContent(originalContent, contentType = 'description') {
    try {
      return {
        success: true,
        content: originalContent,
        model: 'Original'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  // Generate blog post
  async generateBlogPost(title, category, keywords = []) {
    try {
      const prompt = `Write a comprehensive, SEO-optimized blog post for a plant e-commerce website in Pakistan.

Title: ${title}
Category: ${category}
Keywords: ${keywords.join(', ')}

Write a 800-1000 word blog post that:
- Starts with an engaging introduction
- Uses clear headings and subheadings
- Provides actionable tips and advice
- Includes benefits and practical examples
- Ends with a conclusion
- Mentions Pakistan context where relevant
- Is informative and helpful for plant lovers

Write ONLY the blog content in HTML format with <h2>, <h3>, <p>, <ul>, <li> tags:`;

      const content = await this.callGroqAPI(prompt, 2000);

      return {
        success: true,
        content: content.trim(),
        model: 'Llama-3.3-70B (Groq)'
      };
    } catch (error) {
      console.error('AI Blog Generation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate blog title suggestions
  async generateBlogTitles(topic, count = 5) {
    try {
      const prompt = `Generate ${count} catchy, SEO-friendly blog post titles about: ${topic}

Make them:
- Engaging and click-worthy
- Include keywords naturally
- 50-60 characters long
- Relevant to plant lovers in Pakistan

Return ONLY a JSON array (no markdown):
["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]`;

      const content = await this.callGroqAPI(prompt, 300);
      
      let titles;
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        titles = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch {
        titles = [
          `${topic} - Complete Guide for Pakistani Gardeners`,
          `How to ${topic} - Expert Tips and Tricks`,
          `${topic}: Everything You Need to Know`,
          `Best Practices for ${topic} in Pakistan`,
          `${topic} Made Easy - Beginner's Guide`
        ];
      }
      
      return {
        success: true,
        titles: titles
      };
    } catch (error) {
      console.error('AI Blog Titles Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate blog excerpt
  async generateBlogExcerpt(title, content) {
    try {
      const prompt = `Create a compelling 2-3 sentence excerpt (max 200 characters) for this blog post:

Title: ${title}
Content: ${content.substring(0, 500)}...

Make it engaging and encourage people to read more. Return ONLY the excerpt:`;

      const excerpt = await this.callGroqAPI(prompt, 100);

      return {
        success: true,
        excerpt: excerpt.trim().substring(0, 300)
      };
    } catch (error) {
      console.error('AI Blog Excerpt Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate blog tags
  async generateBlogTags(title, content) {
    try {
      const prompt = `Generate 5-7 relevant tags for this blog post:

Title: ${title}
Content: ${content.substring(0, 300)}

Return ONLY a JSON array (no markdown):
["tag1", "tag2", "tag3", "tag4", "tag5"]`;

      const response = await this.callGroqAPI(prompt, 150);
      
      let tags;
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        tags = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      } catch {
        tags = ['plants', 'gardening', 'pakistan', 'plant care', 'home garden'];
      }
      
      return {
        success: true,
        tags: tags
      };
    } catch (error) {
      console.error('AI Blog Tags Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate blog SEO
  async generateBlogSEO(title, content) {
    try {
      const prompt = `Generate SEO metadata for this blog post:

Title: ${title}
Content: ${content.substring(0, 300)}

Return ONLY valid JSON (no markdown):
{
  "metaTitle": "60 char max, optimized for SEO",
  "metaDescription": "155 char max, compelling description",
  "metaKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "focusKeyword": "main keyword"
}`;

      const response = await this.callGroqAPI(prompt, 200);
      
      let result;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      } catch {
        result = {
          metaTitle: title.substring(0, 60),
          metaDescription: content.replace(/<[^>]*>/g, '').substring(0, 155),
          metaKeywords: ['plants', 'gardening', 'pakistan'],
          focusKeyword: title.split(' ')[0]
        };
      }
      
      return {
        success: true,
        seo: result
      };
    } catch (error) {
      console.error('AI Blog SEO Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate complete blog post with all metadata
  async generateCompleteBlogPost(topic, category) {
    try {
      const results = {};

      // Generate title
      const titles = await this.generateBlogTitles(topic, 1);
      if (titles.success && titles.titles.length > 0) {
        results.title = titles.titles[0];
      } else {
        results.title = topic;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate content
      const content = await this.generateBlogPost(results.title, category);
      if (content.success) {
        results.content = content.content;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate excerpt
      const excerpt = await this.generateBlogExcerpt(results.title, results.content);
      if (excerpt.success) {
        results.excerpt = excerpt.excerpt;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate tags
      const tags = await this.generateBlogTags(results.title, results.content);
      if (tags.success) {
        results.tags = tags.tags;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate SEO
      const seo = await this.generateBlogSEO(results.title, results.content);
      if (seo.success) {
        results.seo = seo.seo;
      }

      // Generate slug
      const slug = await this.generateSlug(results.title);
      if (slug.success) {
        results.slug = slug.slug;
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('AI Complete Blog Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AIService();