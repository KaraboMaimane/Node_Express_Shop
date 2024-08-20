const Product = require("../models/product"); // usually calling classes with the capital letter

exports.getAddProduct = (req, res, next) => {
  console.log("Admin > GET addProduct");
  res.render("admin/edit-product", {
    pageTitle: "Add Product Page",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, imageUrl } = req.body;
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );

  product
    .save()
    .then(() => {
      console.log(`POST add product > success!`, { product });
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  console.log("get edit product");

  if (!editMode) {
    return res.redirect("/");
  }

  const { productId } = req.params;

  Product.findById(productId)
    // Product.findByPk(productId)
    .then((product) => {
      console.log(
        "🚀 Get edit Product ~ Find by id ~ .then ~ product:",
        product
      );

      if (!product) {
        return res.redirect("/");
      }
      console.log(`Admin > GET editProduct > Product find by id ${productId}`, {
        product,
      });

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  const product = new Product(title, price, description, imageUrl, productId);

  product
    .save()
    .then(() => {
      console.log("POST edit product > Updated result");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.params;

  console.log(req.params);

  Product.deleteById(productId)
    .then((result) => {
      console.log("🚀 ~ exports.postDeleteProduct ~ result:", result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  Product.fetchAll()
    .then((products) => {
      console.log("Admin > GET all products callback: ", {
        products: products,
      });
      // We render a page with data
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      }); // We call an absolute path but the path module builds it up for us
    })
    .catch((err) => console.log(err));
};
