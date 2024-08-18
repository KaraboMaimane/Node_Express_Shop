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
  console.log("Admin > POST add product: ", req.body);
  const { title, imageUrl, description, price } = req.body;

  req.user
    .createProduct({
      // Sequelize function auto associates Product and User
      title,
      price,
      imageUrl,
      description,
    })
    .then(() => {
      console.log("Product created!");
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

  req.user.getProducts({ where: { id: productId } })
  // Product.findByPk(productId)
    .then((products) => {
      console.log("get edit product");

      const product = products[0];
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
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;

      return product.save();
    })
    .then(() => {
      console.log("POST edit product > Updated result");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.params;

  console.log(req.params);

  Product.findByPk(productId)
    .then((product) => {
      return product;
    })
    .then((result) => {
      console.log(`POST deleteProductById: ${result.id}`, { result });
      result.destroy();
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  // We fetch the product data thats within the static method in the class hence we dont add 'new'
  req.user.getProducts()
  // Product.findAll()
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
