exports.get404 = (req, res, next) => {
  // This will be a catch-all route if the page doesnt exist
  res
    .status(404)
    .render("404", {
      pageTitle: "404: Page Not Found",
      path: "/404",
      isAuthenticated: req.session.isLoggedIn,
    }); // Remember to add the path
};
