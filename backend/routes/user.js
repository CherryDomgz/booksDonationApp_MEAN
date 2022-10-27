const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/usersModel");
//const { error } = require("@angular/compiler/src/util");

const router = express.Router();

router.post("/Signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)//10= salting rounds, the number, the longer it will take but safer and secure
  .then(hash => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      birthday: req.body.birthday,
      password: hash
    });
    user
      .save()
      .then(result => {
        console.log (result);
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        console.log (err);
        res.status(500).json({
          message: "Invalid authentication credentials!",
          error: err
        });
      });
  });
});

router.post("/Login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ userName: req.body.userName })
    .then(user => {
      if (!user) {
        //return res.status(401).json({
          //message: "Authentication failed" In the final state of the course code you will get an error in the nodemon terminal, if you try to authenticate with a wrong username.
        //});
        throw new Error('Authentication failed');
      }
      fetchedUser = user;//fetchedUser - to access the user data after the first block above
      return bcrypt.compare(req.body.password, user.password);//compare input to an encypted value and bcyrpt will tell us if the input field the same value
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid username/password"
        });
      }
      const token = jwt.sign(//jwt.sign-creates a new web token
        { userName: fetchedUser.userName, userId: fetchedUser._id },
        "secret_password_but_not_so_secret_password",
        { expiresIn: "1h" } //optional
      );
      res.status(200).json({
        token: token, //return token
        expiresIn: 3600, //send in seconds (duration) until it expire
        userId: fetchedUser._id //parser user id to the frontend
      });
    })
    .catch(err => {//other error
      console.log (err);
      return res.status(401).json({
        message: "Invalid authentication credentials!",
        error: err
      });
    });
});

module.exports = router;

//MongoServerError: user is not allowed to do action [insert] on [librodb.users] - go to the Database Access tab and make sure that your user has the readWriteAnyDatabase@admin; EDIT - change the Built-in Role to Read and Write to any Databases
