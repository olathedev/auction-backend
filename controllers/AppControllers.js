const User = require('../models/userModel')
const {Property, Bookmarks} = require('../models/propertyModel')

const downloadImage = require('../public/imageDownloader')
const fs = require('fs')


const allProperties = async (req, res) => {
    try {
        const properties = await Property.find().sort({_id: -1})
        res.status(200).json({properties})
    }catch(error) {
        res.status(400).json(error.message)
    }
}

const getSingleProperties = async (req, res) => {
    const {id} = req.params
    console.log(id)
    try {
        const properties = await Property.findOne({_id: id})

        res.status(200).json({properties})
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}

const sellerProfile = async(req, res) => {
    const {id} = req.params()

    try{
        const user = await User.findOne({_id: id})

        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

const user = async (req, res) => {
    // res.json('User profile')
    const user_id = req.user._id

    try{
        const {firstname, lastname,email, _id} = await User.findOne({_id: user_id})

        res.status(200).json({firstname, lastname, email, _id})
    }catch(error) {
        res.status(400).json({error: error.message})
    }
}

const uploadImageByLink = async (req, res) => {

    const {link} = req.body
    const newName = 'auctimage' + Date.now() + '.jpg'

    try {
        const response = await downloadImage(link, newName)
        res.status(200).json(newName)
    }catch(error){
        res.status(400).json({error})
    }
}



const uploadFromDevice = async (req, res) => {

    const uploaded = []
    for(let i=0; i < req.files.length; i++){
        const {path, originalname} = req.files[i]
        const arr = originalname.split('.')
        const ext = arr[arr.length - 1]
        const newPath = path + '.' + ext

        fs.renameSync(path, newPath)
        uploaded.push(newPath.replace(`public\\uploads\\`, ''))

    }

    res.json(uploaded)

}

const postProperty = async (req, res) => {
    const {title, adress, images, description, features, extraInfo, auctionType, price} = req.body
    const user_id = req.user._id

    try {
        const property = Property.create({
            user: user_id, title, adress, images, description, features, extraInfo, auctionType, price
        })

        res.status(200).json({property})
    }catch(error) {
        res.status(400).json({error})
    }
}

const getProperties = async (req, res) => {
    const user_id = req.user._id

    try {
        const properties = await Property.find({user: user_id}).sort({_id: -1})
        res.status(200).json(properties)
    }catch(error) {
        res.status(400).json({error})
    }
}


const getBookmarks = async (req, res) => {
    const {_id} = req.user

    try{
        const bookmarks = await Bookmarks.find({userId: _id})
        res.status(200).json(bookmarks)
    }catch(error){
        res.status(400).json(error)
    }
}

const addToBookmark = async (req, res) => {
    const user_id = req.user._id
    const {property_id} = req.body


    try {
           
        // const ver = await Bookmarks.find({_id: property_id})
        
        const newBookmark = await Bookmarks.create({userId: user_id, propertyId: property_id})
        res.status(200).json(newBookmark)
        
    }catch(error) {
        res.status(400).json({error})
    }
}
module.exports = {
    allProperties,
    user,
    uploadImageByLink,
    uploadFromDevice,
    postProperty,
    getProperties,
    getSingleProperties,
    sellerProfile,
    addToBookmark,
    getBookmarks
}