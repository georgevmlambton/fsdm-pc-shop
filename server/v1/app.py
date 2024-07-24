import math
from flask import Flask, request, jsonify, abort, make_response
import mysql.connector
import json
from dotenv import load_dotenv
from os import environ
from flask_cors import CORS, cross_origin

load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Stops flask.jsonify() from automatically sorting dictionaries.
app.json.sort_keys = False


def create_connection():
    db = mysql.connector.connect(
        host=environ['DB_HOST'], user=environ['DB_USER'], password=environ['DB_PASSWORD'], database=environ['DB_NAME'])
    return db


def get_user_id():
    if request.authorization == None or request.authorization.type != 'basic':
        abort(401)
    return request.authorization.get('username')


def get_products_query(search, category, offset):
    main_query = "SELECT * FROM product"
    count_query = "SELECT COUNT(*) as count FROM product"

    filters = []
    params = []

    if search:
        filters.append('name LIKE %s')
        params.append(f'%{search}%')

    if category:
        filters.append('category = %s')
        params.append(category)

    if len(filters) > 0:
        where_clause = " WHERE " + (" AND ".join(filters))
        main_query += where_clause
        count_query += where_clause

    main_query += f" LIMIT 50 OFFSET {offset}"
    return main_query, count_query, tuple(params)


@app.route('/products/featured', methods=['GET'])
@cross_origin()
def get_featured_products():
    db = create_connection()
    c_featuredProducts = db.cursor(dictionary=True)

    c_featuredProducts.execute(
        'SELECT details FROM product ORDER  BY RAND() LIMIT 4')
    details_data = c_featuredProducts.fetchall()

    c_featuredProducts.close()
    response_data = {"products": []}

    for index, details in enumerate(details_data, start=1):
        product_details = json.loads(
            details["details"]) if details["details"] else {}

        response_data["products"].append(product_details)

    response = jsonify(response_data)
    response.status_code = 200
    return response


@app.route('/products', methods=['GET'])
@cross_origin()
def get_products():
    args = request.args.to_dict()
    db = create_connection()

    search = args.get("search")
    category = args.get("category")
    page = int(args.get('page', 1))

    # Calculate OFFSET value based on the page number
    offset = (page - 1) * 50

    main_query, count_query, params = get_products_query(
        search, category, offset)

    cursor = db.cursor(dictionary=True)
    # Execute the main query to get product details
    cursor.execute(main_query, params)
    products = cursor.fetchall()

    # Execute the count query to get the total number of products
    cursor.execute(count_query, params)
    count_result = cursor.fetchone()

    total_count = count_result['count']

    # Calculate total pages
    total_pages = math.ceil(total_count / 50)

    # Parse details column as JSON
    for product in products:
        product['details'] = json.loads(product['details'])

    # Prepare the response JSON
    response = {
        "total_products": total_count,
        "total_pages": total_pages,
        "products": products
    }
    cursor.close()
    return jsonify(response)


@app.route('/products/<int:product_id>', methods=['GET'])
@cross_origin()
def get_product(product_id):
    db = create_connection()
    product_cursor = db.cursor()
    product_cursor.execute(
        'SELECT details FROM product WHERE id=%s', [product_id])

    product_data = product_cursor.fetchone()

    if product_data is None:
        response = make_response({"error": "Product not found"}, 404)
    else:
        response = make_response(json.loads(product_data[0]), 200)

    return response


@app.route('/cart', methods=['GET'])
@cross_origin()
def get_cart():
    db = create_connection()
    user_id = get_user_id()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM cart WHERE user_id=%s', [user_id])
    result = cursor.fetchall()
    cart = []
    for product in result:
        cart.append({
            "product_id": product[2],
            "quantity": product[3],
        })
    return jsonify({"cart": cart})


@app.route('/cart/add', methods=['POST'])
@cross_origin()
def add_to_cart():
    db = create_connection()
    user_id = get_user_id()
    addCart = request.get_json()
    product_id = addCart['product_id']
    quantity = addCart['quantity']
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM cart WHERE user_id=%s AND product_id=%s', (user_id, product_id))
    data = cursor.fetchone()
    if data is None:
        cursor.execute('INSERT INTO cart (`user_id`, `product_id`, `quantity`) VALUES (%s, %s, %s)',
                       (user_id, product_id, quantity))
    else:
        new_quantity = int(quantity) + data[3]
        cursor.execute('UPDATE cart SET quantity = %s WHERE user_id=%s AND product_id=%s',
                       (new_quantity, user_id, product_id))
    db.commit()

    cursor.execute('SELECT * FROM cart WHERE user_id=%s', [user_id])
    output = cursor.fetchall()
    result_list = []
    for row in output:
        result_dict = dict(zip(cursor.column_names, row))
        result_list.append(result_dict)
    response = jsonify({'cart': result_list})
    response.status_code = 200

    response.status_code = 200
    return response


@app.route('/cart/item/<product_id>', methods=['POST'])
@cross_origin()
def set_product_quantity(product_id):
    user_id = get_user_id()
    db = create_connection()
    cart_item = request.get_json()
    quantity = cart_item['quantity']
    cursor = db.cursor()
    cursor.execute('UPDATE cart SET quantity = %s WHERE user_id=%s AND product_id=%s',
                   (quantity, user_id, product_id))
    db.commit()
    cursor.execute('SELECT * FROM cart WHERE user_id=%s', [user_id])
    output = cursor.fetchall()
    result_list = []
    for row in output:
        result_dict = dict(zip(cursor.column_names, row))
        result_list.append(result_dict)
    response = jsonify({'cart': result_list})
    response.status_code = 200

    return response


@app.route('/cart/item/<product_id>', methods=['DELETE'])
@cross_origin()
def delete_from_cart(product_id):
    user_id = get_user_id()
    db = create_connection()
    cursor = db.cursor()
    cursor.execute('DELETE from cart WHERE user_id=%s AND product_id=%s', [
                   user_id, product_id])
    response = []
    db.commit()
    cursor.execute('SELECT * FROM cart WHERE user_id=%s', [user_id])
    output = cursor.fetchall()
    result_list = []
    for row in output:
        result_dict = dict(zip(cursor.column_names, row))
        result_list.append(result_dict)
    response = jsonify({'cart': result_list})
    response.status_code = 200
    return response


@app.route('/cart', methods=['DELETE'])
@cross_origin()
def clear_cart():
    user_id = get_user_id()
    db = create_connection()
    cursor = db.cursor()
    cursor.execute('DELETE from cart WHERE user_id=%s', [user_id])
    response = []
    db.commit()
    response = jsonify({
        "cart": []
    })

    response.status_code = 200
    return response


@app.route('/cart/checkout', methods=['POST'])
@cross_origin()
def checkout():
    # Get user_id from the Authorization header
    user_id = get_user_id()
    db = create_connection()
    cursor = db.cursor()

    # Find all items in the user's cart
    cursor.execute('SELECT * FROM cart WHERE user_id=%s', [user_id])
    cart_items = cursor.fetchall()

    # Check if the cart is empty
    if not cart_items:
        response = jsonify({"error": "Cart is empty"})
        response.status_code = 400
        return response

    order_id = generate_order_id(cursor)
    print(order_id)
    # Insert rows into the order_table for each item in the cart
    for item in cart_items:
        product_id = item[2]
        quantity = item[3]
        print(order_id)
        cursor.execute('INSERT INTO `order` (id, user_id, product_id, quantity) VALUES (%s, %s, %s, %s)',
                       (order_id, user_id, product_id, quantity))

    cursor.execute('DELETE FROM cart WHERE user_id=%s', [user_id])
    db.commit()

    # Return the order ID
    response = jsonify({"order_id": order_id})
    response.status_code = 200
    return response

# function to generate order id


def generate_order_id(cursor):
    cursor.execute('SELECT MAX(id) FROM `order`')
    max_order_id = cursor.fetchone()[0]

    if max_order_id is not None:
        new_order_id = max_order_id + 1
    else:
        new_order_id = 100

    return new_order_id


@app.route('/order/<order_id>', methods=['GET'])
@cross_origin()
def get_order(order_id):
    db = create_connection()
    user_id = get_user_id()
    # Getting the order from the table
    cursor = db.cursor()
    cursor.execute('SELECT * FROM `order` WHERE id=%s', [int(order_id)])
    order_data = cursor.fetchall()

    # If no order is found, return a 404 response
    if not order_data:
        response = make_response({"error": "Order not found"}, 404)
    else:
        order_items = [{"product_id": item[2], "quantity": item[3]}
                       for item in order_data]

        # Create a JSON response
        response_data = {"order": order_items}
        response = jsonify(response_data)

    db.close()

    return response


@app.route('/')
def home():
    return 'Hello, Flask!'


if __name__ == '__main__':
    app.run(debug=True)
