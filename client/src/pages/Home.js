import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaTruck, FaShieldAlt, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/featured');
      setFeaturedProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Indoor Plants', slug: 'indoor-plants', icon: '🪴', urdu: 'اندرونی پودے' },
    { name: 'Outdoor Plants', slug: 'outdoor-plants', icon: '🌳', urdu: 'بیرونی پودے' },
    { name: 'Flowering Plants', slug: 'flowering-plants', icon: '🌺', urdu: 'پھولدار پودے' },
    { name: 'Succulents', slug: 'succulents', icon: '🌵', urdu: 'رسیلے پودے' },
    { name: 'Seeds', slug: 'seeds', icon: '🌱', urdu: 'بیج' },
    { name: 'Planters', slug: 'planters', icon: '🏺', urdu: 'گملے' },
  ];

  return (
    <>
      <Helmet>
        <title>Evergreen Depot Market - پاکستان کی سب سے بڑی آن لائن نرسری</title>
        <meta name="description" content="Buy plants online in Pakistan. Indoor plants, outdoor plants, seeds, and gardening supplies with fast delivery." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Hero Section with Morphing Plant Images */}
        <section className="relative bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 overflow-hidden min-h-[600px]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Blob animations */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
          </div>

          {/* Decorative Plant Images with Mirror Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Left Side Plant - Morphing Effect */}
            <motion.div
              initial={{ opacity: 0, x: -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-0 top-1/4 w-80 h-96"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=600&fit=crop"
                alt="Plant decoration"
                className="w-full h-full object-cover opacity-60"
                style={{
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
                }}
              />
              {/* Mirror reflection */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 30%, transparent 60%)',
                  transform: 'scaleX(-1)',
                }}
              />
            </motion.div>

            {/* Right Side Plant - Morphing Effect */}
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute right-0 top-1/4 w-80 h-96"
              style={{
                background: 'linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=600&fit=crop"
                alt="Plant decoration"
                className="w-full h-full object-cover opacity-60"
                style={{
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
                }}
              />
              {/* Mirror reflection */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.2) 30%, transparent 60%)',
                  transform: 'scaleX(-1)',
                }}
              />
            </motion.div>

            {/* Floating Plants */}
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-10 left-1/4 opacity-40"
            >
              <img
                src="https://images.unsplash.com/photo-1459156212016-c812468e2115?w=200&h=200&fit=crop"
                alt="Floating plant"
                className="w-32 h-32 object-cover rounded-full shadow-2xl"
                style={{
                  maskImage: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 70%)',
                }}
              />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 30, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-20 right-1/4 opacity-40"
            >
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop"
                alt="Floating plant"
                className="w-40 h-40 object-cover rounded-full shadow-2xl"
                style={{
                  maskImage: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 70%)',
                }}
              />
            </motion.div>

            {/* Bottom decorative plant */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-10 left-1/3 opacity-30"
            >
              <img
                src="https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=300&h=200&fit=crop"
                alt="Decorative plant"
                className="w-48 h-32 object-cover rounded-2xl shadow-xl"
                style={{
                  maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 100%)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 100%)',
                }}
              />
            </motion.div>
          </div>

          {/* Pakistani Flag Colors Border */}
          <div className="h-2 bg-gradient-to-r from-green-800 via-white to-green-800 relative z-10"></div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Local Store Banner */}
              <div className="inline-block mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="bg-white/80 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg border-2 border-green-600"
                >
                  <span className="text-green-800 font-semibold">🌿 آپ کی اپنی نرسری - Your Local Nursery 🌿</span>
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-green-900 mb-4"
              >
                Evergreen Depot Market
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-green-700 mb-2 urdu"
              >
                سبز پاکستان، خوشحال پاکستان
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-700 mb-8"
              >
                Pakistan's Trusted Online Plant Store - Delivering Nature to Your Doorstep
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col md:flex-row gap-4 justify-center mb-8"
              >
                <Link to="/products" className="btn-primary inline-flex items-center justify-center gap-2 transform hover:scale-105 transition-transform">
                  <FaLeaf /> Shop Now - خریداری کریں
                </Link>
                <button className="btn-secondary inline-flex items-center justify-center gap-2 transform hover:scale-105 transition-transform">
                  <FaPhoneAlt /> Call: 0300-1234567
                </button>
              </motion.div>

              {/* Trust Badges with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100"
                >
                  <FaTruck className="text-4xl text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Free Delivery</p>
                  <p className="text-xs text-gray-600">Orders above Rs. 2000</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100"
                >
                  <FaShieldAlt className="text-4xl text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Quality Assured</p>
                  <p className="text-xs text-gray-600">Healthy Plants Only</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100"
                >
                  <FaStar className="text-4xl text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Expert Support</p>
                  <p className="text-xs text-gray-600">Gardening Guidance</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Wave */}
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
                  fill="white"/>
          </svg>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                Shop by Category
              </h2>
              <p className="text-center text-lg text-gray-600 mb-10 urdu">
                زمرہ کے مطابق خریداری کریں
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={`/products?category=${category.slug}`}
                      className="block bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-100 hover:border-green-400 transition-all duration-300 card-hover"
                    >
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                      <p className="text-xs text-gray-600 mt-1 urdu">{category.urdu}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Plants</h2>
              <p className="text-lg text-gray-600 urdu">منتخب پودے</p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="product-grid">
                {featuredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
                  >
                    <Link to={`/products/${product.slug}`}>
                      <div className="relative h-48 bg-gray-200">
                        {product.discountPrice && (
                          <span className="badge-sale">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </span>
                        )}
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0].url || `https://source.unsplash.com/400x300/?plant,${product.name}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.discountPrice ? (
                              <>
                                <span className="text-lg font-bold text-green-600">Rs. {product.discountPrice}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">Rs. {product.price}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-green-600">Rs. {product.price}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-sm text-gray-600">{product.rating?.average || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                View All Products <FaLeaf />
              </Link>
            </div>
          </div>
        </section>

        {/* Local Store Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 md:p-12 local-store-border">
              <h2 className="text-3xl font-bold text-center mb-8 text-green-900">
                Why Choose Evergreen Depot?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">🇵🇰</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">100% Pakistani</h3>
                  <p className="text-gray-600">Locally grown plants suited for Pakistani climate</p>
                </div>
                <div className="text-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">💚</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Garden Experts</h3>
                  <p className="text-gray-600">30+ years of nursery experience in Pakistan</p>
                </div>
                <div className="text-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Same Day Delivery</h3>
                  <p className="text-gray-600">Available in Lahore, Karachi, Islamabad</p>
                </div>
              </div>

              <div className="mt-10 p-6 bg-white rounded-xl shadow-inner">
                <p className="text-center text-lg text-gray-700">
                  <span className="font-bold text-green-700">"</span>
                  <span className="urdu text-xl">باغبانی ایک فن ہے، اور ہم اس فن کے ماہر ہیں</span>
                  <span className="font-bold text-green-700">"</span>
                </p>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Gardening is an art, and we are masters of this art
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 bg-green-600">
          <div className="container mx-auto px-4">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Get Gardening Tips & Offers</h3>
              <p className="mb-6">Join our community of 50,000+ plant lovers across Pakistan</p>
              <form className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800"
                />
                <button type="submit" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;