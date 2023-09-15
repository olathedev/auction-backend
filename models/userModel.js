const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema =  new Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    verification: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
    
    }

}, {timestamps: true})



userSchema.statics.register = async function (firstname, lastname, email, password, verificationCode){

    if(!firstname || !lastname || !email || !password) {
        throw Error ("Please fill all fields")
    }

    const confirmEmail = await this.findOne({email})

    if(confirmEmail) {
        throw Error("Email already registered")
    }

    if(!validator.isEmail(email)) {
        throw Error("invalid email adress")
    }

    if(!validator.isStrongPassword(password)) {
        throw Error("password is weak try, 8 characters or more with combination of uppercase, lowercase and special characters")
    }

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)


    const user = await this.create({
        firstname,
        lastname,
        email,
        password: hash,
        verification: verificationCode,
        isVerified: false
        
    })



    return user

}

userSchema.statics.login = async function (email, password) {
    if(!email | !password) {
        throw Error("Fill out all fields")
    }

    const user = await this.findOne({email})
    if(!user) {
        throw Error("This email is not registered")
    }


    const verifyPassword = await bcrypt.compare(password, user.password)
    if(!verifyPassword) {
        throw Error("Incorrect Password")
    }

    
    if(!user.isVerified) {
        throw Error("Your account is not verified, Please go to sign up and get a verification code")
    }

    return user
}

userSchema.statics.verifyEmail = async function (code) {
    if(!code) {
        throw Error("Provide a valid code")
    }

    const user = await this.findOne({verification: code})
    if(!user) {
        throw Error("Invalid verification code")
    }

    if(user.isVerified) {
        throw Error("Email already verified")
    }

    
    return user
}


module.exports = mongoose.model('user', userSchema)