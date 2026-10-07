function ProductList({ products, loading }) {
  if (loading) {
    return (
      <div className="status-container">
        <p className="status-text">Loading products...</p>
      </div>
    );
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="status-container">
        <p className="status-text">No products available.</p>
      </div>
    );
  }

  return (
    <div className="product-list-wrapper">
      <header className="list-header">
        <h1 className="list-title">Products</h1>
        <span className="list-count">{products.length} items</span>
      </header>

      <div className="products-grid">
        {products.map((product, index) => {
          return (
            <div key={product.id || index} className="product-card">
              {product.thumbnail && (
                <div className="product-image-container">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="product-image"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="product-content">
                {product.category && (
                  <span className="product-category">{product.category}</span>
                )}
                <h2 className="product-title">{product.title}</h2>
                <p className="product-description">{product.description}</p>
                
                <div className="product-footer">
                  {product.price !== undefined && (
                    <span className="product-price">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  )}
                  {product.rating !== undefined && (
                    <span className="product-rating">
                      ★ {Number(product.rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;