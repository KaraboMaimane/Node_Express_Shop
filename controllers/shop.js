const Product = require("../models/product"); // usually calling classes with the capital letter

exports.getProducts = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  Product.fetchAll()
    .then((products) => {
      // We render a page with data
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      }); // We call an absolute path but the path module builds it up for us
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: `/products`,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  Product.fetchAll()
    .then((products) => {
      // We render a page with data
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop Home",
        path: "/",
      }); // We call an absolute path but the path module builds it up for us
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      console.log(products);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};



exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId).then(product => {
    return req.user.addToCart(product);
  }).then(result => {
    // console.log("🚀 ~ Product.findById ~ result:", result);
    res.redirect("/cart");
  })
};

exports.postCartDeleteProductItem = (req, res, next) => {
  const { productId } = req.body; // Remember that the name is defined in the html input name
  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log("test error: ", err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
  .then(orders => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders
    });
  })
  .catch(err => console.log(err));
};