import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import './styles/App.css'; // Import the main CSS

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_id'));

  const handleLogin = (userId) => {
    localStorage.setItem('user_id', userId);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">Online Shopping System</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <div className="container">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/">Home</Link></li>
            {!isLoggedIn && <li className="nav-item"><Link to="/login">Login</Link></li>}
            {!isLoggedIn && <li className="nav-item"><Link to="/register">Register</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link to="/products">Products</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link to="/cart">Cart</Link></li>}
            {isLoggedIn && <li className="nav-item"><Link to="/checkout">Checkout</Link></li>}
            {isLoggedIn && <li className="nav-item"><button onClick={handleLogout}>Logout</button></li>}
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <main className="app-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
            <Route
              path="/products"
              element={isLoggedIn ? <ProductsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/cart"
              element={isLoggedIn ? <CartPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/checkout"
              element={isLoggedIn ? <CheckoutPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;