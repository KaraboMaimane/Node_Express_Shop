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
  User.findById("66c66f8840dc5ca07c71eb67") // still hardcoded till we add our auth functionality
    .then((userResult) => {
      // console.log("🚀 ~ POST login .then ~ userResult:", userResult);
      req.session.user = userResult;
      req.session.isLoggedIn = true;
      // console.log("🚀 Post login ~ .then ~ req.session:");


      req.session.save().then(result => {
        return
      })
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      res.redirect("/");

    });

};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.error(err);
    res.redirect('/');
  })
};
