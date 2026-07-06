import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FaBox, FaHeart, FaUser, FaShoppingCart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wishlistCount: 0,
    reviewsCount: 0,
  });

  useEffect(() => {
    // Fetch user statistics
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/dashboard/overview');
        setStats(data.overview);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Dashboard - Evergreen Depot Market</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your account and track your orders</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/orders" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaBox className="text-3xl text-green-600" />
              <span className="text-2xl font-bold">{stats.totalOrders}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Total Orders</h3>
            <p className="text-sm text-gray-600">{stats.pendingOrders} pending</p>
          </Link>

          <Link to="/wishlist" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaHeart className="text-3xl text-red-500" />
              <span className="text-2xl font-bold">{stats.wishlistCount}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Wishlist Items</h3>
            <p className="text-sm text-gray-600">Saved for later</p>
          </Link>

          <Link to="/profile" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaStar className="text-3xl text-yellow-500" />
              <span className="text-2xl font-bold">{stats.reviewsCount}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Reviews</h3>
            <p className="text-sm text-gray-600">Your feedback</p>
          </Link>

          <Link to="/cart" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaShoppingCart className="text-3xl text-blue-600" />
              <span className="text-2xl font-bold">{stats.cartCount || 0}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Cart Items</h3>
            <p className="text-sm text-gray-600">Ready to checkout</p>
          </Link>
        </div>

        {/* Account Information */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaUser className="mr-2" /> Account Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <Link to="/profile" className="btn-primary mt-4 inline-block">
              Edit Profile
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Default Address
            </h2>
            {user?.address?.street ? (
              <div className="space-y-2">
                <p>{user.address.street}</p>
                <p>{user.address.city}, {user.address.province}</p>
                <p>Pakistan {user.address.postalCode}</p>
              </div>
            ) : (
              <p className="text-gray-600">No address saved</p>
            )}
            <Link to="/profile" className="btn-primary mt-4 inline-block">
              Update Address
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/products" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <FaShoppingCart className="text-2xl text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Shop Now</p>
            </Link>
            <Link to="/orders" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <FaBox className="text-2xl text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Track Order</p>
            </Link>
            <Link to="/contact" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <FaUser className="text-2xl text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Get Support</p>
            </Link>
            <Link to="/wishlist" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <FaHeart className="text-2xl text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Wishlist</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
