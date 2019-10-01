const User = require('../model/User')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const SIGNUP_SUCCESS_MESSAGE = "You've successfully signed up!"
const USER_ALREADY_EXISTS_MESSAGE = 'User with same email address already exists!'
const INCORRECT_SIGNIN_MESSAGE = 'Incorrect username or password'
const WHOOPS_MESSAGE = "Whoops, something went wrong."

const setSessionRememberToken = (req, token) => req.session.rememberToken = token

// For signout route (to clear/invalidate the cookie session)
const invalidateSession = (req) => req.session = null

const formatErrorResponse = ({ message }) => ({
    status: 400,
    message
})

module.exports = {
    signup: async (req, res, next) => {
        console.log("the request in signup: ", req.body)
        try {
            const user = await User.findOne({email: req.body.email})
                if (user){
                    console.log('user exists')
                    res.json(formatErrorResponse({ message: USER_ALREADY_EXISTS_MESSAGE }))
                } else {
                    try {
                        const hash = await argon2.hash(req.body.password)
                        const newUser = new User({
                            email: req.body.email,
                            username: req.body.username,
                            passwordHash: hash
                        })
                        const createdUser = await newUser.save()
                        const payload = {
                            id: createdUser.id,
                            username: createdUser.username
                        }
                        jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 3600
                        }, (err, token) => {
                            if(err){
                                let error = {}
                                error.status = 400
                                error.confirmation = false
                                res.json(error)
                            } else {
                                let success = {}
                                success.id = createdUser._id
                                success.username = createdUser.username
                                success.message = SIGNUP_SUCCESS_MESSAGE
                                setSessionRememberToken(req, token)
                                res.json(success)
                            }
                        })
                    } catch (err) {
                        let error = {}
                        error.status = 400
                        error.message = WHOOPS_MESSAGE
                        res.json(error)
                    }
                }
        } catch (err) {
            let error = {}
            error.status = 400
            error.confirmation = false
            res.json(error)
        }
    },
    signin: async (req, res, next) => {
        const email = req.body.email
        const password = req.body.password
        try{
            const user = await User.findOne({ email })
            if (!user){
                let error = {}
                error.status = 400
                error.confirmation = false
                error.message = 'User not found!'
                res.json(error)
            } else {
                try{
                    if (await argon2.verify(user.password, password)){
                        const payload = {
                            id: user._id,
                            email: user.email,
                            username: user.username
                        }
                        jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err){
                                let error = {}
                                error.status = 400
                                error.confirmation = false
                                error.message = err
                                res.json(error)
                            } else {
                                let success = {}
                                success.confirmation = true
                                success.token = `Bearer ${token}`
                                res.json(success)
                            }
                        })
                    }
                } catch (err) {
                    let error = {}
                    error.message = 
                    error.status = 400
                    res.json(error)
                }
            }
        } catch (err){
            let error = {}
            error.confirmation = false
            error.status = 400
            res.json(error)
        }
    }
}


