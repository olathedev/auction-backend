const mongoose = require('mongoose')
const Schema = mongoose.Schema

const propertySchema =  new Schema({
    user: {
        type: String
    },
    title: {
        type: String,
        required: true
    },

    adress: {
        type: String,
        required: true
    },

    images: {
        type: [String],
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    features: {
        type: [String],
        required: true
    },

    extraInfo: {
        type: String,
        required: true
    },
    
    auctionType: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    

}, {timestamps: true})


const BookMarkSchema = new Schema({
    userId: {
        type: String
    },
    propertyId: {
        type: String
    }
}, {timestamps: true})


const Bookmarks = mongoose.model('bookmark', BookMarkSchema)
const Property = mongoose.model('property', propertySchema)

module.exports = {
    Bookmarks,
    Property
}