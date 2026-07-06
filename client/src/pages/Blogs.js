import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaEye, FaTag, FaArrowRight } from 'react-icons/fa';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'plant-care', label: 'Plant Care' },
    { value: 'gardening-tips', label: 'Gardening Tips' },
    { value: 'indoor-plants', label: 'Indoor Plants' },
    { value: 'outdoor-plants', label: 'Outdoor Plants' },
    { value: 'plant-guides', label: 'Plant Guides' },
    { value: 'news', label: 'News' },
    { value: 'diy', label: 'DIY' }
  ];

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const params = selectedCategory ? `?category=${selectedCategory}` : '';
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs${params}`);
      setBlogs(response.data.blogs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Plant Care Blog</h1>
          <p className="text-xl">Expert tips, guides, and advice for Pakistani gardeners</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No blogs found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <article key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {blog.featuredImage && (
                  <img
                    src={blog.featuredImage.url}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {blog.category.replace(/-/g, ' ').toUpperCase()}
                    </span>
                    {blog.aiGenerated && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        AI Generated
                      </span>
                    )}
                  </div>

                  <Link to={`/blog/${blog.slug}`}>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FaCalendar size={12} />
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye size={12} />
                        {blog.views}
                      </span>
                    </div>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                          <FaTag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    Read More <FaArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;