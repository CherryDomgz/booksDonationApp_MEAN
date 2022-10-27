const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema ({

  title : {
    type: String,
    required: true
  },

  isbn: {
      type: String,
      required: true
  },

  publicationDate : {
    type: String,
    required: true
  },

  author: {
      type: String,
      required: true
  },

  publications: {
    type: String,
    required: true
  },

  imagePath : {
      type: String,
      required: true,
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true }

}, {timestamps: true});

module.exports = mongoose.model ('Book', bookSchema);


