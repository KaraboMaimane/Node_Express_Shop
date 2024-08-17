const fs = require("fs");
const path = require("path");

// Construct the file path for the cart data
const p = path.join(
  path.dirname(require.main.filename),
  "data", // Navigate to the 'data' folder
  "cart.json" // The file name
);

module.exports = class Cart {
  static addProduct(id, productPrice, cb) {
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

      cb(cart)

      // Write the updated cart data back to the file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err); // Log any errors during writing
      });
    });
  }

  static deleteProduct(id, productPrice, cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return; // Error handling: If there's an error reading the file, exit the function.

      const updatedCart = { ...JSON.parse(fileContent) }; // Parse the file content (assumed to be JSON) and create a copy of the cart data.

      const product = updatedCart.products.find((prod) => prod.id === id); // Find the product to be deleted within the cart.

      if(!product) { 
        return; // If the product is not found, exit the function without making any changes.
      }

      const { qty } = product; // Extract the quantity of the product to be deleted.

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      ); // Filter the products array to remove the product with the matching ID.

      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * qty; // Update the total price by subtracting the cost of the deleted product.

      cb(updatedCart); // Execute the callback function, passing the updated cart data. This allows for further actions after deletion (e.g., re-rendering the cart).

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err); // Write the updated cart data back to the file. If there's an error, log it to the console (basic error handling).
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);

      if(err){
        cb(null)
      }
      cb(cart);
    });
  }
};
