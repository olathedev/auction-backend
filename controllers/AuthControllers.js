const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const sendVerificationMail = require('../utils/sendVerificationMail.js')
const otpGenerator = require('otp-generator')


const signup = async (req, res) => {
    const {firstname, lastname, email, password} = req.body
 
    const verificationCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
    
    console.log(verificationCode)

    try {
        const user = await User.register(firstname, lastname, email, password, verificationCode)
        // const token = generateToken(user._id)
        
        // res.cookie('jwt', token, {
        //     httpOnly: true,a
        //     secured: process.env.JWT_SECRET !== 'development',
        //     sameSite: 'strict',
        //     maxAge: 30 * 24 * 60 * 60 * 1000
        // })
        
        await sendVerificationMail(user.email, user.firstname, verificationCode)

        res.status(200).json({message: "user Registered verify account"})
    }catch(error) {
        res.status(400).json({error: error.message})
    }
}

const verifyEmail = async (req, res) => {
    const {code} = req.body

    try {
        const verify = await User.verifyEmail(code)
        const user = await User.findOneAndUpdate({_id: verify._id}, {$set: {isVerified: true, verification: null}})
        const token = generateToken(user._id)
        
        res.cookie('jwt', token, {
            httpOnly: true,
            secured: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.status(200).json(user)

    }catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signin = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.login(email, password)
        const token = generateToken(user._id)

        res.cookie('jwt', token, {
            httpOnly: true,
            secured: process.env.NODE_ENV !== 'development',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({user})

    }catch(error){
        res.status(400).json({error: error.message})
    }
}

const logout = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1}).json({ msg: 'logedout'})
}

module.exports = {
    signup,
    signin,
    verifyEmail,
    logout
}