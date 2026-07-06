import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaEye, FaTimes, FaShippingFast } from 'react-icons/fa';
import { fetchOrders } from '../../redux/slices/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      shipped: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-orange-100 text-orange-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      packed: 'bg-cyan-100 text-cyan-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
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
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>

                {/* Tracking Info */}
                {order.tracking?.number && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                    <FaShippingFast className="text-blue-600 text-xl" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tracking Number: {order.tracking.number}</p>
                      <p className="text-xs text-gray-600">Courier: {order.tracking.company}</p>
                    </div>
                    {order.tracking.url && (
                      <a
                        href={order.tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Track
                      </a>
                    )}
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="font-semibold mb-2">Items:</p>
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{item.product?.name || item.name} x {item.quantity}</span>
                      <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>Rs. {order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Order Details - {selectedOrder.orderNumber}</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Order Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Order Status</h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Tracking Information */}
                {selectedOrder.tracking?.number && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Tracking Information</h3>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Courier Company:</span>
                        <span>{selectedOrder.tracking.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tracking Number:</span>
                        <span className="font-mono">{selectedOrder.tracking.number}</span>
                      </div>
                      {selectedOrder.tracking.url && (
                        <div className="pt-2">
                          <a
                            href={selectedOrder.tracking.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-2"
                          >
                            <FaTruck /> Track Your Order
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>{selectedOrder.shippingAddress?.street}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province}</p>
                    <p>{selectedOrder.shippingAddress?.postalCode}</p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                        {item.product?.images?.[0]?.url && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.product?.name || item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>Rs. {selectedOrder.subtotal?.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Delivery Charges:</span><span>Rs. {selectedOrder.deliveryCharges?.toLocaleString()}</span></div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600"><span>Discount:</span><span>- Rs. {selectedOrder.discount?.toLocaleString()}</span></div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span><span>Rs. {selectedOrder.total?.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-600 pt-2">
                      Payment Method: <span className="capitalize">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
