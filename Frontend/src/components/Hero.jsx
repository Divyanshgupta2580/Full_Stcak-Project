

export default function Hero({ totalProducts, onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Premium 2026 Collection Live</span>
          </div>
          <h1 className="hero-title">
            Curated Elegance, <br />
            <span className="hero-title-gradient">Effortless Shopping</span>
          </h1>
          <p className="hero-description">
            Discover handpicked beauty essentials, luxury fragrances, designer furniture,
            and artisanal groceries. Sourced directly with verified authenticity and 
            expedited delivery.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary hero-btn" onClick={onExploreClick}>
              Explore Catalog ({totalProducts} Items)
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <div className="feature-text">
                <span className="feature-title">100% Authentic</span>
                <span className="feature-sub">Direct from brand makers</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <div className="feature-text">
                <span className="feature-title">Fast Shipping</span>
                <span className="feature-sub">Ships within 2-4 days</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <div className="feature-text">
                <span className="feature-title">Buyer Protection</span>
                <span className="feature-sub">Guaranteed refund policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-glow-blob hero-glow-blob-1"></div>
      <div className="hero-glow-blob hero-glow-blob-2"></div>
    </section>
  );
}
