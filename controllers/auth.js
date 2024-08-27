// Node Imports
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Custom Imports
const User = require("../models/user");
const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_ENDPOINT,
  port: 587,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Only use this option if you experience TLS-related issues
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  message = message.length > 0 ? message[0] : null;

  // console.log("Auth > GET login");
  // console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    errorMessage: message, // takes the error key being passed through
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((userResult) => {
      if (!userResult) {
        req.flash("error", "Invalid email or password.");
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

          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.error(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");

  message = message.length > 0 ? message[0] : null;

  console.log("Auth > GET signup");
  console.log(req.session.isLoggedIn);
  res.render("auth/signup", {
    pageTitle: "Signup Page",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  // Check to see if a user possesing this email exists
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists.");
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((passwordHashResult) => {
          //Initialize a new user
          const user = new User({
            email: email,
            password: passwordHashResult,
            cart: { items: [] },
          });

          return user.save().then(result => {
            return transporter
            .sendMail({
              to: process.env.SMTP_DEFAULT_EMAIL,
              // to: email,
              from: "mailtrap@demomailtrap.com",
              subject: "Signup Success!",
              html: `<h1>${email} has successfully signed up to the Node Shop!!!</h1>`,
            })
          });
          
        })
        .catch((err) => {
          console.log("Nodemailer Error: ", err);
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
