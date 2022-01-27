const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");

// import utilities
const catchAsync = require("../utilities/catchAsync");

// import controllers
const users = require("../controllers/users");

// routes

router.get("/register", users.renderRegisterForm);

router.post("/register", catchAsync(users.register));

router.get("/login", users.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

router.get("/logout", users.logout);

module.exports = router;
