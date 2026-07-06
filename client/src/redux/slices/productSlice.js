import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}) => {
    const response = await axios.get('/api/products', { params });
    return response.data;
  }
);

// Fetch single product
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug) => {
    const response = await axios.get(`/api/products/${slug}`);
    return response.data.product;
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await axios.get('/api/products/categories');
    return response.data.categories;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    categories: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 12,
    },
    filters: {
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Single Product
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
