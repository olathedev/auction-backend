const router = require('express').Router()
const { user, uploadImageByLink, uploadFromDevice, postProperty, getProperties, allProperties, getSingleProperties, sellerProfile, addToBookmark, getBookmarks } = require('../controllers/AppControllers')
const verifytoken = require('../middlewares/verifyToken')
const multer = require('multer')


const upload = multer({ dest: 'public/uploads/' })

// ROUTES
router.get('/all-properties', allProperties)
router.get('/property/:id', getSingleProperties)
router.get('/seller-profile/:id', sellerProfile)

// Authorization Middleware
router.use(verifytoken)

router.get('/profile', user)
router.post('/property', postProperty)
router.get('/property', getProperties)
// images routes
router.post('/upload-by-link', uploadImageByLink)
router.post('/upload-from-device', upload.array('images', 50), uploadFromDevice)

// bookmar
router.get('/bookmark', getBookmarks)
router.post('/bookmark', addToBookmark)



module.exports = router