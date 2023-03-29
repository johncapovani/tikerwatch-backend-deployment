const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe } = require('../controllers/userController')
//Bring  in protection middleware to create protected routes
const { protect } = require('../middleware/authMiddleware')


//POST Method
//Adding user to mongo resource
router.post('/', registerUser)

//POST Method to Login
//Login as a  active user
router.post('/login', loginUser)

//GET Method
//View user profile
router.get('/me', protect, getMe)


module.exports = router