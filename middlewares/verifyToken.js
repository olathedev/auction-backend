const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const verifyToken = async (req, res, next) => {
    const {authorisation} = req.headers

    if(!authorisation) {
       return res.status(400).json({error: 'youre not logged in mate'})
    }

    const token = authorisation.split(' ')[1]

    try {
        const {id} = jwt.verify(token, process.env.JWT_SECRET)
        console.log(id)
        req.user = await User.findOne({_id: id}).select('_id')
        next()
        
    }catch (err) {
        res.status(400).json({err: 'token unverified or user not found'})
    }
    

}

module.exports = verifyToken