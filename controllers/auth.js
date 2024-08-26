// Node Imports
const bcrypt = require("bcryptjs");

// Custom Imports
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log("Auth > GET login");
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    editing: true,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((userResult) => {
      if (!userResult) {
        return res.redirect("/login");
      }
      // We then compare the hashed values against the record in the database;
      bcrypt
        .compare(password, userResult.password)
        .then((doMatch) => {
          console.log("🚀 POST Login ~ .then ~ doMatch:", doMatch);

          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = userResult;

            return req.session.save((result) => {
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.error(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  console.log("Auth > GET signup");
  console.log(req.session.isLoggedIn);
  res.render("auth/signup", {
    pageTitle: "Signup Page",
    path: "/signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  // Check to see if a user possesing this email exists
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }

      return bcrypt.hash(password, 12).then((passwordHashResult) => {
        //Initialize a new user
        const user = new User({
          email: email,
          password: passwordHashResult,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .catch((err) => {
      console.log(err);
    })

    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
