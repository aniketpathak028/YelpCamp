const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams provides access to query params outside routes

// import models
const Campground = require("../models/campground");
const Review = require("../models/review");

// import utilities
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

// import middleware
const { isLoggedIn, isReviewAuthor } = require("../middleware");

// import controllers
const reviews = require("../controllers/reviews");

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
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
