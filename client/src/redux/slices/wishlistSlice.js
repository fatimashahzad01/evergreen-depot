import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async () => {
    const response = await axios.get('/api/users/wishlist');
    return response.data.wishlist;
  }
);

// Toggle wishlist item (add or remove)
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (productId) => {
    const response = await axios.post(`/api/users/wishlist/${productId}`);
    return { productId, inWishlist: response.data.inWishlist };
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Toggle wishlist
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, inWishlist } = action.payload;
        
        if (inWishlist) {
          // Product was added - fetch will update the list
        } else {
          // Product was removed - remove from state
          state.items = state.items.filter(item => item._id !== productId);
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;