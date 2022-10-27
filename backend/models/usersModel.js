const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  firstName : {
    type: String,
    required: true
  },
  lastName : {
    type: String,
    required: true
  },
  userName : {
    type: String,
    required: true,
    unique: true //unique - does not act as a validator, allows mongoose and mongo db to do internal optimization
  },
  birthday : {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

}, {timestamps: true});


userSchema.plugin(uniqueValidator);// plugin- provided by mongoose, add an extra hook that checks data before it saves to the database

module.exports = mongoose.model("User", userSchema);
