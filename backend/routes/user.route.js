const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { requireLogin } = require("../middleware/auth")

let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router()

let userSchema = require('../models/User')

// Register user
router.route('/register').post(async (req, res, next) => {
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


// Home
router.get("/", requireLogin, async (req, res) => {
	try {
	  const user = await userSchema.findById(req.user._id).select("-password")
	  res.json(user)
	} catch (err) {
	  console.log(err)
	}
  })

  // READ users
router.route('/find', requireLogin).get((req, res) => {
	userSchema.find((error, data) => {
	  if (error) {
		return next(error)
	  } else {
		res.json(data)
	  }
	})
  })

// Get Single user
router.route('/edit-user/:id').get((req, res) => {
	userSchema.findById(req.params.id, (error, data) => {
	  if (error) {
		return next(error)
	  } else {
		res.json(data)
	  }
	})
  })

// Update User
router.route('/update-user/:id').put((req, res, next) => {
	userSchema.findByIdAndUpdate(
	  req.params.id,
	  {
		$set: req.body,
	  },
	  (error, data) => {
		if (error) {
		  return next(error)
		  console.log(error)
		} else {
		  res.json(data)
		  console.log('User updated successfully !')
		}
	  },
	)
  })

// Delete User
router.route('/delete-user/:id').delete((req, res, next) => {
	userSchema.findByIdAndRemove(req.params.id, (error, data) => {
	  if (error) {
		return next(error)
	  } else {
		res.status(200).json({
		  msg: data,
		})
	  }
	})
  })


module.exports = router