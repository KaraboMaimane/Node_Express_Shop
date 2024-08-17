const fs = require("fs");
const path = require("path");

// Construct the file path for the cart data
const p = path.join(
  path.dirname(require.main.filename),
  "data", // Navigate to the 'data' folder
  "cart.json" // The file name
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Read the existing cart data from the file
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }; // Initialize an empty cart
      if (!err) {
        // If there's no error reading the file
        cart = JSON.parse(fileContent); // Parse the file content into a JavaScript object
      }

      // Find if the product already exists in the cart
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // If the product exists, increase its quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }; // Copy the existing product
        updatedProduct.qty = updatedProduct.qty + 1; // Increase quantity
        cart.products = [...cart.products]; // Create a new array to trigger React re-render (if used)
        cart.products[existingProductIndex] = updatedProduct; // Update the product in the array
      } else {
        // If the product doesn't exist, add it to the cart
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct]; // Add the new product
      }

      // Update the total price
      cart.totalPrice = cart.totalPrice + +productPrice;

      // Write the updated cart data back to the file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err); // Log any errors during writing
      });
    });
  }
};
