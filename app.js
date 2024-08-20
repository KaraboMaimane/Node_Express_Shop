// Node imports
const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

// Custom Imports
const errorController = require("./controllers/notFound");
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')

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
  User.findById('66c3fee74b3429972a0ec372')
    .then((user) => {
      console.log(user);
      req.user = new User(user.name, user.email, user.cart, user._id);
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


const PORT = process.env.PORT || 3000; // Setting up the deployment port

mongoConnect().then((result) => {
  console.log("🚀 mongoConnect ~ result ~ success!!!")
  app.listen(PORT, (() => {
    console.log(`🚀 Node.js server is live on port: ${PORT}`);
  }));
}).catch(err => console.error(err));

