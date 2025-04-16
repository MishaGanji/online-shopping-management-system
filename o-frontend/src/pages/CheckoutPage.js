// src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css'; // Import the Checkout CSS

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    state: '',
    paymentMethod: 'credit_card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login'); // Redirect to login if user is not logged in
    } else {
      fetchCartItems();
    }
  }, [userId, navigate]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/view-cart?user_id=${userId}`);
      if (res.data && res.data.length > 0) {
        setCartItems(res.data);
        const total = res.data.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalAmount(total);
      } else {
        // If cart is empty, redirect to products
        alert('Your cart is empty');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      alert('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/checkout', { 
        user_id: userId,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.postalCode}`,
        payment_method: formData.paymentMethod
      });
      
      if (res.data && res.data.message === 'Order placed successfully') {
        alert('Order placed successfully');
        navigate('/products'); // Navigate to products after successful checkout
      } else {
        alert('Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to complete checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="checkout-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2 className="checkout-title">Checkout</h2>
        <p className="checkout-subtitle">Complete your order</p>
      </div>
      
      <div className="checkout-content">
        <div className="checkout-form-container">
          <form onSubmit={handleSubmit}>
            <div className="checkout-section">
              <h3 className="section-title">Shipping Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className="form-input"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="checkout-section">
              <h3 className="section-title">Payment Method</h3>
              <div className="payment-methods">
                <div 
                  className={`payment-method ${formData.paymentMethod === 'credit_card' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('credit_card')}
                >
                  <input
                    type="radio"
                    id="credit_card"
                    name="paymentMethod"
                    className="payment-radio"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={() => {}}
                  />
                  <div className="payment-icon">💳</div>
                  <div className="payment-details">
                    <div className="payment-name">Credit/Debit Card</div>
                    <div className="payment-description">Pay securely with your card</div>
                  </div>
                </div>
                
                <div 
                  className={`payment-method ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('upi')}
                >
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    className="payment-radio"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={() => {}}
                  />
                  <div className="payment-icon">📱</div>
                  <div className="payment-details">
                    <div className="payment-name">UPI</div>
                    <div className="payment-description">Pay using UPI payment apps</div>
                  </div>
                </div>
                
                <div 
                  className={`payment-method ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('cod')}
                >
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    className="payment-radio"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => {}}
                  />
                  <div className="payment-icon">💵</div>
                  <div className="payment-details">
                    <div className="payment-name">Cash on Delivery</div>
                    <div className="payment-description">Pay when you receive your order</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div className="summary-item" key={item.cart_id || item.product_id}>
                <div className="summary-item-image">
                  {/* You can add an image here if available */}
                </div>
                <div className="summary-item-details">
                  <div className="summary-item-name">{item.name}</div>
                  <div className="summary-item-price">₹{item.price}</div>
                  <div className="summary-item-quantity">Qty: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-calculations">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">₹50.00</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tax</span>
              <span className="summary-value">₹{(totalAmount * 0.18).toFixed(2)}</span>
            </div>
            
            <div className="summary-row total-row">
              <span className="total-label">Total</span>
              <span className="total-value">₹{(totalAmount + 50 + totalAmount * 0.18).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;