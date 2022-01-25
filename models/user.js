const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

// user schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
  }
});

// add plugin for passport-local-mongoose
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);
