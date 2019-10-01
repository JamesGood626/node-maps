const jwt = require("jsonwebtoken");

const authorizeRequest = (req, res, next) => {
  console.log("the request in middleware: ", req.session.rememberToken);
  jwt.verify(req.session.rememberToken, process.env.SECRET_KEY, function(
    err,
    decoded
  ) {
    if (err) {
      console.log("err decoding token: ", err);
      res.json({
        status: 400,
        message: "Invalid session."
      });
    }
    console.log("got the username: ", decoded.username);
    console.log("got the id: ", decoded.id);
    // TODO:
    req.currentUser = { id: decoded.id, username: decoded.username };
  });

  console.log("calling next to pass into next controller");
  next();
};

module.exports = {
  authorizeRequest
};

// {
// 	"email": "testuser8@gmail.com",
// 	"username": "testuser8",
// 	"password": "testpass"
// }
