const express = require("express");
const multer = require("multer");

const Book = require("../models/booksModel");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

//books
router.post (
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req,res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const book = new Book ({
      title: req.body.title,
      isbn: req.body.isbn,
      publicationDate: req.body.publicationDate,
      author: req.body.author,
      publications: req.body.publications,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
  });
  console.log (book);

  book
    .save()
    .then(createdBook => { //save - provided by mongoose
      res.status(201).json({
        message: "Book added successfully",
        bookId: {
          ...createdBook,
          id: createdBook._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a book failed!"
      });
    });
});

//for edit/update
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }

    const book = new Book({
      _id: req.body.id,
      title: req.body.title,
      isbn: req.body.isbn,
      publicationDate: req.body.publicationDate,
      author: req.body.author,
      publications: req.body.publications,
      imagePath: imagePath,
      creator: req.userData.userId
    });
  console.log(book);

  Book.updateOne(
    { _id: req.params.id, creator: req.userData.userId}, book)
    .then(result => {
      console.log (result);

      if (result.matchedCount > 0) { //not nModified and modifiedCount
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
  })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't edit the book!"//catch will only be reached if something goes wrong technically above
    });
  });
});


//get book
router.get ("", (req,res,next) => {
  Book.find().then(documents => {
    res.status(200).json({
      message: "Books fetched successfully!",
      books: documents
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching books failed!"
    });
  });
});

//get book by id
router.get("/:id", (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching a book failed!"
    });
  });
});

//delete book
router.delete("/:id", checkAuth, (req, res, next) => {
  Book.deleteOne({ _id: req.params.id, creator: req.userData.userId })
  .then(result => {
    console.log(result);
    if (result.deletedCount > 0) { // not n
      res.status(200).json({ message: "Book deleted!" });
    } else {
      res.status(401).json({ message: "User not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Deleting book failed!"
    });
  });
});

module.exports = router;
