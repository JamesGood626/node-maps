const User = require('../model/User')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

module.exports = {
    signup: async (req, res, next) => {
        try {
            const user = await User.findOne({email: req.body.email})
                if (user){
                    console.log('user exists')
                    let error = {}
                    error.status = 400
                    error.confirmation = false
                    error.message = 'User with same email address already exists!'
                    res.json(error)
                } else {
                    try {
                        const hash = await argon2.hash(req.body.password)
                        const newUser = new User({
                            email: req.body.email,
                            username: req.body.username,
                            password: hash
                        })
                        const createdUser = await newUser.save()
                        const payload = {
                            id: createdUser._id,
                            email: createdUser.email,
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
                                success.confirmation = true
                                success.token = `Bear ${token}`
                                res.json(success)
                            }
                        })
                    } catch (err) {
                        let error = {}
                        error.status = 400
                        error.confirmation = false
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
                    error.message = 'Incorrect username or password'
                    error.confirmation = false
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

