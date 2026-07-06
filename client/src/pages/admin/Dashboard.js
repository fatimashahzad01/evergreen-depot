import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBox, FaUsers, FaLeaf, FaChartLine, FaDollarSign, FaTruck, FaSpinner } from 'react-icons/fa';
import { fetchAdminStats } from '../../redux/slices/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, statsLoading, statsError } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          Error loading dashboard: {statsError}
        </div>
      </div>
    );
  }

  const fulfillmentRate = stats?.orders?.total > 0
    ? Math.round((stats.orders.delivered / stats.orders.total) * 100)
    : 0;

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
            <h3 className="text-2xl font-bold">{stats?.orders?.total || 0}</h3>
            <p className="text-gray-600">Total Orders</p>
            <p className="text-sm text-orange-600 mt-1">{stats?.orders?.pending || 0} pending</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FaUsers className="text-3xl text-purple-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats?.users?.total || 0}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FaLeaf className="text-3xl text-green-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats?.products?.total || 0}</h3>
            <p className="text-gray-600">Total Products</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FaDollarSign className="text-3xl text-green-700 mb-3" />
            <h3 className="text-2xl font-bold">Rs. {stats?.revenue?.total?.toLocaleString() || 0}</h3>
            <p className="text-gray-600">Total Revenue</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FaTruck className="text-3xl text-indigo-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats?.orders?.today || 0}</h3>
            <p className="text-gray-600">Today's Orders</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FaChartLine className="text-3xl text-red-600 mb-3" />
            <h3 className="text-2xl font-bold">{fulfillmentRate}%</h3>
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
              <Link to="/admin/blogs" className="block p-4 bg-orange-50 hover:bg-orange-100 rounded-lg">
                Manage Blogs
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-2 text-sm">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-2 bg-gray-50 rounded">
                    Order #{order.orderNumber} - Rs. {order.total}
                  </div>
                ))
              ) : (
                <div className="p-2 bg-gray-50 rounded text-gray-500">
                  No recent orders
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Low Stock Alert</h2>
            <div className="space-y-2 text-sm">
              {stats?.products?.lowStock > 0 ? (
                <div className="p-2 bg-red-50 rounded">
                  <span className="text-red-600 font-semibold">
                    {stats.products.lowStock} products low in stock
                  </span>
                </div>
              ) : (
                <div className="p-2 bg-green-50 rounded text-green-600">
                  All products well stocked
                </div>
              )}
              {stats?.topProducts?.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Top Selling:</p>
                  {stats.topProducts.slice(0, 3).map((product) => (
                    <div key={product._id} className="p-2 bg-blue-50 rounded mb-1">
                      {product.name} ({product.sold} sold)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
