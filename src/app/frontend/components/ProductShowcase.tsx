import { useState, useEffect } from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { getProducts, Product } from '../services/contentService';
import '../styles/ProductShowcase.css';

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <section className="product-showcase-section" id="products">
      <div className="container">
        {/* Header */}
        <div className="showcase-header">
          <div className="header-content">
            <div className="header-badge">
              <ShoppingBag size={16} />
              <span>Premium Selection</span>
            </div>
            <h2 className="showcase-title">Our Exclusive Products</h2>
            <p className="showcase-subtitle">
              Discover our curated collection of premium beauty and wellness products,
              specially selected to enhance your salon experience
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading our exclusive products...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <Package size={48} />
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>No products found in this category</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                {/* Image Container */}
                <div className="product-image-container">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <Package size={48} />
                    </div>
                  )}

                  {/* Category Tag */}
                  <div className="category-tag">{product.category}</div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>

                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}

                  {/* Price */}
                  <div className="product-price-section">
                    <span className="price-label">Price</span>
                    <span className="price">₹{product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Count */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="products-count">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>
    </section>
  );
}
