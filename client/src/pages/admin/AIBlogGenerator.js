import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner, FaMagic, FaLightbulb } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AIBlogGenerator = ({ onBlogGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('plant-care');
  const [generatedBlog, setGeneratedBlog] = useState(null);

  const categories = [
    'plant-care',
    'gardening-tips',
    'indoor-plants',
    'outdoor-plants',
    'plant-guides',
    'news',
    'diy'
  ];

  const handleGenerateComplete = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/blogs/ai/generate-complete`,
        { topic, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setGeneratedBlog(response.data.blog);
        toast.success('Blog generated successfully!');
      }
    } catch (error) {
      console.error('Generate blog error:', error);
      toast.error('Failed to generate blog');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBlog = () => {
    if (generatedBlog) {
      onBlogGenerated(generatedBlog);
      toast.success('Blog content applied!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-800 flex items-center gap-2">
        <FaMagic /> AI Blog Generator
      </h2>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800 flex items-center gap-2">
          <FaLightbulb />
          <strong>Tip:</strong> Enter a topic like "How to care for indoor plants in Pakistan" or "Best outdoor plants for summer"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Blog Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., How to grow Monstera plants in Pakistan"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerateComplete}
        disabled={loading || !topic.trim()}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Generating Blog... (30-60 seconds)
          </>
        ) : (
          <>
            <FaMagic />
            Generate Complete Blog with AI
          </>
        )}
      </button>

      {generatedBlog && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-bold mb-4">Generated Blog Preview</h3>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">Title:</label>
              <p className="text-lg font-semibold">{generatedBlog.title}</p>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">Excerpt:</label>
              <p className="text-sm text-gray-700">{generatedBlog.excerpt}</p>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">Tags:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {generatedBlog.tags?.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">Content Preview:</label>
              <div 
                className="text-sm text-gray-700 mt-2 max-h-60 overflow-y-auto prose"
                dangerouslySetInnerHTML={{ __html: generatedBlog.content?.substring(0, 500) + '...' }}
              />
            </div>
          </div>

          <button
            onClick={handleApplyBlog}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Apply This Blog Content
          </button>
        </div>
      )}
    </div>
  );
};

export default AIBlogGenerator;