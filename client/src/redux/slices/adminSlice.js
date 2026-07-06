import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get auth token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ==================== DASHBOARD ====================
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/stats', getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// ==================== PRODUCTS ====================
export const fetchAllProducts = createAsyncThunk(
  'admin/fetchAllProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products', {
        params,
        ...getAuthConfig()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/products', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/products/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/products/${id}`, getAuthConfig());
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// ==================== ORDERS ====================
export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/orders/admin/all', {  // Changed from '/api/admin/orders/all'
        params,
        ...getAuthConfig()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status, trackingInfo }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/orders/admin/${orderId}/status`,
        { status, ...trackingInfo },
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);
// ==================== USERS ====================
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/orders/admin/all', {
        params,
        ...getAuthConfig()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${userId}`,
        { isActive },
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${userId}`,
        { role },
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

// ==================== REPORTS ====================
export const fetchSalesReport = createAsyncThunk(
  'admin/fetchSalesReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/reports/sales', {
        params,
        ...getAuthConfig()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales report');
    }
  }
);

export const fetchInventoryReport = createAsyncThunk(
  'admin/fetchInventoryReport',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/reports/inventory', getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory report');
    }
  }
);

// ==================== SLICE ====================
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    // Dashboard
    stats: null,
    statsLoading: false,
    statsError: null,

    // Products
    products: [],
    productsLoading: false,
    productsError: null,
    productsPagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 20,
    },

    // Orders
    orders: [],
    ordersLoading: false,
    ordersError: null,
    ordersPagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 20,
    },

    // Users
    users: [],
    usersLoading: false,
    usersError: null,
    usersPagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 20,
    },

    // Reports
    salesReport: null,
    inventoryReport: null,
    reportsLoading: false,
    reportsError: null,

    // Operation states
    operationLoading: false,
    operationError: null,
    operationSuccess: null,
  },
  reducers: {
    clearOperationState: (state) => {
      state.operationLoading = false;
      state.operationError = null;
      state.operationSuccess = null;
    },
    clearErrors: (state) => {
      state.statsError = null;
      state.productsError = null;
      state.ordersError = null;
      state.usersError = null;
      state.reportsError = null;
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== STATS ====================
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })

      // ==================== PRODUCTS ====================
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload.products;
        state.productsPagination = action.payload.pagination;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.operationSuccess = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationSuccess = 'Product created successfully';
        state.products.unshift(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.operationSuccess = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationSuccess = 'Product updated successfully';
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.operationSuccess = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationSuccess = 'Product deleted successfully';
        state.products = state.products.filter(p => p._id !== action.payload.id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      // ==================== ORDERS ====================
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.orders;
        state.ordersPagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.operationSuccess = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationSuccess = 'Order status updated successfully';
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      // ==================== USERS ====================
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      .addCase(updateUserStatus.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.operationSuccess = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationSuccess = 'User status updated successfully';
        const index = state.users.findIndex(u => u._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      .addCase(updateUserRole.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.operationSuccess = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationSuccess = 'User role updated successfully';
        const index = state.users.findIndex(u => u._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })

      // ==================== REPORTS ====================
      .addCase(fetchSalesReport.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload;
      })

      .addCase(fetchInventoryReport.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.inventoryReport = action.payload;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload;
      });
  },
});

export const { clearOperationState, clearErrors } = adminSlice.actions;
export default adminSlice.reducer;
