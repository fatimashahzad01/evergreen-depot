import React, { useState, useEffect } from 'react';

const ProductSEO = ({ product, seoData, onChange }) => {
  const [seo, setSeo] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    focusKeyword: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  });

  useEffect(() => {
    if (seoData) {
      setSeo(seoData);
    }
  }, [seoData]);

  const handleChange = (field, value) => {
    const updated = { ...seo, [field]: value };
    setSeo(updated);
    onChange(updated);
  };

  const handleKeywordsChange = (value) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    handleChange('metaKeywords', keywords);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">SEO Settings</h2>
      
      {/* Meta Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Meta Title <span className="text-gray-500">({seo.metaTitle?.length || 0}/60)</span>
        </label>
        <input
          type="text"
          value={seo.metaTitle || ''}
          onChange={(e) => handleChange('metaTitle', e.target.value)}
          maxLength={60}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter meta title"
        />
      </div>

      {/* Meta Description */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Meta Description <span className="text-gray-500">({seo.metaDescription?.length || 0}/160)</span>
        </label>
        <textarea
          value={seo.metaDescription || ''}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
          maxLength={160}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter meta description"
        />
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Meta Keywords <span className="text-gray-500">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={seo.metaKeywords?.join(', ') || ''}
          onChange={(e) => handleKeywordsChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>

      {/* Focus Keyword */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Focus Keyword
        </label>
        <input
          type="text"
          value={seo.focusKeyword || ''}
          onChange={(e) => handleChange('focusKeyword', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Main keyword for this product"
        />
      </div>

      {/* Open Graph */}
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-bold mb-3 text-gray-700">Open Graph (Facebook)</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">OG Title</label>
          <input
            type="text"
            value={seo.ogTitle || ''}
            onChange={(e) => handleChange('ogTitle', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Facebook share title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">OG Description</label>
          <textarea
            value={seo.ogDescription || ''}
            onChange={(e) => handleChange('ogDescription', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Facebook share description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">OG Image URL</label>
          <input
            type="text"
            value={seo.ogImage || ''}
            onChange={(e) => handleChange('ogImage', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Twitter Card */}
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-bold mb-3 text-gray-700">Twitter Card</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Twitter Title</label>
          <input
            type="text"
            value={seo.twitterTitle || ''}
            onChange={(e) => handleChange('twitterTitle', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Twitter share title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Twitter Description</label>
          <textarea
            value={seo.twitterDescription || ''}
            onChange={(e) => handleChange('twitterDescription', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Twitter share description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Twitter Image URL</label>
          <input
            type="text"
            value={seo.twitterImage || ''}
            onChange={(e) => handleChange('twitterImage', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSEO;