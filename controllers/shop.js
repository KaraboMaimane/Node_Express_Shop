const Product = require("../models/product"); // usually calling classes with the capital letter
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      // We render a page with data
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      }); // We call an absolute path but the path module builds it up for us
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  console.log("callback");
  Product.findById(productId).then(([product]) => {
res.render("shop/product-detail", {
    product: product[0],
    pageTitle: product[0].title,
    path: `/products`,
  });
  }).catch(err => console.log(err));

  
};

exports.getIndex = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      // We render a page with data
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop Home",
        path: "/",
      }); // We call an absolute path but the path module builds it up for us
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price, (cart) => {
      console.log("Shop controller > POST cart > find by ID: > Add product ", {
        productId,
        product,
        updatedCart: cart,
      });

      res.redirect("/cart");
    });
  });
};

exports.postCartDeleteProductItem = (req, res, next) => {
  const { productId } = req.body; // Remember that the name is defined in the html input name
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price, (products) => {
      console.log(`POST cart delete product item ${productId}`, {
        updatedProducts: products,
      });
      res.redirect("/cart");
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
