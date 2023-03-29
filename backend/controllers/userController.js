//JSON Web Token for authentication
const jwt = require('jsonwebtoken')
//Password hasher or encrypter
const bcrypt = require('bcryptjs')
//Async handler
const asyncHandler = require('express-async-handler')
//User model
const User = require('../models/userModel')

//@desc A function used to Register New a User
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  //destructure body data

  const { name, email, password } = req.body

  if (!name || !email || !password) {

    res.status(400)
    throw new Error('Please add all required fields')
  }

  //Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already Exists')
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //Create user in MongoDB
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  if (user) {
    res.status(201).json({

      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})

//@desc Authenticate  a user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {

 
  const { email, password } = req.body

  //Check for user email
  const user = await User.findOne({ email })

  //Check password
  if (user && (await bcrypt.compare(password, user.password))) {

    res.json({

      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid Credentials')
  }
})

//@desc GET User Data - Send token and get ID from sent token response
//@route GET /api/users/me
//@access Private protected route
const getMe = asyncHandler(async (req, res) => {
  //destructure the id
  const { _id, name, email } = await User.findById(req.user.id)

  res.status(200).json({

    id: _id,
    name,
    email,

  })
})


//Generate a JWT Token
const generateToken = (id) => {

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe

}