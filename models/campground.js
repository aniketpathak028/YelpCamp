// require packages and files
const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

// Image Schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

// campground schema
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// post middleware that run whenever findByIdAndDelete method is executed on Campground model
// used to delete all reviews associated to a campground model after it has been deleted
CampgroundSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  } else {
    next();
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
