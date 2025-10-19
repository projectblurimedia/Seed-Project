const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400)
    throw new Error('Please provide username and password')
  }

  const userExists = await User.findOne({ username })
  if (userExists) {
    res.status(400)
    throw new Error('Username already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    username,
    password: hashedPassword,
  })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })

  res.status(201).json({
    _id: user._id,
    username: user.username,
    token,
  })
})

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400)
    throw new Error('Please provide username and password')
  }

  const user = await User.findOne({ username })
  if (!user) {
    res.status(401)
    throw new Error('Invalid username or password')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid username or password')
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })

  res.status(200).json({
    _id: user._id,
    username: user.username,
    token,
  })
})

module.exports = { registerUser, loginUser }