import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaCheck, FaTruck, FaBox, FaSpinner, FaTimes, FaShippingFast } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  fetchAllOrders,
  updateOrderStatus,
  clearOperationState
} from '../../redux/slices/adminSlice';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const {
    orders,
    ordersLoading,
    ordersError,
    operationLoading,
    operationSuccess,
    operationError
  } = useSelector(state => state.admin);

  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCompany, setTrackingCompany] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders({ limit: 100 }));
    document.title = 'Manage Orders - Admin - Evergreen Depot Market';
  }, [dispatch]);

  useEffect(() => {
    if (operationSuccess) {
      toast.success(operationSuccess);
      dispatch(clearOperationState());
      setShowStatusModal(false);
      setShowDetailModal(false);
      dispatch(fetchAllOrders({ limit: 100 }));
    }
    if (operationError) {
      toast.error(operationError);
      dispatch(clearOperationState());
    }
  }, [operationSuccess, operationError, dispatch]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.tracking?.number || '');
    setTrackingCompany(order.tracking?.company || '');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    const trackingInfo = {};
    if (trackingNumber) trackingInfo.trackingNumber = trackingNumber;
    if (trackingCompany) trackingInfo.trackingCompany = trackingCompany;

    dispatch(updateOrderStatus({
      orderId: selectedOrder._id,
      status: newStatus,
      trackingInfo
    }));
  };

  const handleQuickStatusUpdate = (order, status) => {
    dispatch(updateOrderStatus({
      orderId: order._id,
      status: status,
      trackingInfo: {}
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      packed: 'bg-cyan-100 text-cyan-800',
      shipped: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
      refunded: 'bg-pink-100 text-pink-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = statusFilter
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' },
    { value: 'refunded', label: 'Refunded' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Orders</h1>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Orders</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {ordersError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            {ordersError}
          </div>
        )}

        {ordersLoading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-green-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div>{order.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{order.items?.length || 0}</td>
                      <td className="px-6 py-4 font-semibold">Rs. {order.pricing?.total?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm capitalize">{order.payment?.method}</div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.payment?.status)}`}>
                          {order.payment?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleQuickStatusUpdate(order, 'confirmed')}
                              className="text-green-600 hover:text-green-800"
                              title="Confirm Order"
                              disabled={operationLoading}
                            >
                              <FaCheck />
                            </button>
                          )}
                          {(order.status === 'confirmed' || order.status === 'processing' || order.status === 'packed') && (
                            <button
                              onClick={() => handleOpenStatusModal(order)}
                              className="text-purple-600 hover:text-purple-800"
                              title="Update Status & Tracking"
                              disabled={operationLoading}
                            >
                              <FaTruck />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Update Status"
                            disabled={operationLoading}
                          >
                            <FaBox />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Order Details - {selectedOrder.orderNumber}</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div><span className="font-medium">Name:</span> {selectedOrder.user?.name}</div>
                      <div><span className="font-medium">Email:</span> {selectedOrder.user?.email}</div>
                      <div><span className="font-medium">Phone:</span> {selectedOrder.user?.phone}</div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div><span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                      <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                      <div><span className="font-medium">Payment:</span> <span className="capitalize">{selectedOrder.payment?.method}</span></div>
                      <div><span className="font-medium">Payment Status:</span> <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(selectedOrder.payment?.status)}`}>{selectedOrder.payment?.status}</span></div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div>{selectedOrder.shippingAddress?.street}</div>
                      <div>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province}</div>
                      <div>{selectedOrder.shippingAddress?.postalCode}</div>
                      <div>{selectedOrder.shippingAddress?.country}</div>
                    </div>
                  </div>

                  {/* Tracking Information */}
                  {selectedOrder.tracking?.number && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Tracking Information</h3>
                      <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                        <div><span className="font-medium">Company:</span> {selectedOrder.tracking?.company}</div>
                        <div><span className="font-medium">Tracking #:</span> {selectedOrder.tracking?.number}</div>
                        {selectedOrder.tracking?.url && (
                          <div>
                            <a href={selectedOrder.tracking?.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Track Order
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Quantity</th>
                          <th className="px-4 py-2 text-left">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.product?.images?.[0]?.url && (
                                  <img src={item.product.images[0].url} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                                )}
                                <div>
                                  <div className="font-medium">{item.product?.name || 'Product'}</div>
                                  <div className="text-sm text-gray-500">{item.product?.sku}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">Rs. {item.price}</td>
                            <td className="px-4 py-3">{item.quantity}</td>
                            <td className="px-4 py-3 font-semibold">Rs. {item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>Rs. {selectedOrder.pricing?.subtotal?.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Delivery Charges:</span><span>Rs. {selectedOrder.pricing?.deliveryCharges?.toLocaleString()}</span></div>
                    {selectedOrder.pricing?.discount > 0 && (
                      <div className="flex justify-between text-green-600"><span>Discount:</span><span>- Rs. {selectedOrder.pricing?.discount?.toLocaleString()}</span></div>
                    )}
                    {selectedOrder.pricing?.tax > 0 && (
                      <div className="flex justify-between"><span>Tax:</span><span>Rs. {selectedOrder.pricing?.tax?.toLocaleString()}</span></div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span><span>Rs. {selectedOrder.pricing?.total?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenStatusModal(selectedOrder);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Update Order Status</h2>
                <button onClick={() => setShowStatusModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Order: <span className="font-semibold">{selectedOrder.orderNumber}</span></p>
                  <p className="text-sm text-gray-600">Current Status: <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">New Status *</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tracking Company</label>
                    <input
                      type="text"
                      value={trackingCompany}
                      onChange={(e) => setTrackingCompany(e.target.value)}
                      placeholder="e.g., TCS, Leopards, PostEx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={operationLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {operationLoading && <FaSpinner className="animate-spin" />}
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default AdminOrders;
