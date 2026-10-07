

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="cart-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <h3 className="drawer-title">Shopping Bag</h3>
            <span className="drawer-count">({cartItems.length} items)</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="drawer-shipping-meter">
          {remainingForFreeShipping > 0 ? (
            <p className="shipping-text">
              Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>Free Worldwide Shipping</strong>!
            </p>
          ) : (
            <p className="shipping-text unlocked">
              🎉 You've unlocked <strong>FREE Standard Shipping</strong>!
            </p>
          )}
          <div className="shipping-bar-track">
            <div
              className="shipping-bar-fill"
              style={{ width: `${progressToFreeShipping}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-items-list">
          {cartItems.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-cart-icon">🛍️</div>
              <h4>Your shopping bag is empty</h4>
              <p>Explore our curated collections to find your new favorites.</p>
              <button className="btn btn-primary" onClick={onClose}>
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="cart-item-thumb"
                />
                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <button
                      className="cart-item-remove"
                      onClick={() => onRemoveItem(item.id)}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                  <span className="cart-item-category">{item.category}</span>
                  <div className="cart-item-bottom">
                    <div className="quantity-control small">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 99)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-summary-row">
              <span>Subtotal</span>
              <span className="summary-val">${subtotal.toFixed(2)}</span>
            </div>
            <div className="drawer-summary-row">
              <span>Estimated Shipping</span>
              <span className="summary-val">
                {subtotal >= freeShippingThreshold ? 'FREE' : '$4.99'}
              </span>
            </div>
            <div className="drawer-total-row">
              <span>Total</span>
              <span className="total-val">
                ${(subtotal >= freeShippingThreshold ? subtotal : subtotal + 4.99).toFixed(2)}
              </span>
            </div>
            <button className="btn btn-primary drawer-checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
