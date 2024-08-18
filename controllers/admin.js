const Product = require("../models/product"); // usually calling classes with the capital letter
exports.getAddProduct = (req, res, next) => {
  console.log("Admin > GET addProduct");
  res.render("admin/edit-product", {
    pageTitle: "Add Product Page",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("Admin > POST add product: ", req.body);
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(null, title, imageUrl, description, price); // We instantiate the product class
  product.save().then(() => {
    res.redirect("/");
  }).catch(err => console.log); // Inside the class we save the product information
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const { productId } = req.params;

  Product.findById(productId, (product) => {

    if(!product) {
      return res.redirect("/")
    }
    console.log(`Admin > GET editProduct > Product find by id ${productId}`, {product});

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {productId, title, price, imageUrl, description} = req.body;
  const updatedProduct = new Product(productId, title, imageUrl, description, price);

  updatedProduct.save();

  res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {
  const {productId} = req.params;

  console.log(req.params);

  Product.deleteProductById(productId, (product) => {
    console.log(`POST deleteProductById: ${productId}`, {product});

    res.redirect('/admin/products');

  });

}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log("Admin > GET all products callback: ", { products: products });
    // We render a page with data
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    }); // We call an absolute path but the path module builds it up for us
  }); // We fetch the product data thats within the static method in the class hence we dont add 'new'
};
