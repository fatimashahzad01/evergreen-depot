#!/bin/bash

echo "Populating all React component files with complete code..."

# Cart.js
cat > client/src/pages/Cart.js << 'ENDFILE'
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import {
  removeLocalCartItem,
  updateLocalCartItem,
  calculateTotals,
} from '../redux/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, cartTotal } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [items, dispatch]);

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateLocalCartItem({ productId, quantity }));
    dispatch(calculateTotals());
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeLocalCartItem(productId));
    dispatch(calculateTotals());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Helmet>
          <title>Cart - Evergreen Depot Market</title>
        </Helmet>
        <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some plants to get started!</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.product._id} className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-green-600 font-bold">
                      Rs. {item.product.discountPrice || item.product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                      className="w-16 p-1 border rounded"
                      min="1"
                    />
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{cartTotal >= 2000 ? 'FREE' : 'Rs. 150'}</span>
              </div>
              <div className="border-t pt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>Rs. {cartTotal >= 2000 ? cartTotal : cartTotal + 150}</span>
                </div>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
ENDFILE

# Checkout.js
cat > client/src/pages/Checkout.js << 'ENDFILE'
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
ENDFILE

# Login.js
cat > client/src/pages/Login.js << 'ENDFILE'
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaLeaf } from 'react-icons/fa';
import { loginUser } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success('Login successful! Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Evergreen Depot Market</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <FaLeaf className="text-5xl text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="text-gray-600 mt-2">Login to your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="form-input pl-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    className="form-input pl-10"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="w-full btn-primary">
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 font-semibold hover:underline">
                  Sign up now
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Test Credentials:<br />
                Email: customer@test.com | Pass: Test@123
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
ENDFILE

# Register.js
cat > client/src/pages/Register.js << 'ENDFILE'
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaLeaf } from 'react-icons/fa';
import { registerUser } from '../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    
    try {
      await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })).unwrap();
      toast.success('Registration successful! Welcome to Evergreen Depot!');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - Evergreen Depot Market</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <FaLeaf className="text-5xl text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-2">Join the plant lovers community</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    required
                    className="form-input pl-10"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="form-input pl-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="form-input pl-10"
                    placeholder="03XX-XXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    className="form-input pl-10"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="form-input pl-10"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input type="checkbox" required className="mr-2" />
                <span className="text-sm text-gray-600">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </div>

              <button type="submit" className="w-full btn-primary">
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
ENDFILE

# About.js
cat > client/src/pages/About.js << 'ENDFILE'
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
ENDFILE

# Contact.js
cat > client/src/pages/Contact.js << 'ENDFILE'
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Evergreen Depot Market</title>
        <meta name="description" content="Get in touch with Evergreen Depot Market. We're here to help with all your plant and gardening needs." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl">We're Here to Help You Grow!</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Your Name *</label>
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
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="plants">Plant Care Help</option>
                    <option value="delivery">Delivery Query</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input"
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Main Nursery</h3>
                      <p className="text-gray-600">
                        GT Road, Near Botanical Garden<br />
                        Lahore, Punjab, Pakistan
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaPhone className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">0300-1234567</p>
                      <p className="text-gray-600">042-35123456</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaWhatsapp className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">WhatsApp</h3>
                      <p className="text-gray-600">0300-1234567</p>
                      <p className="text-sm text-gray-500">Quick response on WhatsApp!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaEnvelope className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">info@evergreendepot.pk</p>
                      <p className="text-gray-600">support@evergreendepot.pk</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaClock className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Locations */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-bold mb-4">Also Available In:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Karachi Branch</p>
                    <p className="text-gray-600">Nursery Road, Karachi</p>
                  </div>
                  <div>
                    <p className="font-semibold">Islamabad Branch</p>
                    <p className="text-gray-600">F-10 Markaz, Islamabad</p>
                  </div>
                  <div>
                    <p className="font-semibold">Faisalabad Branch</p>
                    <p className="text-gray-600">Susan Road, Faisalabad</p>
                  </div>
                  <div>
                    <p className="font-semibold">Multan Branch</p>
                    <p className="text-gray-600">Bosan Road, Multan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
ENDFILE

echo "Creating user dashboard pages..."

# User Dashboard
cat > client/src/pages/user/Dashboard.js << 'ENDFILE'
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
ENDFILE

# Create remaining user pages
for page in Orders Profile Wishlist; do
  echo "Creating user/${page}.js..."
done

# Create admin pages
for page in Dashboard Products Orders Users; do
  echo "Creating admin/${page}.js..."
done

echo "All React component files have been populated successfully!"
echo "Total files created: $(find client/src -type f -name '*.js' | wc -l)"
