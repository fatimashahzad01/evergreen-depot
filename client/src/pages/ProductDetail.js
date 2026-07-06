import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaStar, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { fetchProductBySlug } from '../redux/slices/productSlice';
import { addLocalCartItem } from '../redux/slices/cartSlice';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [seoData, setSeoData] = useState(null); // NEW: Store SEO data
  
  const { currentProduct: product, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    fetchSEOData(); // NEW: Fetch SEO data
  }, [dispatch, slug]);

  // NEW: Fetch SEO data from API
  const fetchSEOData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${slug}`);
      if (response.data.seo) {
        setSeoData(response.data.seo);
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    dispatch(addLocalCartItem({
      product: product,
      quantity: quantity
    }));
    toast.success('Added to cart!');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/users/wishlist/${product._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInWishlist(response.data.inWishlist);
      
      if (response.data.inWishlist) {
        toast.success('Added to wishlist!');
      } else {
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      {/* ENHANCED SEO META TAGS & JSON-LD */}
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{seoData?.metaTags?.title || `${product.name} - Evergreen Depot Market`}</title>
        <meta name="description" content={seoData?.metaTags?.description || product.metaDescription || product.shortDescription} />
        <meta name="keywords" content={seoData?.metaTags?.keywords?.join(', ') || ''} />
        <link rel="canonical" href={seoData?.metaTags?.canonical || window.location.href} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData?.metaTags?.ogTitle || product.name} />
        <meta property="og:description" content={seoData?.metaTags?.ogDescription || product.shortDescription} />
        <meta property="og:image" content={seoData?.metaTags?.ogImage || product.images?.[0]?.url} />
        <meta property="og:url" content={seoData?.metaTags?.ogUrl || window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Evergreen Depot Market" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={seoData?.metaTags?.twitterCard || 'summary_large_image'} />
        <meta name="twitter:title" content={seoData?.metaTags?.twitterTitle || product.name} />
        <meta name="twitter:description" content={seoData?.metaTags?.twitterDescription || product.shortDescription} />
        <meta name="twitter:image" content={seoData?.metaTags?.twitterImage || product.images?.[0]?.url} />
        
        {/* Product Specific Meta Tags */}
        <meta property="product:price:amount" content={product.discountPrice || product.price} />
        <meta property="product:price:currency" content="PKR" />
        <meta property="product:availability" content={product.stock > 0 ? 'in stock' : 'out of stock'} />
        <meta property="product:condition" content="new" />
        
        {/* JSON-LD Structured Data - Product */}
        {seoData?.jsonLD?.product && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.jsonLD.product)}
          </script>
        )}
        
        {/* JSON-LD Structured Data - Breadcrumb */}
        {seoData?.jsonLD?.breadcrumb && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.jsonLD.breadcrumb)}
          </script>
        )}
      </Helmet>

      {/* REST OF YOUR EXISTING CODE - UNCHANGED */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage]?.url || `https://source.unsplash.com/500x500/?plant,${product.name}`}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded overflow-hidden ${
                      selectedImage === index ? 'border-green-600' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(product.rating?.average || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                ({product.rating?.count || 0} reviews)
              </span>
            </div>

            <div className="mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-green-600">
                    Rs. {product.discountPrice}
                  </span>
                  <span className="text-xl text-gray-500 line-through ml-3">
                    Rs. {product.price}
                  </span>
                  <span className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-sm">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-green-600">
                  Rs. {product.price}
                </span>
              )}
            </div>

            <div 
              className="text-gray-700 mb-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center py-2"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="btn-primary flex items-center gap-2"
                disabled={product.stock === 0}
              >
                <FaShoppingCart />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleWishlist}
                className="p-3 border rounded-lg hover:bg-gray-50"
              >
                <FaHeart className={inWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'} />
              </button>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Delivery Info */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-4">
                <FaTruck className="text-green-600 text-xl" />
                <div>
                  <p className="font-semibold">Free Delivery</p>
                  <p className="text-sm text-gray-600">On orders above Rs. 2000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaShieldAlt className="text-green-600 text-xl" />
                <div>
                  <p className="font-semibold">100% Healthy Plants</p>
                  <p className="text-sm text-gray-600">Quality guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaLeaf className="text-green-600 text-xl" />
                <div>
                  <p className="font-semibold">Expert Support</p>
                  <p className="text-sm text-gray-600">Gardening guidance included</p>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            {product.careInstructions && (
              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Care Instructions:</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  {product.careInstructions.watering && (
                    <p>💧 <strong>Water:</strong> {product.careInstructions.watering}</p>
                  )}
                  {product.careInstructions.light && (
                    <p>☀ <strong>Light:</strong> {product.careInstructions.light}</p>
                  )}
                  {product.careInstructions.temperature && (
                    <p>🌡 <strong>Temperature:</strong> {product.careInstructions.temperature}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* FAQs Section */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {product.faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg text-green-700 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.relatedProducts.map((related) => (
                <div key={related._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={related.images?.[0]?.url || 'https://via.placeholder.com/200'}
                    alt={related.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm">{related.name}</h4>
                    <p className="text-green-600 font-bold">Rs. {related.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;