const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const requireLogin = require("../middleware/auth")

let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router()

let userSchema = require('../models/User')
// Register user
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body
//   try {
//     let user = await User.findOne({ email })
//     if (user) {
//       return res.status(400).json({ error: "User already exists" })
//     }
//     const hashedPassword = await bcrypt.hash(password, 10)
//     user = new User({ name, email, password: hashedPassword })
//     await user.save()
//     res.status(201).json({ message: "User created successfully" })
//   } catch (err) {
//     console.log(err)
//   }
// })

router.route('/register').post((req, res, next) => {
	console.log(req.body)
	userSchema.create(req.body, (error, data) => {
	  if (error) {
		return next(error)
	  } else {
		console.log(data)
		res.json(data)
	  }
	})
  })


// // Login user
// router.post("/login", async (req, res) => {
// 	const { email, password } = req.body
// 	try {
// 	  let user = await User.findOne({ email })
// 	  if (!user) {
// 		return res.status(400).json({ error: "Invalid Credentials" })
// 	  }
// 	  const isMatched = await bcrypt.comapre(password, user.password)
// 	  if (!isMatched) {
// 		return res.status(400).json({ error: "Invalid Credentials" })
// 	  }
// 	  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
// 		expiresIn: "1h",
// 	  })
// 	  res.json({ token })
// 	} catch (err) {
// 	  console.log(err)
// 	}
//   })

// router.get("/", requireLogin, async (req, res) => {
// 	console.log(req.user)
// 	try {
// 	  const user = await User.findById(req.user._id).select("-password")
// 	  res.json(user)
// 	} catch (err) {
// 	  console.log(err)
// 	}
//   })

module.exports = router