# Online Shopping Management System

This project is an online shopping system built with a Flask backend and a React frontend. The system includes user registration, login, product listing, cart management, and checkout functionalities. It uses MySQL for data storage.

## 📋 Overview

This Online Shopping Management System provides a comprehensive solution for managing products, user accounts, shopping carts, and the checkout process. The application features a responsive user interface with product browsing, user authentication, cart management, and order processing functionality.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Product Management**: Browse, search, and filter products by categories
- **Shopping Cart**: Add, remove, and update product quantities
- **Checkout Process**: Seamless order placement and payment processing


## Tech Stack

- **Frontend**: React.js (v19.1.0), HTML, CSS
- **Backend**: Flask (Python), MySQL
- **Database**: MySQL

## Setup

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/MishaGanji/online-shopping-management-system.git
    cd backend
    ```

2. Install the necessary Python packages:

3. Set up the `.env` file for sensitive configurations:

    ```bash
    # Example .env file for the backend
    MYSQL_HOST=your-mysql-host
    MYSQL_USER=your-mysql-user
    MYSQL_PASSWORD=your-mysql-password
    MYSQL_DATABASE=your-database-name
    ```

4. Run the Flask backend:

    ```bash
    python backend/app.py
    ```

### Frontend Setup

1. Navigate to the frontend folder:

    ```bash
    cd o-frontend
    ```

2. Install the required Node.js dependencies:


3. Run the React frontend:

    ```bash
    npm start
    ```

### Running the Full Application

Once both the frontend and backend are running, the application will be available at `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend.

## Directory Structure

- **backend/**: Contains the Flask application, including API routes and database models.
- **o-frontend/**: Contains the React frontend with pages for Login, Register, Products, Cart, and Checkout.

## 📷 Screenshots
![Shopping Cart](o-frontend/ouputs/1.png)
![Shopping Cart](o-frontend/ouputs/2.png)
![Shopping Cart](o-frontend/ouputs/3.png)
![Shopping Cart](o-frontend/ouputs/4.png)
![Shopping Cart](o-frontend/ouputs/5.png)
![Shopping Cart](o-frontend/ouputs/6.png)
