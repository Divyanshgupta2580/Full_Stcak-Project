import { useState, useMemo } from 'react';
import ProductCard from './components/ProductCard';

export default function ProductList({
  products = [],
  loading = false,
  error = null,
  isOfflineFallback = false,
  onRetry,
  onQuickView,
  onAddToCart,
  favorites = [],
  onToggleFavorite,
  activeCategory = 'all',
  onSelectCategory,
  searchTerm = '',
  onClearSearch
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [minRating, setMinRating] = useState(0);


  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all' && p.category?.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = p.title?.toLowerCase().includes(query);
          const matchDesc = p.description?.toLowerCase().includes(query);
          const matchBrand = p.brand?.toLowerCase().includes(query);
          const matchCategory = p.category?.toLowerCase().includes(query);
          const matchTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchBrand && !matchCategory && !matchTags) {
            return false;
          }
        }
        // Rating filter
        if (minRating > 0 && (p.rating || 0) < minRating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'discount-desc') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return 0; // featured default
      });
  }, [products, activeCategory, searchTerm, minRating, sortBy]);

  const hasActiveFilters = activeCategory !== 'all' || searchTerm.trim() !== '' || minRating > 0;

  const handleResetFilters = () => {
    onSelectCategory('all');
    onClearSearch();
    setMinRating(0);
    setSortBy('featured');
  };

  return (
    <section className="product-section" id="products-catalog">
      <div className="container">
        {/* Offline / Fallback Notification Banner */}
        {isOfflineFallback && (
          <div className="status-banner info">
            <span className="banner-icon">💡</span>
            <div className="banner-text">
              <strong>Offline / Demo Mode:</strong> Viewing built-in product catalog while the live cloud server initializes.
            </div>
            {onRetry && (
              <button className="banner-btn" onClick={onRetry}>
                Connect Live API
              </button>
            )}
          </div>
        )}

        {/* Error Banner */}
        {error && !loading && products.length === 0 && (
          <div className="status-banner error">
            <span className="banner-icon">⚠️</span>
            <div className="banner-text">
              <strong>Could not load remote products:</strong> {error}
            </div>
            {onRetry && (
              <button className="banner-btn" onClick={onRetry}>
                Retry Loading
              </button>
            )}
          </div>
        )}

        {/* Filter and Controls Toolbar */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <h2 className="toolbar-title">
              {activeCategory === 'all'
                ? 'All Products'
                : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>
            <span className="toolbar-counter">
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
            </span>
          </div>

          <div className="toolbar-right">
            {/* Rating Filter */}
            <div className="filter-group">
              <label htmlFor="rating-filter" className="filter-label">Rating:</label>
              <select
                id="rating-filter"
                className="filter-select"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4.0★ and above</option>
                <option value={3}>3.0★ and above</option>
                <option value={2}>2.0★ and above</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="filter-group">
              <label htmlFor="sort-filter" className="filter-label">Sort by:</label>
              <select
                id="sort-filter"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="discount-desc">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="active-filters-row">
            <span className="active-filters-label">Active Filters:</span>
            {activeCategory !== 'all' && (
              <span className="filter-tag">
                Category: {activeCategory}
                <button onClick={() => onSelectCategory('all')}>✕</button>
              </span>
            )}
            {searchTerm && (
              <span className="filter-tag">
                Search: "{searchTerm}"
                <button onClick={onClearSearch}>✕</button>
              </span>
            )}
            {minRating > 0 && (
              <span className="filter-tag">
                Rating: {minRating}★+
                <button onClick={() => setMinRating(0)}>✕</button>
              </span>
            )}
            <button className="clear-all-link" onClick={handleResetFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="product-card skeleton-card">
                <div className="card-media skeleton"></div>
                <div className="card-body">
                  <div className="skeleton-line short skeleton"></div>
                  <div className="skeleton-line medium skeleton"></div>
                  <div className="skeleton-line long skeleton"></div>
                  <div className="skeleton-footer-row">
                    <div className="skeleton-line short skeleton"></div>
                    <div className="skeleton-btn skeleton"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id || product.title}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Empty Search / Filter State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="empty-catalog-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>
              We couldn't find any products matching your current criteria. Try adjusting your search or filters.
            </p>
            <button className="btn btn-primary" onClick={handleResetFilters}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}