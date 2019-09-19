var express = require('express');
var router = express.Router();
let passport = require('passport')

let userController = require('./controllers/userController')


/* GET users listing. */
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  res.send('User API');
});

router.post('/signup', userController.signup)

router.post('/signin', userController.signin)

module.exports = router;
