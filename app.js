// Node imports
const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

// Custom Imports
const errorController = require("./controllers/notFound");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

// View engines
app.set("view engine", "ejs");
app.set("views", "views");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//We can define our middleware functions below here hence the "next" argument
//Middleware basically is where we funnel our request through a bunch of functions before the response

app.use(bodyParser.urlencoded({ extended: false })); // parsing our request data input
app.use(express.static(path.join(__dirname, "public"))); // setting up our public folder to be referred

// we register this only not run it. It will only run when the database cod e has been initialized
// It gets fired off as a middleware function associating a User with products etc.
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Routes
// Note that there is some routes that have a prefix so that you dont have to manually add it on the routes file
app.use("/admin", adminRoutes); // we call upon our admin routes so we can use it on our server;
app.use(shopRoutes);

// app.use(errorController.get404);
app.use(errorController.get404);

// DB Associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

const PORT = process.env.PORT || 3000; // Setting up the deployment port

sequelize
    // .sync({ force: true }) // This method basically forces changes to happen in the database clearing existing fields
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log('result');
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Karabo Maimane",
        email: "maimane23@hotmail.com",
      });
    }
    return user;
  })
  .then((user) => {
    // console.log('current logged in user: ', {user});
    return user.createCart();
  }).then((cart) => {
    // console.log('Cart data: ', {cart});

    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
