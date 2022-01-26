const Campground = require("./models/campground");

// middleware to ensure user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'Sorry! You do not have permission to do that :(');
    res.redirect(req.session.redirectTo ? req.session.redirectTo : '/campgrounds');
  }
  next();
}
