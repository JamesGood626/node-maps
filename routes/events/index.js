var express = require("express");
var router = express.Router();
const { createEvent, createComment, getEvent } = require("./service");

const { authorizeRequest } = require("../middleware");

router.use(authorizeRequest);
/* GET users listing. */
router.get("/", function(req, res, next) {
  // Use req.currentUser as the user performing the action
  // console.log("the req.currentUser: ", req.currentUser);
  res.send("console logged the res session!");
  // NOTE: Responses will always be sent in this format:
  // res.json({ data: {} })
});

router.get("/:eventId", getEvent);
router.post("/", createEvent);
router.post("/comment", createComment);

module.exports = router;
