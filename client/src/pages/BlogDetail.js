import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaEye, FaTag, FaArrowLeft, FaUser } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${slug}`);
      setBlog(response.data.blog);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
          <Link to="/blogs" className="text-green-600 hover:text-green-700">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.seo?.metaTitle || blog.title}</title>
        <meta name="description" content={blog.seo?.metaDescription || blog.excerpt} />
        <meta name="keywords" content={blog.seo?.metaKeywords?.join(', ') || blog.tags?.join(', ')} />
      </Helmet>

      <article className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <Link to="/blogs" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
              <FaArrowLeft /> Back to Blogs
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {blog.category.replace(/-/g, ' ').toUpperCase()}
              </span>
              {blog.aiGenerated && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  AI Generated
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {blog.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <FaUser size={14} />
                {blog.author?.name || 'Admin'}
              </span>
              <span className="flex items-center gap-2">
                <FaCalendar size={14} />
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <FaEye size={14} />
                {blog.views} views
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
              <img
                src={blog.featuredImage.url}
                alt={blog.title}
                className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Excerpt */}
              <div className="text-xl text-gray-700 italic mb-8 pb-8 border-b">
                {blog.excerpt}
              </div>

              {/* Main Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-lg font-bold mb-4">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                      >
                        <FaTag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
              <Link
                to="/blogs"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
              >
                Read More Articles
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetail;