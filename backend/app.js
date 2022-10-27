const path = require("path");
const express = require ('express');
const mongoose = require ('mongoose');

const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

const app = express ();

//Setting up Mongo DB Atlas
mongoose
  .connect (
    "mongodb+srv://CherryD:q72JZv0xMNK8PgSD@school-projects-cluster.vuqi9wf.mongodb.net/librodb?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => {
      console.log("Connected to Mongo DB Atlas!");
  })

  .catch(() => {
      console.log("Connection failed!");
  });

//parsing data
app.use(express.json());
app.use(express.urlencoded({extended:false})); //instead of false, trying to solve user validator error

app.use("/images", express.static(path.join("backend/images")));

//to prevent CORS error
app.use ((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader (
  'Access-Control-Allow-Headers',
  "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  res.setHeader (
    'Access-Control-Allow-Methods',
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next ();
});

app.use("/api/books", booksRoutes);
app.use("/api/user", userRoutes)

module.exports = app;


