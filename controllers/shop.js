const Product = require("../models/product"); // usually calling classes with the capital letter

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log("GET all products callback: ", { products: products });
    // We render a page with data
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products"
    }); // We call an absolute path but the path module builds it up for us
  }); // We fetch the product data thats within the static method in the class hence we dont add 'new'
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log("GET all products callback: ", { products: products });
    // We render a page with data
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop Home",
      path: "/"
    }); // We call an absolute path but the path module builds it up for us
  }); // We fetch the product data thats within the static method in the class hence we dont add 'new'
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};