// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Import the HomePage CSS

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Online Shopping System</h1>
      <p className="home-subtitle">Discover a wide range of products at competitive prices. Start shopping now!</p>
      
      <div className="home-actions">
        <Link to="/login" className="home-action-link">Login</Link>
        <Link to="/register" className="home-action-link secondary">Register</Link>
      </div>
      
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🛒</div>
          <h3 className="feature-title">Easy Shopping</h3>
          <p className="feature-description">Browse through our catalog and find exactly what you're looking for.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3 className="feature-title">Fast Delivery</h3>
          <p className="feature-description">Get your products delivered right to your doorstep in no time.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3 className="feature-title">Best Prices</h3>
          <p className="feature-description">Enjoy competitive prices and regular discounts on all products.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;