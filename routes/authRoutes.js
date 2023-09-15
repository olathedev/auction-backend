const router = require('express').Router()
const { signup, signin, logout, verifyEmail } = require('../controllers/AuthControllers')

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/verifyEmail', verifyEmail)
router.post('/logout', logout)



module.exports = router 