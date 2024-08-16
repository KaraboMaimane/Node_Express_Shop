const Product = require("../models/product"); // usually calling classes with the capital letter
exports.getAddProduct = (req, res, next) => {
    console.log("Admin > GET addProduct");
    res.render("admin/add-product", {
      pageTitle: "Add Product Page",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
    });
  };
  
  exports.postAddProduct = (req, res, next) => {
    console.log("Admin > POST add product: ", req.body);
    const {title, imageUrl, description, price} = req.body;
    const product = new Product(title, imageUrl, description, price); // We instantiate the product class
    product.save(); // Inside the class we save the product information
    res.redirect("/");
  };

  exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
      console.log("Admin > GET all products callback: ", { products: products });
      // We render a page with data
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      }); // We call an absolute path but the path module builds it up for us
    }); // We fetch the product data thats within the static method in the class hence we dont add 'new'
  }