import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLeaf,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-2xl text-green-500" />
              <h3 className="text-xl font-bold">Evergreen Depot</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Pakistan's trusted online nursery delivering quality plants to your doorstep.
            </p>
            <p className="text-sm text-gray-400 urdu mb-2">
              آپ کی اپنی آن لائن نرسری
            </p>
            {/* Social Links */}
            <div className="flex space-x-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=indoor-plants"
                  className="text-gray-400 hover:text-white"
                >
                  Indoor Plants
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=outdoor-plants"
                  className="text-gray-400 hover:text-white"
                >
                  Outdoor Plants
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=flowering-plants"
                  className="text-gray-400 hover:text-white"
                >
                  Flowering Plants
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=seeds"
                  className="text-gray-400 hover:text-white"
                >
                  Seeds & Bulbs
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=planters"
                  className="text-gray-400 hover:text-white"
                >
                  Planters & Pots
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-green-500" />
                <div>
                  <p className="text-gray-400">0300-1234567</p>
                  <p className="text-xs text-gray-500">Mon-Sat 9AM-6PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-green-500" />
                <p className="text-gray-400">info@evergreendepot.pk</p>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-green-500 mt-1" />
                <div>
                  <p className="text-gray-400">Main Nursery:</p>
                  <p className="text-sm text-gray-500">
                    GT Road, Near Botanical Garden,
                    <br />
                    Lahore, Punjab, Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Delivery Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <h5 className="font-semibold mb-2">Payment Methods</h5>
              <p className="text-sm text-gray-400">
                COD | JazzCash | EasyPaisa
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Delivery</h5>
              <p className="text-sm text-gray-400">
                All Major Cities of Pakistan
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Free Shipping</h5>
              <p className="text-sm text-gray-400">
                Orders above Rs. 2000
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Customer Care</h5>
              <p className="text-sm text-gray-400">
                24/7 WhatsApp Support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2024 Evergreen Depot Market. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="hover:text-white">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pakistani Flag Strip */}
      <div className="h-1 bg-gradient-to-r from-green-800 via-white to-green-800"></div>
    </footer>
  );
};

export default Footer;
