import React from 'react';
import { Helmet } from 'react-helmet';
import { FaLeaf, FaTruck, FaUsers, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Evergreen Depot Market</title>
        <meta name="description" content="Learn about Evergreen Depot Market - Pakistan's premier online plant nursery dedicated to making Pakistan greener." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About Evergreen Depot Market</h1>
            <p className="text-xl">Making Pakistan Greener, One Plant at a Time</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-green-800">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Welcome to Evergreen Depot Market - Pakistan's premier online plant nursery. 
                Founded with a passion for greenery and a commitment to environmental sustainability, 
                we have been serving plant enthusiasts across Pakistan since 2020.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                What started as a small family nursery in Lahore has grown into Pakistan's most 
                trusted online platform for plants and gardening supplies. We believe that everyone 
                deserves access to quality plants that can transform their living spaces and contribute 
                to a greener Pakistan.
              </p>
              <p className="text-lg text-gray-700 urdu text-center py-4 text-xl">
                سبز پاکستان، خوشحال پاکستان
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <FaLeaf className="text-4xl text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Quality Plants</h3>
                <p className="text-gray-700">
                  All our plants are carefully selected and nurtured to ensure they reach 
                  you in perfect health. We work with local growers who understand Pakistani 
                  climate conditions.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <FaTruck className="text-4xl text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
                <p className="text-gray-700">
                  We deliver to all major cities of Pakistan including Lahore, Karachi, 
                  Islamabad, and more. Free delivery on orders above Rs. 2000!
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <FaUsers className="text-4xl text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                <p className="text-gray-700">
                  Our team of gardening experts is always ready to help you choose the 
                  right plants and provide care guidance for Pakistani weather conditions.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <FaAward className="text-4xl text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Satisfaction Guarantee</h3>
                <p className="text-gray-700">
                  We stand behind the quality of our plants with a 100% satisfaction 
                  guarantee. If you're not happy, we'll make it right.
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="bg-green-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-green-800">Our Mission</h2>
              <p className="text-lg text-gray-700">
                To make quality plants accessible to every Pakistani household, promoting 
                environmental awareness and contributing to a greener, cleaner Pakistan. 
                We envision a future where every home and office space is adorned with 
                beautiful, air-purifying plants that improve quality of life.
              </p>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-600">50,000+</p>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">500+</p>
                  <p className="text-gray-600">Plant Varieties</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">20+</p>
                  <p className="text-gray-600">Cities Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
