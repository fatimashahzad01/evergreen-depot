import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist, fetchWishlist } from '../redux/slices/wishlistSlice';

const WishlistButton = ({ productId, productName, className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if product is in wishlist
    const inWishlist = wishlistItems.some(item => item._id === productId);
    setIsInWishlist(inWishlist);
  }, [wishlistItems, productId]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      await dispatch(toggleWishlist(productId)).unwrap();
      
      if (isInWishlist) {
        toast.success(`${productName} removed from wishlist`);
      } else {
        toast.success(`${productName} added to wishlist`);
      }
      
      // Refresh wishlist to update state
      dispatch(fetchWishlist());
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-all ${
        isInWishlist
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <FaSpinner className="animate-spin text-xl" />
      ) : (
        <FaHeart className={`text-xl ${isInWishlist ? 'fill-current' : ''}`} />
      )}
    </button>
  );
};

export default WishlistButton;