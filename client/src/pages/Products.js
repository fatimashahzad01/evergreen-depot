import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import {
  fetchProducts,
  fetchCategories,
  setFilters,
  clearFilters,
} from '../redux/slices/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const { products, loading, categories, pagination, filters } = useSelector(
    (state) => state.products
  );

  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    dispatch(fetchCategories());
    
    const params = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      page: 1,
      limit: 12,
    };
    
    dispatch(setFilters(params));
    dispatch(fetchProducts(params));
  }, [dispatch, searchParams]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(fetchProducts(localFilters));
    setShowFilters(false);
  };

  const resetFilters = () => {
    setLocalFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
    dispatch(clearFilters());
    dispatch(fetchProducts({}));
  };

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ ...filters, page }));
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet>
        <title>Shop Plants Online - Evergreen Depot Market</title>
        <meta
          name="description"
          content="Browse our wide selection of indoor plants, outdoor plants, seeds, and gardening supplies. Best prices in Pakistan with fast delivery."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop Plants</h1>
            <p className="text-gray-600">
              {searchParams.get('search')
                ? `Search results for "${searchParams.get('search')}"`
                : searchParams.get('category')
                ? `Category: ${searchParams.get('category').replace('-', ' ')}`
                : 'Browse our complete collection'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-64">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Category</h4>
                  <select
                    value={localFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.displayName} ({cat.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Price Range (Rs.)</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 p-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Sort By</h4>
                  <select
                    value={localFilters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Best Rated</option>
                  </select>
                </div>

                {/* Filter Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={applyFilters}
                    className="w-full btn-primary py-2"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full btn-secondary py-2"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow"
                >
                  <FaFilter /> Filters
                </button>
              </div>

              {/* Results Count */}
              <div className="mb-4 text-gray-600">
                Showing {products.length} of {pagination.total} products
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="loader"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-green-600 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Product Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <Link to={`/products/${product.slug}`}>
                          <div className="relative h-64 bg-gray-200">
                            {product.discountPrice && (
                              <span className="badge-sale">
                                {Math.round(
                                  ((product.price - product.discountPrice) /
                                    product.price) *
                                    100
                                )}
                                % OFF
                              </span>
                            )}
                            <img
                              src={
                                product.images?.[0]?.url ||
                                `https://source.unsplash.com/400x400/?plant,${product.name}`
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {product.category.replace('-', ' ')}
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                {product.discountPrice ? (
                                  <>
                                    <span className="text-lg font-bold text-green-600">
                                      Rs. {product.discountPrice}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                      Rs. {product.price}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-green-600">
                                    Rs. {product.price}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400 text-sm" />
                                <span className="text-sm text-gray-600">
                                  {product.rating?.average || 0}
                                </span>
                              </div>
                            </div>
                            {product.stock === 0 && (
                              <p className="text-red-500 text-sm mt-2">Out of Stock</p>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <div className="flex gap-2">
                        {Array.from({ length: pagination.pages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 rounded-lg ${
                              pagination.page === i + 1
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowFilters(false)}></div>
            <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <FaTimes />
                </button>
              </div>
              
              {/* Copy filter content from desktop */}
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Category</h4>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.displayName} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Price Range (Rs.)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 p-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Sort By</h4>
                <select
                  value={localFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>

              {/* Filter Buttons */}
              <div className="space-y-2">
                <button
                  onClick={applyFilters}
                  className="w-full btn-primary py-2"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full btn-secondary py-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
