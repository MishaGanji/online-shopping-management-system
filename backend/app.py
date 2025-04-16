from flask import Flask, jsonify, request, send_from_directory
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

# Initialize Flask with static folder
app = Flask(__name__, static_folder='static')
CORS(app)  # This allows all domains to access the API

# Connect to MySQL database
import os
from dotenv import load_dotenv
load_dotenv()

db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

# @app.route('/')
# def home():
#     return send_from_directory(app.static_folder, 'index.html')

# @app.route('/<path:path>')
# def serve_static(path):
#     return send_from_directory(app.static_folder, path)

@app.route('/products')
def get_products():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    return jsonify(products)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = generate_password_hash(data['password'])

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", 
                       (name, email, password))
        db.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful", "user_id": user['user_id']}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/add-to-cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id = data['user_id']
    product_id = data['product_id']
    quantity = data.get('quantity', 1)

    cursor = db.cursor(dictionary=True)
    
    # Check if item already in cart
    cursor.execute("SELECT * FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    existing = cursor.fetchone()

    if existing:
        # Update quantity
        new_quantity = existing['quantity'] + quantity
        cursor.execute("UPDATE cart SET quantity = %s WHERE cart_id = %s", (new_quantity, existing['cart_id']))
    else:
        # Insert new item
        cursor.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",
                       (user_id, product_id, quantity))

    db.commit()
    return jsonify({"message": "Product added to cart"}), 200

@app.route('/view-cart', methods=['GET'])
def view_cart():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    cursor = db.cursor(dictionary=True)
    
    # Query to get all items in the user's cart, with product details
    cursor.execute("""
        SELECT cart.cart_id, products.name, products.price, cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.product_id
        WHERE cart.user_id = %s
    """, (user_id,))
    
    cart_items = cursor.fetchall()
    
    if not cart_items:
        return jsonify({"message": "Your cart is empty"}), 200
    
    return jsonify(cart_items), 200

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    user_id = data['user_id']
    
    cursor = db.cursor(dictionary=True)

    # Get cart items for the user
    cursor.execute("""
        SELECT cart.cart_id, cart.product_id, products.name, products.price, cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.product_id
        WHERE cart.user_id = %s
    """, (user_id,))
    
    cart_items = cursor.fetchall()

    if not cart_items:
        return jsonify({"error": "Your cart is empty"}), 400

    # Verify if all cart products exist in the products table
    for item in cart_items:
        if not item['product_id']:
            return jsonify({"error": f"Product with ID {item['product_id']} does not exist in the database"}), 400

    # Calculate the total amount of the order
    total_amount = sum(item['price'] * item['quantity'] for item in cart_items)

    # Create an order entry
    cursor.execute("""
        INSERT INTO orders (user_id, total_amount, status)
        VALUES (%s, %s, 'pending')
    """, (user_id, total_amount))
    
    # Get the order ID (last inserted ID)
    order_id = cursor.lastrowid
    
    # Add items to the order_items table
    for item in cart_items:
        cursor.execute("""
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (%s, %s, %s, %s)
        """, (order_id, item['product_id'], item['quantity'], item['price']))

    # Clear the user's cart after checkout
    cursor.execute("DELETE FROM cart WHERE user_id = %s", (user_id,))
    
    db.commit()
    
    return jsonify({
        "message": "Order placed successfully",
        "order_id": order_id,
        "total_amount": total_amount
    }), 200

if __name__ == '__main__':
    app.run(debug=True)