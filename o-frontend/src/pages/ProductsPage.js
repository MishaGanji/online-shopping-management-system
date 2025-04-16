import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductsPage.css'; // Import the ProductsPage CSS

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (productId) => {
    if (!userId) {
      alert("Please log in first.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/add-to-cart', {
        user_id: userId,
        product_id: productId,
        quantity: 1
      });
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-title">Available Products</h2>
        <p className="products-subtitle">Browse our collection and add items to your cart</p>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.product_id} className="product-card">
              <div className="product-image-container">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="product-image" 
                  />
                ) : (
                  <div className="product-image-placeholder"></div>
                )}
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
                <p className="product-description">
                  {product.description || "No description available for this product."}
                </p>
                <div className="product-actions">
                  <button 
                    onClick={() => handleAddToCart(product.product_id)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;