var express = require('express');
var router = express.Router();
let passport = require('passport')

let userController = require('./controllers/userController')


/* GET users listing. */
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  res.send('User API');
});

router.post('/sign-up', async function(req, res, next){
  const result = await userController.signup(req.body)
  console.log(result)
  res.send(result)
  // if (result.confirmation) {
  //   res.json(result)
  // } else {
  //   res.status(result.status).json(result)
  // }
})

router.post('/sign-in', async function(req, res, next){
  
  const result = await userController.signin(req.body)
  console.log("result in controller", result)
  res.json(result)
  // try {
    // const result = await userController.signin(req.body)
    // console.log(result)
    // res.json(result)
  // } catch (e) {

  //   res.json(e)

  // }

  //res.json(result)
  // result
  //   .then(result => {
  //     console.log(result)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })

  //res.send('hellel')
  // res.send(result.confirmation)
  // if (result.confirmation) {
  //   res.send(result)
  // } else {
  //   res.status(result.status).send(result)
  // }
})

module.exports = router;
