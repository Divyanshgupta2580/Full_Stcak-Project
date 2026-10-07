import { useState, useEffect } from 'react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(() => product?.images?.[0] || product?.thumbnail);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const {
    title,
    category,
    price = 0,
    discountPercentage = 0,
    rating = 0,
    stock = 0,
    brand,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    shippingInformation,
    availabilityStatus,
    returnPolicy,
    description,
    reviews = [],
    images = []
  } = product;

  const originalPrice = discountPercentage > 0 
    ? (price / (1 - discountPercentage / 100)).toFixed(2) 
    : null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-product-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-grid">
          {/* Gallery Column */}
          <div className="modal-gallery">
            <div className="modal-main-image-wrap">
              <img
                src={selectedImage || product.thumbnail}
                alt={title}
                className="modal-main-image"
              />
              {discountPercentage > 0 && (
                <span className="badge badge-discount modal-discount-badge">
                  -{Math.round(discountPercentage)}% OFF
                </span>
              )}
            </div>

            {images && images.length > 1 && (
              <div className="modal-thumbnails-strip">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setSelectedImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="modal-details">
            <div className="modal-header-meta">
              <span className={`badge badge-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                {category}
              </span>
              {brand && <span className="modal-brand-tag">By {brand}</span>}
              {sku && <span className="modal-sku-tag">SKU: {sku}</span>}
            </div>

            <h2 id="modal-product-title" className="modal-title">{title}</h2>

            <div className="modal-rating-row">
              <div className="rating-pill">
                <span className="star-icon">★</span>
                <span className="rating-value">{Number(rating).toFixed(1)}</span>
              </div>
              <span className="modal-reviews-count">{reviews.length} verified reviews</span>
              <span className="modal-stock-status">
                ● {availabilityStatus || 'In Stock'} ({stock} units)
              </span>
            </div>

            <div className="modal-price-box">
              <div className="modal-price-current">${Number(price).toFixed(2)}</div>
              {originalPrice && (
                <div className="modal-price-original">
                  Original: <span>${originalPrice}</span>
                </div>
              )}
              {discountPercentage > 0 && (
                <div className="modal-savings-text">
                  You save ${(Number(originalPrice) - Number(price)).toFixed(2)} ({discountPercentage}%)
                </div>
              )}
            </div>

            <p className="modal-description">{description}</p>

            {/* Specifications Grid */}
            <div className="modal-specs-box">
              <h4 className="specs-heading">Specifications & Shipping</h4>
              <div className="specs-list">
                {warrantyInformation && (
                  <div className="spec-row">
                    <span className="spec-key">Warranty</span>
                    <span className="spec-val">{warrantyInformation}</span>
                  </div>
                )}
                {shippingInformation && (
                  <div className="spec-row">
                    <span className="spec-key">Shipping</span>
                    <span className="spec-val">{shippingInformation}</span>
                  </div>
                )}
                {returnPolicy && (
                  <div className="spec-row">
                    <span className="spec-key">Returns</span>
                    <span className="spec-val">{returnPolicy}</span>
                  </div>
                )}
                {weight && (
                  <div className="spec-row">
                    <span className="spec-key">Weight</span>
                    <span className="spec-val">{weight} kg</span>
                  </div>
                )}
                {dimensions && (
                  <div className="spec-row">
                    <span className="spec-key">Dimensions</span>
                    <span className="spec-val">
                      {dimensions.width}W × {dimensions.height}H × {dimensions.depth}D cm
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Row */}
            <div className="modal-purchase-row">
              <div className="quantity-control">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`btn btn-primary modal-add-cart-btn ${isAdded ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {isAdded ? '✓ Added to Bag' : `Add ${quantity} to Bag — $${(price * quantity).toFixed(2)}`}
              </button>
            </div>

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
              <div className="modal-reviews-section">
                <h4 className="reviews-heading">Customer Reviews ({reviews.length})</h4>
                <div className="reviews-list">
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-card-header">
                        <span className="reviewer-name">{rev.reviewerName || 'Anonymous Customer'}</span>
                        <div className="review-stars">
                          {'★'.repeat(Math.round(rev.rating || 5))}
                          {'☆'.repeat(5 - Math.round(rev.rating || 5))}
                        </div>
                      </div>
                      <p className="review-comment">"{rev.comment}"</p>
                      <span className="review-date">
                        {rev.date ? new Date(rev.date).toLocaleDateString() : 'Verified Buyer'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
