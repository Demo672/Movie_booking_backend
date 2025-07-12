const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema')
const errorHandler = require('../Middleware/errorMiddleware')
const authTokenHandler = require('../Middleware/checkAuthToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

router.get('/test', async (req, res) => {
    res.json({
        message: "Auth api is working"
    })
})


function createResponse(ok, message, data){
    return{
        ok,
        message,
        data,
    }
}


router.post('/register', async (req, res, next) => {
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({ email : email});

        if(existingUser){
            return res.status(409).json(createResponse(false, 'Email already exists!'));
        }

        const newuser = new User({
            name,
            password,
            email,
        });

        await newuser.save();
        req.status(201).json(createResponse(true, 'User registered successfully'));
    }
    catch(err){
        next(err)
    }
})


router.post('/login', async (req, res, next) => {
    const { email, password} = req.body
    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json(createResponse(false, "Invalid credential"))
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json(createResponse(false, 'Incorrect password'))
    }

    const authToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "10m"});

    const refreshToken = jwt.sign({userId: user._id}, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: "30m"});
    

})


// router.post('/sendotp', async (req, res) => {}){

// }


router.get('/checklogin', authTokenHandler, async (req, res) => {
    res.json({
        userId : rew.userId,
        ok: true,
        message: "User authenticated successfully!"
    })
})


router.use(errorHandler)

module.exports = router