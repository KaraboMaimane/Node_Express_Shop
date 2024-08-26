const Product = require("../models/product"); // usually calling classes with the capital letter
const Order = require("../models/order");
exports.getProducts = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  Product.find()
    .then((products) => {
      // console.log("🚀 GET Products ~ .then ~ products ~ success");
      // We render a page with data
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn

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
        isAuthenticated: req.session.isLoggedIn

      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  Product.find()
    .then((products) => {
      // We render a page with data
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop Home",
        path: "/"
      });
      
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  console.log("user: ", req.user);
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      const products = [...user.cart.items];

      // console.log("🚀 GET cart  ~ .then ~ products:");

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log("🚀 ~ Product.findById ~ result:", result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProductItem = (req, res, next) => {
  const { productId } = req.body; // Remember that the name is defined in the html input name
  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log("user order");
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }, // we extract the product data not just the id
        };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
        products: products,
      });

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((cartClearResult) => {
      // console.log("🚀 POST order ~ .then ~ cartClearResult:", cartClearResult);

      res.redirect("/orders");
    })
    .catch((err) => console.log("test error: ", err));
};

exports.getOrders = (req, res, next) => {
  console.log(req.user)
  Order.find({'user.userId': req.user._id})
    .then((orders) => {
      // console.log('orders', orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn

      });
    })
    .catch((err) => console.log(err));
};
