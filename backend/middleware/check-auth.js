const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_password_but_not_so_secret_password");
    req.userData = {
      userName: decodedToken.userName,
      userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not Authenticated!" });//not authenticated
  }
};

//to check whether authenticated or not
