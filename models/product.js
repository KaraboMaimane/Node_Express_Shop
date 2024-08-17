const products = [];
const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
  return products;
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      // Fetch existing products from file asynchronously

      if (this.id) {
        // Check if the product already has an id
        // Update existing product

        const existingProductIndex = products.findIndex(
          // Find the index of the product to update
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products]; // Create a copy of the products array
        updatedProducts[existingProductIndex] = this; // Replace the existing product with the updated one

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          // Write the updated products back to the file
          console.log(err); // Log any errors that occur during writing
        });
      } else {
        // Add new product

        this.id = Math.random().toString(); // Generate a random id for the new product
        products.push(this); // Add the new product to the array

        fs.writeFile(p, JSON.stringify(products), (err) => {
          // Write the updated products back to the file
          console.log(err); // Log any errors that occur during writing
        });
      }
    });
  }

  // static makes us call the function on the class directly without instatiating it
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
