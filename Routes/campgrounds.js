const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require('../cloudinary');
const upload = multer({storage});

// import utilities
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

// import middlewares
const { isLoggedIn, isAuthor } = require("../middleware");

// import controllers
const campgrounds = require("../controllers/campgrounds");

// import Joi validation schema
const { campgroundSchema } = require("../schemas");
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// routes
router.route("/")
  .get(catchAsync(campgrounds.index))
  .post(upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send('it worked!');
  })
  // .post(
  //   validateCampground,
  //   isLoggedIn,
  //   catchAsync(campgrounds.createCampground)
  // );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
