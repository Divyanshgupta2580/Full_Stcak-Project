import { useEffect, useState } from 'react';
import ProductList from './ProductList';
import { fallbackProducts } from './data/fallbackProducts';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        const response = await fetch('https://divyansh-gupta.onrender.com/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        const productList = Array.isArray(data) ? data : (data.products || []);

        if (!ignore) {
          setProducts(productList);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Cloud API fetch failed, trying fallback:', err.message);

        // Fallback to local server or sample products
        try {
          const localRes = await fetch('http://localhost:3000/api/data');
          const localData = await localRes.json();
          const localList = Array.isArray(localData) ? localData : (localData.products || []);
          if (!ignore && localList.length > 0) {
            setProducts(localList);
            setLoading(false);
            return;
          }
        } catch {
          // Local server also not running
        }

        if (!ignore) {
          setProducts(fallbackProducts);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="app-container">
      <ProductList products={products} loading={loading} />
    </div>
  );
}

export default App;