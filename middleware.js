const Campground = require("./models/campground");
const Review = require('./models/review');

// middleware to ensure user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

// middleware to ensure the request is sent by the author
module.exports.isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'Sorry! You do not have permission to do that :(');
    return res.redirect(req.session.redirectTo ? req.session.redirectTo : '/campgrounds');
  }
  next();
}

// middleware to ensure the create review request is sent by the author
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findById(id);
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Sorry! You do not have permission to do that :(");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
};
