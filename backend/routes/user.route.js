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

router.route('/register').post(async (req, res, next) => {
	console.log(req.body)
	
	const email = req.body.email
	let user = await userSchema.findOne({ email })
	if (user) {
		return res.json({ error: "User already exists" })
	  }

	const name = req.body.name
	const password = req.body.password 
	const hashedPassword = await bcrypt.hash(password, 10);
	
	const userObject = {
		name: name,
		email: email,
		password: hashedPassword
	};

	userSchema.create(userObject, (error, data) => {
	  if (error) {
		return next(error)
	  } else {
		console.log(data)
		res.json(data)
	  }
	})
  })


// Login user
router.post("/login", async (req, res) => {
	
	const email = req.body.email
	const password = req.body.password
	try {
	  let user = await userSchema.findOne({ email })
	  if (!user) {
		return res.status(400).json({ error: "User not registered" })
	  }
	  const isMatched = await bcrypt.compare(password, user.password)
	  if (!isMatched) {
		return res.status(400).json({ error: "Invalid Credentials" })
	  }
	  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	  })
	  res.json({ token: token })
	} catch (err) {
	  console.log(err)
	}
  })

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