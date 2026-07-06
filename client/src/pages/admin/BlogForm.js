import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaArrowLeft, FaMagic, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AIBlogGenerator from './AIBlogGenerator';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'plant-care',
    tags: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      focusKeyword: ''
    },
    isPublished: true,
    aiGenerated: false
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tagInput, setTagInput] = useState('');

  const categories = [
    'plant-care',
    'gardening-tips',
    'indoor-plants',
    'outdoor-plants',
    'plant-guides',
    'news',
    'diy'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/blogs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blog = response.data.blog;
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
        tags: blog.tags || [],
        seo: blog.seo || {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: [],
          focusKeyword: ''
        },
        isPublished: blog.isPublished,
        aiGenerated: blog.aiGenerated || false
      });
      if (blog.featuredImage) {
        setImagePreview(blog.featuredImage.url);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSEOChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAIBlogGenerated = (generatedBlog) => {
    setFormData(prev => ({
      ...prev,
      title: generatedBlog.title || prev.title,
      content: generatedBlog.content || prev.content,
      excerpt: generatedBlog.excerpt || prev.excerpt,
      tags: generatedBlog.tags || prev.tags,
      seo: generatedBlog.seo || prev.seo,
      aiGenerated: true
    }));
    setShowAIGenerator(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('category', formData.category);
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('seo', JSON.stringify(formData.seo));
      submitData.append('isPublished', formData.isPublished);
      submitData.append('aiGenerated', formData.aiGenerated);
      
      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      }

      if (isEdit) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/blogs/${id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Blog updated successfully!');
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/blogs`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Blog created successfully!');
      }
      
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? 'Edit Blog' : 'Create New Blog'}
        </h1>
        <button
          onClick={() => navigate('/admin/blogs')}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Blogs
        </button>
      </div>

      {!isEdit && (
        <div className="mb-6">
          <button
            onClick={() => setShowAIGenerator(!showAIGenerator)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <FaMagic />
            {showAIGenerator ? 'Hide AI Generator' : 'Generate Blog with AI'}
          </button>
        </div>
      )}

      {showAIGenerator && (
        <AIBlogGenerator onBlogGenerated={handleAIBlogGenerated} />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief description (max 300 characters)"
              rows="3"
              maxLength="300"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here... (HTML supported)"
              rows="15"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              HTML tags are supported: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Enter tag and press Enter"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-bold mb-4">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.seo.metaTitle}
                onChange={handleSEOChange}
                placeholder="SEO optimized title (max 60 chars)"
                maxLength="60"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.seo.metaDescription}
                onChange={handleSEOChange}
                placeholder="SEO meta description (max 155 chars)"
                maxLength="155"
                rows="2"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Focus Keyword</label>
              <input
                type="text"
                name="focusKeyword"
                value={formData.seo.focusKeyword}
                onChange={handleSEOChange}
                placeholder="Primary keyword for SEO"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Publish immediately</span>
          </label>

          {formData.aiGenerated && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              AI Generated
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave />
            {loading ? 'Saving...' : (isEdit ? 'Update Blog' : 'Create Blog')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;