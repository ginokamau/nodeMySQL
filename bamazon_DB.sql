DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price_customer DECIMAL(5,2),
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Baby Wipes","Baby","13.99","26");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Cookware","Home & Kitchen","39.99","9");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Jenga Classic Game","Toys & Games","6.88","34");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("HP Officejet Printer","Office Products","59.89","16");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Portable Bluetooth Speaker","Electronics","21.24","4");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Teether Keys","Baby","3.88","19");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Wall Sconce(2Pk)","Home & Kitchen","37.98","3");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Hasbro Connect 4 Game","Toys & Games","6.89","54");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Paper Trimmer","Office Products","21.96","3");
INSERT INTO products (product_name,department_name,price_customer,stock_quantity)
VALUES ("Electric Pencil Sharpener","Electronics","22.19","36");
