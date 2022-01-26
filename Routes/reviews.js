const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams provides access to query params outside routes

// import models
const Campground = require("../models/campground");
const Review = require("../models/review");

// import utilities
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

// import middleware
const {isLoggedIn} = require('../middleware');

// import Joi validation schema
const { reviewSchema } = require("../schemas");
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// routes
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review({ ...req.body.review });
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "Successfully added your review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted your review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
