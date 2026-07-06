import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { createOrder } from '../redux/slices/orderSlice';
import { clearLocalCart } from '../redux/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, cartTotal } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || '',
    paymentMethod: 'cod',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        street: formData.street,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
      },
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearLocalCart());
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const deliveryTotal = cartTotal >= 2000 ? 0 : 150;
  const finalTotal = cartTotal + deliveryTotal;

  return (
    <>
      <Helmet>
        <title>Checkout - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="form-input"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (03XX-XXXXXXX)"
                className="form-input"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="form-input"
                required
              />
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address"
                className="form-input"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                </select>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad</option>
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
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Cash on Delivery (COD)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={formData.paymentMethod === 'jazzcash'}
                  onChange={handleChange}
                  className="mr-2"
                />
                JazzCash
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="easypaisa"
                  checked={formData.paymentMethod === 'easypaisa'}
                  onChange={handleChange}
                  className="mr-2"
                />
                EasyPaisa
              </label>
            </div>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Order notes (optional) - e.g., delivery instructions"
              className="form-input mt-4"
              rows="3"
            />
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>Rs. {(item.product.discountPrice || item.product.price) * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{deliveryTotal === 0 ? 'FREE' : `Rs. ${deliveryTotal}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total Amount</span>
                    <span className="text-green-600">Rs. {finalTotal}</span>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full btn-primary">
                Place Order - Rs. {finalTotal}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                By placing order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;