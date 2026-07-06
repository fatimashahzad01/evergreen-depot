import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaHeart, FaShoppingCart, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch wishlist from API
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems(response.data.wishlist);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `http://localhost:5000/api/users/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        'http://localhost:5000/api/users/cart',
        { productId: item._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

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
            <Link to="/products" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <Link to={`/products/${item.slug}`}>
                  <img
                    src={item.images?.[0]?.url || 'https://source.unsplash.com/500x500/?plant'}
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
                  <p className="text-sm text-gray-600 mb-2 capitalize">
                    {item.category?.replace('-', ' ')}
                  </p>
                  <div className="mb-3">
                    {item.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-green-600">Rs. {item.discountPrice}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">Rs. {item.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-green-600">Rs. {item.price}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-green-700"
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