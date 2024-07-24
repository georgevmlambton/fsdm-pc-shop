import mysql.connector
from dotenv import load_dotenv
from os import environ
import json

load_dotenv()


db = mysql.connector.connect(
    host=environ['DB_HOST'], user=environ['DB_USER'], password=environ['DB_PASSWORD'], database=environ['DB_NAME'])

try:
    cursor = db.cursor()
    cursor.execute("SELECT * FROM product LIMIT 1")
    cursor.fetchall()
except:
    with open('server/content/products.json', 'r') as file:
        # Load the JSON data from the file
        data = json.load(file)
        cursor = db.cursor()

        cursor.execute("""
            CREATE TABLE `product` (
                `id` INT PRIMARY KEY,
                `name` VARCHAR(255) NOT NULL,
                `category` VARCHAR(20) NOT NULL,
                `details` LONGTEXT NOT NULL
            );""")

        cursor.execute("""
            CREATE TABLE cart (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id VARCHAR(16) NOT NULL,
                product_id INT,
                quantity INT DEFAULT 1,
                UNIQUE INDEX unique_user_product (user_id, product_id),
                FOREIGN KEY (product_id) REFERENCES product(id)
            );""")

        cursor.execute("""
            CREATE TABLE `order` (
                id INT PRIMARY KEY,
                user_id VARCHAR(16) NOT NULL,
                product_id INT NOT NULL,
                quantity INT DEFAULT 1,
                FOREIGN KEY (product_id) REFERENCES product(id),
                UNIQUE INDEX unique_user_product (id, user_id, product_id)
            );""")

        for product in data:
            cursor.execute(
                "INSERT INTO product (id, name, category, details) VALUES(%s, %s, %s, %s)", (product['id'], product['name'], product
                                                                                             ['category'], json.dumps(product)))
            print(f"Inserted product ID {product['id']}")
        db.commit()
