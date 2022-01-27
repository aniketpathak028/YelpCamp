const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });

// import utilities
const catchAsync = require("../utilities/catchAsync");

// import controllers
const users = require("../controllers/users");

// routes
router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
