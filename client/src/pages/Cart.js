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
