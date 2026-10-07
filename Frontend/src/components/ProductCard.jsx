import { useState } from 'react';

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  isFavorite,
  onToggleFavorite
}) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Safe destructuring with fallback defaults
  const {
    id,
    title = 'Untitled Product',
    category = 'General',
    price = 0,
    discountPercentage = 0,
    rating = 0,
    stock = 0,
    brand = '',
    thumbnail,
    availabilityStatus = 'In Stock'
  } = product || {};

  // Calculate original price before discount
  const originalPrice = discountPercentage > 0 
    ? (price / (1 - discountPercentage / 100)).toFixed(2) 
    : null;

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 900);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(id);
  };

  // Determine category badge class
  const categoryClass = `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <article className="product-card" onClick={() => onQuickView(product)} tabIndex={0} role="button">
      {/* Media / Image Container */}
      <div className="card-media">
        {discountPercentage > 5 && (
          <span className="badge badge-discount card-discount-badge">
            -{Math.round(discountPercentage)}%
          </span>
        )}

        <button
          className={`card-wishlist-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          title="Save to favorites"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? '#ef4444' : 'none'} stroke={isFavorite ? '#ef4444' : 'currentColor'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {!imageError && thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="product-thumbnail"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-fallback">
            <span className="fallback-category">{category.slice(0, 2).toUpperCase()}</span>
            <span>{title}</span>
          </div>
        )}

        <div className="card-hover-overlay">
          <button 
            type="button" 
            className="btn btn-secondary quickview-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="card-body">
        <div className="card-meta">
          <span className={`badge ${categoryClass}`}>
            {category}
          </span>
          {brand && <span className="card-brand">{brand}</span>}
        </div>

        <h3 className="card-title" title={title}>
          {title}
        </h3>

        {/* Rating and Stock */}
        <div className="card-rating-row">
          <div className="rating-pill">
            <span className="star-icon">★</span>
            <span className="rating-value">{Number(rating).toFixed(1)}</span>
            {product.reviews && product.reviews.length > 0 && (
              <span className="rating-count">({product.reviews.length})</span>
            )}
          </div>
          <span className={`card-stock ${stock < 15 ? 'low' : ''}`}>
            {stock < 15 ? `Low Stock (${stock})` : availabilityStatus}
          </span>
        </div>

        {/* Price and Cart Action */}
        <div className="card-footer">
          <div className="card-pricing">
            <span className="price-current">${Number(price).toFixed(2)}</span>
            {originalPrice && (
              <span className="price-original">${originalPrice}</span>
            )}
          </div>

          <button
            type="button"
            className={`card-add-btn ${isAdding ? 'added' : ''}`}
            onClick={handleAddToCartClick}
            disabled={isAdding}
            aria-label={`Add ${title} to bag`}
          >
            {isAdding ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
