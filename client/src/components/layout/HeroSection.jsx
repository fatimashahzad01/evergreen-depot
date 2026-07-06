import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaTruck, FaShieldAlt, FaPhoneAlt, FaStar, FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '1000+', label: 'Plants Varieties' },
    { number: '3', label: 'Cities Covered' },
    { number: '4.9', label: 'Rating', icon: <FaStar className="inline text-yellow-400" /> },
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Pakistani Flag Colors Border */}
      <div className="h-2 bg-gradient-to-r from-green-800 via-white to-green-800"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            {/* Local Store Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                <span className="text-white font-semibold flex items-center gap-2">
                  🌿 <span className="urdu">آپ کی اپنی نرسری</span> - Your Local Nursery 🌿
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
            >
              Evergreen Depot
              <span className="block text-white/90">Market</span>
            </motion.h1>

            {/* Urdu Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl mb-3 urdu font-semibold"
            >
              سبز پاکستان، خوشحال پاکستان
            </motion.p>

            {/* English Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              Pakistan's Trusted Online Plant Store
              <span className="block text-lg mt-2">Delivering Nature to Your Doorstep 🚚</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link
                to="/products"
                className="group bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-3"
              >
                <FaLeaf className="text-2xl" />
                <span>Shop Now - خریداری کریں</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="tel:03001234567"
                className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200 border-2 border-white/30 inline-flex items-center justify-center gap-3"
              >
                <FaPhoneAlt className="text-xl" />
                <span>Call: 0300-1234567</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
                >
                  <div className="text-2xl font-bold mb-1">
                    {stat.number}
                    {stat.icon && <span className="ml-1">{stat.icon}</span>}
                  </div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Plant Image */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"
                  alt="Beautiful Plants"
                  className="rounded-3xl shadow-2xl w-full max-w-lg mx-auto"
                />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-10 -left-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaTruck className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Free Delivery</div>
                    <div className="text-sm text-gray-600">Above Rs. 2000</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-10 -right-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaShieldAlt className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">100% Quality</div>
                    <div className="text-sm text-gray-600">Assured</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges - Below Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mt-16"
        >
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform">
            <FaTruck className="text-4xl text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 text-lg">Free Delivery</p>
            <p className="text-sm text-gray-600 mt-1">Orders above Rs. 2000</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform">
            <FaShieldAlt className="text-4xl text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 text-lg">Quality Assured</p>
            <p className="text-sm text-gray-600 mt-1">Healthy Plants Only</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform">
            <FaStar className="text-4xl text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 text-lg">Expert Support</p>
            <p className="text-sm text-gray-600 mt-1">Gardening Guidance</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
          fill="white"
        />
      </svg>

      {/* Floating Plants Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-10 text-6xl opacity-20"
        >
          🌿
        </motion.div>

        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-1/3 right-20 text-5xl opacity-20"
        >
          🪴
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 left-1/4 text-7xl opacity-20"
        >
          🌱
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;