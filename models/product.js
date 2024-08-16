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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      // Remember to use arrow function so that 'this' doesnt lose its context
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        // Write it back into the file
        console.log("Save error > ", err);
      });
    });
  }

  // static makes us call the function on the class directly without instatiating it
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
