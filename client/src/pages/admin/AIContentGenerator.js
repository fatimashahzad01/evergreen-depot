import React, { useState } from 'react';
import axios from 'axios';

const AIContentGenerator = ({ productData, onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
 const [generatedContent, setGeneratedContent] = useState({
   description: '',
   seo: {},
   features: [],
   benefits: [],
   careInstructions: '',
   slug: '',
   faqs: []  
  });
  const [selectedFields, setSelectedFields] = useState({
    description: false,
    seo: false,
    features: false,
    benefits: false,
    careInstructions: false,
    slug: false,
    faqs: false
  });
  const [error, setError] = useState('');

  // Generate all content at once
  const generateCompleteContent = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/generate-complete`,
        {
          name: productData.name,
          category: productData.category,
          description: productData.description,
          specifications: productData.specifications
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setGeneratedContent(response.data.data);
        // Auto-select all fields
        setSelectedFields({
          description: true,
          seo: true,
          features: true,
          benefits: true,
          slug: true
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  // Generate specific field
  const generateField = async (fieldType) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let requestData = {
        productName: productData.name,
        category: productData.category
      };

      switch (fieldType) {
        case 'description':
          endpoint = '/api/ai/generate-description';
          requestData.specifications = productData.specifications;
          break;
        case 'seo':
          endpoint = '/api/ai/generate-seo';
          requestData.description = productData.description;
          break;
        case 'features':
          endpoint = '/api/ai/generate-features';
          requestData.description = productData.description;
          break;
        case 'benefits':
          endpoint = '/api/ai/generate-benefits';
          break;
        case 'faqs':
          endpoint = '/api/ai/generate-faqs';
          requestData.description = productData.description;
          break;
        default:
          return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${endpoint}`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setGeneratedContent(prev => ({
          ...prev,
          [fieldType]: response.data[fieldType] || response.data.seo || response.data.features || response.data.benefits
        }));
        setSelectedFields(prev => ({ ...prev, [fieldType]: true }));
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to generate ${fieldType}`);
    } finally {
      setLoading(false);
    }
  };

  // Apply selected content to product
  const applyContent = () => {
    const contentToApply = {};
    Object.keys(selectedFields).forEach(field => {
      if (selectedFields[field] && generatedContent[field]) {
        contentToApply[field] = generatedContent[field];
      }
    });
    onContentGenerated(contentToApply, selectedFields);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-green-800">AI Content Generator</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Generate All Button */}
      <div className="mb-6">
        <button
          onClick={generateCompleteContent}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              ✨ Generate All Content with AI
            </>
          )}
        </button>
      </div>

      {/* Individual Field Generators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => generateField('description')}
          disabled={loading}
          className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          Generate Description
        </button>
        <button
          onClick={() => generateField('seo')}
          disabled={loading}
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          Generate SEO Data
        </button>
        <button
          onClick={() => generateField('features')}
          disabled={loading}
          className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          Generate Features
        </button>
        <button
          onClick={() => generateField('benefits')}
          disabled={loading}
          className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          Generate Benefits
        </button>
        <button
          onClick={() => generateField('faqs')}
          disabled={loading}
          className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          Generate FAQs
        </button>
      </div>

      {/* Generated Content Preview */}
      {Object.keys(generatedContent).some(key => generatedContent[key]) && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4">Generated Content</h3>
          
          {/* Description */}
          {generatedContent.description && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.description}
                    onChange={(e) => setSelectedFields(prev => ({ ...prev, description: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Description</span>
                </label>
              </div>
              <p className="text-gray-700 text-sm">{generatedContent.description}</p>
            </div>
          )}

          {/* SEO Data */}
          {generatedContent.seo && Object.keys(generatedContent.seo).length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.seo}
                    onChange={(e) => setSelectedFields(prev => ({ ...prev, seo: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">SEO Metadata</span>
                </label>
              </div>
              <div className="text-sm space-y-2">
                <p><strong>Title:</strong> {generatedContent.seo.metaTitle}</p>
                <p><strong>Description:</strong> {generatedContent.seo.metaDescription}</p>
                <p><strong>Keywords:</strong> {generatedContent.seo.keywords?.join(', ')}</p>
                <p><strong>Focus Keyword:</strong> {generatedContent.seo.focusKeyword}</p>
              </div>
            </div>
          )}

          {/* Features */}
          {generatedContent.features && generatedContent.features.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.features}
                    onChange={(e) => setSelectedFields(prev => ({ ...prev, features: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Features</span>
                </label>
              </div>
              <ul className="list-disc list-inside text-sm">
                {generatedContent.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {generatedContent.benefits && generatedContent.benefits.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.benefits}
                    onChange={(e) => setSelectedFields(prev => ({ ...prev, benefits: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Benefits</span>
                </label>
              </div>
              <ul className="list-disc list-inside text-sm">
                {generatedContent.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          {/* FAQs */}
          {generatedContent.faqs && generatedContent.faqs.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.faqs}
                    onChange={(e) => setSelectedFields(prev => ({ ...prev, faqs: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">FAQs</span>
                </label>
              </div>
              <div className="text-sm space-y-3">
                {generatedContent.faqs.map((faq, idx) => (
                  <div key={idx} className="border-l-2 border-teal-500 pl-3">
                    <p className="font-semibold text-teal-800">Q: {faq.question}</p>
                    <p className="text-gray-700 mt-1">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slug */}
          {generatedContent.slug && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.slug}
                    onChange={(e) => setSelectedFields(prev => ({ ...prev, slug: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">SEO-Friendly Slug</span>
                </label>
              </div>
              <p className="text-gray-700 text-sm font-mono">{generatedContent.slug}</p>
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={applyContent}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mt-4"
          >
            Apply Selected Content to Product
          </button>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;