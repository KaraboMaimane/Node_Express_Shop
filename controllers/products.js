const Product  = require('../models/product'); // usually calling classes with the capital letter

exports.getAddProduct = (req, res, next) => {
  console.log("GET addProduct");
  res.render("add-product", {
    pageTitle: "Add Product Page",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('POST add product: ',req.body);
  const product = new Product(req.body.title); // We instantiate the product class
  product.save(); // Inside the class we save the product information
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll(); // We fetch the product data thats within the static method in the class hence we dont add 'new'
  console.log("GET all products: ", { products: products });
  // We render a page with data
  res.render("shop", {
    prods: products,
    pageTitle: "Shop Home",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  }); // We call an absolute path but the path module builds it up for us
};
