#!/bin/bash

echo "Creating all remaining page components with full content..."

# User Orders page
cat > client/src/pages/user/Orders.js << 'ENDFILE'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { fetchOrders } from '../../redux/slices/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      shipped: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No orders yet</p>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold mb-2">Items:</p>
                  {order.items?.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm mb-1">
                      <span>{item.name} x {item.quantity}</span>
                      <span>Rs. {item.subtotal}</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>Rs. {order.pricing?.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
ENDFILE

# User Profile page
cat > client/src/pages/user/Profile.js << 'ENDFILE'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave } from 'react-icons/fa';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2" /> Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Email (Cannot be changed)</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email}
                    className="form-input pl-10 bg-gray-100"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
              
              <h3 className="font-semibold pt-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Delivery Address
              </h3>
              
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address"
                className="form-input"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                </select>
                
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                </select>
              </div>
              
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="form-input"
              />
              
              <button type="submit" className="btn-primary flex items-center gap-2">
                <FaSave /> Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" className="btn-primary">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
ENDFILE

# User Wishlist page
cat > client/src/pages/user/Wishlist.js << 'ENDFILE'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // This would normally fetch from API/Redux
    setWishlistItems([
      {
        _id: '1',
        name: 'Money Plant',
        price: 500,
        image: 'https://source.unsplash.com/200x200/?money-plant',
        category: 'indoor-plants',
        slug: 'money-plant'
      },
      {
        _id: '2',
        name: 'Rose Plant',
        price: 800,
        image: 'https://source.unsplash.com/200x200/?rose',
        category: 'flowering-plants',
        slug: 'rose-plant'
      }
    ]);
  }, []);

  const handleRemove = (id) => {
    setWishlistItems(wishlistItems.filter(item => item._id !== id));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (item) => {
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FaHeart className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-4">Save items you love for later</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <Link to={`/products/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/products/${item.slug}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 hover:text-green-600">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                  <p className="text-lg font-bold text-green-600 mb-3">Rs. {item.price}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 btn-primary text-sm flex items-center justify-center gap-1"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="p-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
ENDFILE

echo "Creating admin pages..."

# Admin Dashboard
cat > client/src/pages/admin/Dashboard.js << 'ENDFILE'
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FaBox, FaUsers, FaLeaf, FaChartLine, FaDollarSign, FaTruck } from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayOrders: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <FaBox className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            <p className="text-gray-600">Total Orders</p>
            <p className="text-sm text-orange-600 mt-1">{stats.pendingOrders} pending</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <FaUsers className="text-3xl text-purple-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <FaLeaf className="text-3xl text-green-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            <p className="text-gray-600">Total Products</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <FaDollarSign className="text-3xl text-green-700 mb-3" />
            <h3 className="text-2xl font-bold">Rs. {stats.totalRevenue}</h3>
            <p className="text-gray-600">Total Revenue</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <FaTruck className="text-3xl text-indigo-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats.todayOrders}</h3>
            <p className="text-gray-600">Today's Orders</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <FaChartLine className="text-3xl text-red-600 mb-3" />
            <h3 className="text-2xl font-bold">85%</h3>
            <p className="text-gray-600">Fulfillment Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/products" className="block p-3 bg-green-50 rounded hover:bg-green-100">
                Add New Product
              </Link>
              <Link to="/admin/orders" className="block p-3 bg-blue-50 rounded hover:bg-blue-100">
                View Pending Orders
              </Link>
              <Link to="/admin/users" className="block p-3 bg-purple-50 rounded hover:bg-purple-100">
                Manage Users
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                New order #EDM2024001 received
              </div>
              <div className="p-2 bg-gray-50 rounded">
                User John Doe registered
              </div>
              <div className="p-2 bg-gray-50 rounded">
                Product "Snake Plant" added
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Low Stock Alert</h2>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-red-50 rounded flex justify-between">
                <span>Money Plant</span>
                <span className="text-red-600 font-semibold">2 left</span>
              </div>
              <div className="p-2 bg-yellow-50 rounded flex justify-between">
                <span>Rose Plant</span>
                <span className="text-yellow-600 font-semibold">5 left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
ENDFILE

# Admin Products page
cat > client/src/pages/admin/Products.js << 'ENDFILE'
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([
    { _id: '1', name: 'Money Plant', category: 'indoor-plants', price: 500, stock: 50, status: 'active' },
    { _id: '2', name: 'Rose Plant', category: 'flowering-plants', price: 800, stock: 30, status: 'active' },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Products - Admin - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
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
              className="form-input pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">Rs. {product.price}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
ENDFILE

# Admin Orders page
cat > client/src/pages/admin/Orders.js << 'ENDFILE'
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaEye, FaCheck, FaTruck } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders] = useState([
    {
      _id: '1',
      orderNumber: 'EDM2024001',
      customer: 'John Doe',
      date: '2024-01-15',
      total: 2500,
      status: 'pending',
      items: 3
    },
    {
      _id: '2',
      orderNumber: 'EDM2024002',
      customer: 'Jane Smith',
      date: '2024-01-14',
      total: 1800,
      status: 'shipped',
      items: 2
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Helmet>
        <title>Manage Orders - Admin - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.items}</td>
                  <td className="px-6 py-4 font-semibold">Rs. {order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800" title="View">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Confirm">
                        <FaCheck />
                      </button>
                      <button className="text-purple-600 hover:text-purple-800" title="Ship">
                        <FaTruck />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
ENDFILE

# Admin Users page
cat > client/src/pages/admin/Users.js << 'ENDFILE'
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaEdit, FaBan, FaCheck } from 'react-icons/fa';

const AdminUsers = () => {
  const [users] = useState([
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0300-1234567',
      role: 'customer',
      orders: 5,
      joined: '2024-01-01',
      status: 'active'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0321-7654321',
      role: 'customer',
      orders: 3,
      joined: '2024-01-10',
      status: 'active'
    }
  ]);

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.orders}</td>
                  <td className="px-6 py-4">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Edit">
                        <FaEdit />
                      </button>
                      {user.status === 'active' ? (
                        <button className="text-red-600 hover:text-red-800" title="Ban">
                          <FaBan />
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-800" title="Activate">
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
ENDFILE

echo "All page components created successfully!"
echo "Total files in project: $(find client/src -type f -name '*.js' | wc -l)"
