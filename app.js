const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const catchAsync = require('./utilities/catchAsync');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const campgrounds = require('./Routes/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("CONNECTED TO MONGO!");
    })
    .catch((err) => {
        console.log("COULDN'T CONNECT TO MONGO! ERROR!!");
        console.log(err);
    })

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req,res) => {
    res.render('home');
})

app.use('/campgrounds', campgrounds);

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review({ ...req.body.review });
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

// if no routes are matched, the req lands here
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Error handling middleware function - Catches all the errors thrown anywhere in the app
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // setting a default status code
  if (!err.message) err.message = "Something Went Wrong!"; // setting a default error message
  res.status(statusCode).render("error", { err }); // render the error template with the status code and err message
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
});