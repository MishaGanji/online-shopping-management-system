import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CartPage.css'; // Import the CartPage CSS

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/view-cart?user_id=${userId}`);
        if (response.data && Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
        setLoading(false);
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.post('http://localhost:5000/update-cart', {
        user_id: userId,
        product_id: itemId,
        quantity: newQuantity
      });
      
      // Update cart items locally
      setCartItems(prev => 
        prev.map(item => 
          item.product_id === itemId ? {...item, quantity: newQuantity} : item
        )
      );
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.post('http://localhost:5000/remove-from-cart', {
        user_id: userId,
        product_id: itemId
      });
      
      // Remove item from local state
      setCartItems(prev => prev.filter(item => item.product_id !== itemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Your Cart</h2>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p className="empty-cart-message">Your cart is empty</p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.product_id}>
                <div className="item-image">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="cart-item-image" 
                    />
                  ) : (
                    <div className="cart-image-placeholder"></div>
                  )}
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">₹{item.price}</p>
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="item-subtotal">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.product_id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">₹50.00</span>
            </div>
            <div className="summary-row total-row">
              <span className="total-label">Total</span>
              <span className="total-value">₹{(total + 50).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;