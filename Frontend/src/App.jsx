import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './ProductList';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import { fallbackProducts } from './data/fallbackProducts';
import './App.css';
import './ProductList.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // E-Commerce interaction states
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('luxestore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('luxestore_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('luxestore_theme') || 'dark';
  });

  // Apply theme to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('luxestore_theme', theme);
  }, [theme]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('luxestore_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart to localStorage', e);
    }
  }, [cart]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('luxestore_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not persist favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Robust Fetch Data Logic with Fallbacks & React 19 cleanup flag
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const cloudUrl = 'https://divyansh-gupta.onrender.com/api/data';
      const localUrl = 'http://localhost:3000/api/data';

      const fetchWithTimeout = async (url, timeoutMs = 8000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return await res.json();
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      };

      try {
        // 1. Try Cloud API first
        const rawData = await fetchWithTimeout(cloudUrl, 7000);
        const cleanProducts = Array.isArray(rawData) ? rawData : rawData?.products || [];
        if (!ignore) {
          if (cleanProducts.length > 0) {
            setProducts(cleanProducts);
            setLoading(false);
            return;
          }
          throw new Error('Cloud response returned empty array');
        }
      } catch {
        // 2. Try Local API fallback
        try {
          const rawLocal = await fetchWithTimeout(localUrl, 2500);
          const cleanLocal = Array.isArray(rawLocal) ? rawLocal : rawLocal?.products || [];
          if (!ignore && cleanLocal.length > 0) {
            setProducts(cleanLocal);
            setLoading(false);
            return;
          }
        } catch {
          // Local also failed
        }

        // 3. Graceful offline fallback with full dataset
        if (!ignore) {
          setProducts(fallbackProducts);
          setIsOfflineFallback(true);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleManualRetry = async () => {
    setLoading(true);
    setError(null);
    setIsOfflineFallback(false);

    const cloudUrl = 'https://divyansh-gupta.onrender.com/api/data';
    const localUrl = 'http://localhost:3000/api/data';

    const fetchWithTimeout = async (url, timeoutMs = 8000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return await res.json();
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    try {
      const rawData = await fetchWithTimeout(cloudUrl, 7000);
      const cleanProducts = Array.isArray(rawData) ? rawData : rawData?.products || [];
      if (cleanProducts.length > 0) {
        setProducts(cleanProducts);
        setLoading(false);
        showToast('Successfully connected to cloud API!', 'success');
        return;
      }
      throw new Error('Empty');
    } catch {
      try {
        const rawLocal = await fetchWithTimeout(localUrl, 2500);
        const cleanLocal = Array.isArray(rawLocal) ? rawLocal : rawLocal?.products || [];
        if (cleanLocal.length > 0) {
          setProducts(cleanLocal);
          setLoading(false);
          showToast('Connected to local backend!', 'success');
          return;
        }
      } catch {
        // failed
      }
      setProducts(fallbackProducts);
      setIsOfflineFallback(true);
      setLoading(false);
      showToast('Live API unavailable; loaded catalog offline.', 'info');
    }
  };

  // Derived category list
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Cart operations
  const handleAddToCart = useCallback((product, qty = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
    showToast(`Added "${product.title}" to your bag!`);
  }, [showToast]);

  const handleUpdateQuantity = useCallback((productId, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      showToast('Item removed from shopping bag', 'info');
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQty } : item
        )
      );
    }
  }, [showToast]);

  const handleRemoveFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from bag', 'info');
  }, [showToast]);

  const handleCheckout = useCallback(() => {
    setCart([]);
    setIsCartOpen(false);
    showToast('🎉 Order placed successfully! Thank you for testing LuxeStore.', 'success');
  }, [showToast]);

  // Favorite toggle
  const handleToggleFavorite = useCallback((productId) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      if (isFav) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to saved favorites!', 'success');
        return [...prev, productId];
      }
    });
  }, [showToast]);

  const cartTotalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleExploreClick = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={favorites.length}
        theme={theme}
        toggleTheme={toggleTheme}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categories={categories}
      />

      {/* Hero Section */}
      <Hero
        totalProducts={products.length}
        onExploreClick={handleExploreClick}
      />

      {/* Main Content / Product Catalog */}
      <main>
        <ProductList
          products={products}
          loading={loading}
          error={error}
          isOfflineFallback={isOfflineFallback}
          onRetry={handleManualRetry}
          onQuickView={(p) => setModalProduct(p)}
          onAddToCart={handleAddToCart}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
        />
      </main>

      {/* Quick View Product Modal */}
      <ProductModal
        key={modalProduct?.id || 'none'}
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Professional Footer */}
      <footer className="footer-wrapper">
        <div className="container footer-container">
          <div className="footer-brand-col">
            <div className="brand-logo-icon small">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <span className="footer-brand-title">Luxe<span className="brand-gradient">Store</span></span>
            <p className="footer-desc">
              Your destination for handpicked luxury essentials, verified authenticity,
              and frictionless modern shopping experiences.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Curated Categories</h4>
            <ul>
              {categories.map((c) => (
                <li key={c}>
                  <button onClick={() => { setActiveCategory(c); handleExploreClick(); }}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Customer Trust</h4>
            <ul>
              <li><span>Free 30-Day Returns</span></li>
              <li><span>Direct Manufacturer Warranty</span></li>
              <li><span>Encrypted & Secure Checkout</span></li>
              <li><span>24/7 Priority Support</span></li>
            </ul>
          </div>

          <div className="footer-newsletter-col">
            <h4>Stay Connected</h4>
            <p>Get exclusive early access to limited edition product drops.</p>
            <div className="footer-input-row">
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button className="btn btn-primary" onClick={() => showToast('Subscribed to VIP drops!')}>
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="container footer-bottom-container">
            <p>© {new Date().getFullYear()} LuxeStore Marketplace. All rights reserved.</p>
            <div className="footer-badges">
              <span className="footer-pill">⚡ Powered by Vite & React 19</span>
              <span className="footer-pill">🛡️ SSL Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;