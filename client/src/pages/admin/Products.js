import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSpinner, FaTimes, FaImage, FaMagic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearOperationState
} from '../../redux/slices/adminSlice';
import AIContentGenerator from './AIContentGenerator';
import ProductSEO from './ProductSEO';
import AIImageGenerator from './AIImageGenerator';

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
    ['clean']
  ]
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'color', 'background',
  'link'
];

const AdminProducts = () => {
  const dispatch = useDispatch();
  const {
    products,
    productsLoading,
    productsError,
    productsPagination,
    operationLoading,
    operationSuccess,
    operationError
  } = useSelector(state => state.admin);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showAIModal, setShowAIModal] = useState(false); 
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameUrdu: '',
    description: '',
    shortDescription: '',
    category: 'indoor-plants',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    features: '',
    benefits: '', 
    faqs: [],
    scientificName: '',
    sunlight: '',
    watering: '',
    height: '',
    spread: '',
    soil: '',
    temperature: '',
    humidity: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    featured: false,
    isActive: true,
    seo: {} 
  });

  useEffect(() => {
    dispatch(fetchAllProducts({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (operationSuccess) {
      toast.success(operationSuccess);
      dispatch(clearOperationState());
      handleCloseModal();
      dispatch(fetchAllProducts({ limit: 100 }));
    }
    if (operationError) {
      toast.error(operationError);
      dispatch(clearOperationState());
    }
  }, [operationSuccess, operationError, dispatch]);

  // NEW: Handle AI Content Generated
  const handleAIContentGenerated = (aiContent, fieldsToApply) => {
    // Apply AI generated content to form
    const updates = {};
    
    if (fieldsToApply.description && aiContent.description) {
      updates.description = aiContent.description;
    }
    if (fieldsToApply.features && aiContent.features) {
      updates.features = aiContent.features.join(', ');
    }
    if (fieldsToApply.benefits && aiContent.benefits) {
      updates.benefits = aiContent.benefits.join(', ');
    }
    if (fieldsToApply.seo && aiContent.seo) {
      updates.seo = aiContent.seo;
      updates.metaTitle = aiContent.seo.metaTitle;
      updates.metaDescription = aiContent.seo.metaDescription;
      updates.metaKeywords = aiContent.seo.keywords?.join(', ');
    }
    if (fieldsToApply.slug && aiContent.slug) {
      updates.slug = aiContent.slug;
    }
    if (fieldsToApply.faqs && aiContent.faqs) {
      updates.faqs = aiContent.faqs;
    }

    setFormData(prev => ({ ...prev, ...updates }));
    setShowAIModal(false);
    toast.success('AI content applied! Review and save when ready.');
    
  };
  
  const handleAIImagesGenerated = (images) => {
    
    console.log('AI Images generated:', images);
    setShowImageGenerator(false);
    toast.info('Images ready! They will be uploaded when you save the product.');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setShowAIModal(false); // NEW: Reset AI modal
    setFormData({
      name: '',
      nameUrdu: '',
      description: '',
      shortDescription: '',
      category: 'indoor-plants',
      price: '',
      discountPrice: '',
      stock: '',
      sku: '',
      features: '',
      benefits: '',
      scientificName: '',
      sunlight: '',
      watering: '',
      height: '',
      spread: '',
      soil: '',
      temperature: '',
      humidity: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      featured: false,
      isActive: true,
      seo: {}
    });
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      nameUrdu: product.nameUrdu || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      category: product.category || 'indoor-plants',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      stock: product.stock || '',
      sku: product.sku || '',
      features: product.features?.join(', ') || '',
      benefits: product.benefits?.join(', ') || '',
      faqs: product.faqs || [],
      scientificName: product.scientificName || '',
      sunlight: product.sunlight || '',
      watering: product.watering || '',
      height: product.height || '',
      spread: product.spread || '',
      soil: product.soil || '',
      temperature: product.temperature || '',
      humidity: product.humidity || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      metaKeywords: product.metaKeywords || '',
      featured: product.featured || false,
      isActive: product.isActive !== false,
      seo: product.seo || {}
    });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // NEW: Handle SEO changes from ProductSEO component
  const handleSEOChange = (seoData) => {
    setFormData(prev => ({
      ...prev,
      seo: seoData,
      metaTitle: seoData.metaTitle,
      metaDescription: seoData.metaDescription,
      metaKeywords: seoData.metaKeywords?.join(', ')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Add basic fields
    Object.keys(formData).forEach(key => {
      if (key === 'features') {
        const featuresArray = formData[key].split(',').map(f => f.trim()).filter(f => f);
        featuresArray.forEach(feature => data.append('features[]', feature));
      } else if (key === 'benefits') {
        const benefitsArray = formData[key].split(',').map(f => f.trim()).filter(f => f);
        benefitsArray.forEach(benefit => data.append('benefits[]', benefit));
      } else if (key === 'seo') {
        data.append('seo', JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    // Add images
    selectedImages.forEach(image => {
      data.append('images', image);
    });

    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct._id, formData: data }));
    } else {
      dispatch(createProduct(data));
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      dispatch(deleteProduct(product._id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { value: 'indoor-plants', label: 'Indoor Plants' },
    { value: 'outdoor-plants', label: 'Outdoor Plants' },
    { value: 'flowering-plants', label: 'Flowering Plants' },
    { value: 'succulents', label: 'Succulents & Cacti' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'seeds', label: 'Seeds' },
    { value: 'pots', label: 'Pots & Planters' },
    { value: 'accessories', label: 'Accessories' }
  ];

  return (
    <>
      <Helmet>
        <title>Manage Products - Admin - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {productsError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            {productsError}
          </div>
        )}

        {/* Products Table */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-green-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <FaImage className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4 capitalize">{product.category?.replace('-', ' ')}</td>
                      <td className="px-6 py-4">
                        <div>Rs. {product.price}</div>
                        {product.discountPrice && (
                          <div className="text-sm text-red-600">
                            Rs. {product.discountPrice}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.featured && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-800"
                            disabled={operationLoading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* NEW: AI Content Generator Button */}
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                        <FaMagic className="text-purple-600" />
                        AI-Powered Content Generation
                      </h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Let AI help you create professional product descriptions, SEO tags, features, and more!
                      </p>
                    </div>
                    <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAIModal(!showAIModal)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                    >
                      <FaMagic />
                      {showAIModal ? 'Hide AI Generator' : 'Open AI Generator'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImageGenerator(!showImageGenerator)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                    >
                      <FaImage />
                      {showImageGenerator ? 'Hide Image Generator' : 'Generate Images'}
                    </button>
                  </div>
                  </div>
                </div>

                {/* NEW: AI Content Generator Component */}
                {showAIModal && (
                  <AIContentGenerator
                    productData={formData}
                    onContentGenerated={handleAIContentGenerated}
                  />
                )}
                {showImageGenerator && (
                  <AIImageGenerator
                    productData={formData}
                    onImagesGenerated={handleAIImagesGenerated}
                  />
                )}

                {/* Required Fields Notice */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Required Fields:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Product Name</li>
                    <li>• Category</li>
                    <li>• Description (Short Description will be auto-generated if not provided)</li>
                    <li>• Price</li>
                    <li>• Stock Quantity</li>
                  </ul>
                  <p className="text-xs text-blue-700 mt-2">All other fields are optional and can be filled later.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Monstera Deliciosa"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name (Urdu) <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="nameUrdu"
                      value={formData.nameUrdu}
                      onChange={handleInputChange}
                      placeholder="e.g., مونسٹیرا ڈیلیسیوسا"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SKU <span className="text-gray-400 text-xs">(Auto-generated if empty)</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Leave empty for auto-generation"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Short Description <span className="text-gray-400 text-xs">(Auto-generated from description if empty)</span>
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      maxLength="160"
                      placeholder="Brief summary for product cards"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/160 characters</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                   <ReactQuill
                     theme="snow"
                     value={formData.description}
                     onChange={(content) => {
                      setFormData(prev => ({
                       ...prev,
                       description: content
                      }));
                     }}
                     modules={quillModules}
                     formats={quillFormats}
                     placeholder="Write detailed product description with formatting..."
                     style={{ height: '200px', marginBottom: '50px' }}
                   />
                  </div>

                  {/* Pricing & Stock */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 mt-4">Pricing & Stock</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (Rs.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="e.g., 500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Discount Price (Rs.) <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="e.g., 400"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="e.g., 50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Plant Details */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 mt-4">
                      Plant Details <span className="text-gray-400 text-sm font-normal">(All Optional)</span>
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Scientific Name</label>
                    <input
                      type="text"
                      name="scientificName"
                      value={formData.scientificName}
                      onChange={handleInputChange}
                      placeholder="e.g., Monstera deliciosa"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sunlight</label>
                    <input
                      type="text"
                      name="sunlight"
                      value={formData.sunlight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Full Sun, Partial Shade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Watering</label>
                    <input
                      type="text"
                      name="watering"
                      value={formData.watering}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Weekly, Daily"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 30-50cm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Spread</label>
                    <input
                      type="text"
                      name="spread"
                      value={formData.spread}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 20-30cm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Soil Type</label>
                    <input
                      type="text"
                      name="soil"
                      value={formData.soil}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Well-drained"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Temperature</label>
                    <input
                      type="text"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 18-24°C"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Humidity</label>
                    <input
                      type="text"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 40-60%"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                    <input
                      type="text"
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Air Purifying, Low Maintenance, Pet Friendly"
                    />
                  </div>

                  {/* NEW: Benefits field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Benefits (comma-separated)</label>
                    <input
                      type="text"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Improves air quality, Reduces stress, Easy to care for"
                    />
                  </div>
                  {/* FAQs Display (Read-only, managed by AI) */}
                  {formData.faqs && formData.faqs.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        FAQs <span className="text-gray-400 text-xs">(AI Generated)</span>
                      </label>
                      <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                        {formData.faqs.map((faq, idx) => (
                          <div key={idx} className="border-l-4 border-teal-500 pl-3">
                            <p className="font-semibold text-sm">Q: {faq.question}</p>
                            <p className="text-sm text-gray-700 mt-1">A: {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Use AI Generator above to create or update FAQs
                      </p>
                    </div>
                  )}

                  {/* Images */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 mt-4">Images</h3>
                    <label className="block text-sm font-medium mb-2">Upload Images</label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      multiple
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                    {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                        <div className="grid grid-cols-4 gap-4">
                          {editingProduct.images.map((image, index) => (
                            <img
                              key={index}
                              src={image.url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NEW: SEO Section with ProductSEO Component */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 mt-4">SEO Settings</h3>
                    <ProductSEO
                      product={formData}
                      seoData={formData.seo}
                      onChange={handleSEOChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2">
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">Featured Product</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">Active</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={operationLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {operationLoading && <FaSpinner className="animate-spin" />}
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;