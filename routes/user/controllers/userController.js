const User = require('../model/User')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

module.exports = {
    signup: async (params) => {
        try {
            const user = await User.findOne({email: params.email})
                if (user){
                    console.log('user exists')
                    let error = {}
                    error.status = 400
                    error.confirmation = false
                    error.message = 'User with same email address already exists!'
                    return error
                } else {
                    try {
                        const hash = await argon2.hash(params.password)
                        const newUser = new User({
                            email: params.email,
                            username: params.username,
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
                                error.message = '1'
                                return error
                            } else {
                                let success = {}
                                success.confirmation = true
                                success.token = `Bear ${token}`
                                return success
                            }
                        })
                    } catch (err) {
                        let error = {}
                        error.status = 400
                        error.confirmation = false
                        error.message = '2'
                        return error
                    }
                }
        } catch (err) {
            let error = {}
            error.status = 400
            error.confirmation = false
            error.message = '3'
            return error
        }
    },
    signin: async (params) => {
        const email = params.email
        const password = params.password
        try{
            const user = await User.findOne({ email })
            if (!user){
                let error = {}
                error.status = 400
                error.confirmation = false
                error.message = 'User not found!'
                return error
            } else {
                try{
                    if (await argon2.verify(user.password, password)){
                        const payload = {
                            id: user._id,
                            email: user.email,
                            username: user.username
                        }
                        await jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 3600
                        }, async (err, token) => {
                            if (err){
                                let error = {}
                                error.status = 400
                                error.confirmation = false
                                error.message = err
                                return error
                            } else {
                                let success = {}
                                success.confirmation = true
                                success.token = `Bearer ${token}`
                                console.log('94')
                                console.log("success before return: ", success)
                                return await returnSuccess(success)
                            }
                        })
                    }
                } catch (err) {
                    let error = {}
                    error.message = 'Incorrect username or password'
                    error.confirmation = false
                    error.status = 400
                    return error
                }
            }
        } catch (err){
            let error = {}
            error.confirmation = false
            error.status = 400
            return error
        }
    }
}

const returnSuccess = success => Promise.resolve(success)