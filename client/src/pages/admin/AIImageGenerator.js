import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner, FaDownload, FaTrash } from 'react-icons/fa';

const AIImageGenerator = ({ productData, onImagesGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState('');

  const generateSingleImage = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/generate-image`,
        {
          productName: productData.name,
          category: productData.category,
          description: productData.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const newImage = {
          url: response.data.imageUrl,
          prompt: response.data.prompt,
          isPrimary: generatedImages.length === 0
        };
        setGeneratedImages([...generatedImages, newImage]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const generateMultipleImages = async (count) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/generate-multiple-images`,
        {
          productName: productData.name,
          category: productData.category,
          description: productData.description,
          count: count
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const newImages = response.data.images.map((img, idx) => ({
          url: img.url,
          prompt: img.prompt,
          view: img.view,
          isPrimary: idx === 0 && generatedImages.length === 0
        }));
        setGeneratedImages([...generatedImages, ...newImages]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate images');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setGeneratedImages(generatedImages.filter((_, idx) => idx !== index));
  };

  const applyImages = () => {
    onImagesGenerated(generatedImages);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">AI Image Generator</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Image generation uses DALL-E 3 and costs approximately $0.04 per image. 
          Generation takes 10-20 seconds per image.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={generateSingleImage}
          disabled={loading || !productData.name}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate 1 Image'}
        </button>

        <button
          onClick={() => generateMultipleImages(2)}
          disabled={loading || !productData.name}
          className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded disabled:opacity-50"
        >
          Generate 2 Images
        </button>

        <button
          onClick={() => generateMultipleImages(3)}
          disabled={loading || !productData.name}
          className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded disabled:opacity-50"
        >
          Generate 3 Images
        </button>
      </div>

      {generatedImages.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4">
            Generated Images: {generatedImages.length}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt="Generated product"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Images generated using AI. Click the button below to apply them to your product.
            </p>
          </div>

          <button
            onClick={applyImages}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Apply Images to Product
          </button>
        </div>
      )}
    </div>
  );
};

export default AIImageGenerator;