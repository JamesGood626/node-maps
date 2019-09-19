var express = require('express');
var router = express.Router();
const { authorizeRequest } = require("../middleware")

router.use(authorizeRequest)

router.get('/', (req, res) => {
  // Use req.currentUser as the user performing the action
  console.log("the req.currentUser: ", req.currentUser)
  res.send("console logged the res session!")
})


module.exports = router;