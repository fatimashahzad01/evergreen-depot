import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }) => {
    const response = await axios.post('/api/users/cart', {
      productId,
      quantity,
    });
    return response.data.cart;
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ productId, quantity }) => {
    const response = await axios.put(`/api/users/cart/${productId}`, {
      quantity,
    });
    return response.data.cart;
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (productId) => {
    const response = await axios.delete(`/api/users/cart/${productId}`);
    return response.data.cart;
  }
);

// Clear cart
export const clearCart = createAsyncThunk('cart/clear', async () => {
  const response = await axios.delete('/api/users/cart');
  return response.data.cart;
});

// Load cart
export const loadCart = createAsyncThunk('cart/load', async () => {
  const response = await axios.get('/api/users/profile');
  return response.data.user.cart || [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    cartTotal: 0,
    itemCount: 0,
  },
  reducers: {
    calculateTotals: (state) => {
      let total = 0;
      let count = 0;
      
      state.items.forEach((item) => {
        if (item.product) {
          const price = item.product.discountPrice || item.product.price;
          total += price * item.quantity;
          count += item.quantity;
        }
      });
      
      state.cartTotal = total;
      state.itemCount = count;
    },
    addLocalCartItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload.product._id
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeLocalCartItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
    },
    updateLocalCartItem: (state, action) => {
      const item = state.items.find(
        (item) => item.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.cartTotal = 0;
      state.itemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.cartTotal = 0;
        state.itemCount = 0;
      })
      // Load cart
      .addCase(loadCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const {
  calculateTotals,
  addLocalCartItem,
  removeLocalCartItem,
  updateLocalCartItem,
  clearLocalCart,
} = cartSlice.actions;

export default cartSlice.reducer;
