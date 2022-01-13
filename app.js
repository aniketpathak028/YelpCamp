// import packages
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// import custom error class
const ExpressError = require("./utilities/ExpressError");

// import routes
const campgrounds = require("./Routes/campgrounds");
const reviews = require("./Routes/reviews");

// connect to mongoose
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("CONNECTED TO MONGO!");
  })
  .catch((err) => {
    console.log("COULDN'T CONNECT TO MONGO! ERROR!!");
    console.log(err);
  });

// run express and configure
const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// if no routes are matched, the req lands here
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error handling middleware function - Catches all the errors thrown anywhere in the app
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // setting a default status code
  if (!err.message) err.message = "Something Went Wrong!"; // setting a default error message
  res.status(statusCode).render("error", { err }); // render the error template with the status code and err message
});

// start server
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
