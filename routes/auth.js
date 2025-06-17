//gets all the reuired modules
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;//gets username and password from request body
  try {
    //checks if there is a same username already existing 
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    //creates new user
    user = new User({ username, password });
    await user.save();//saves the new user in the database

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });//assigning token after signing in which will be vild for 24 hours.
    res.json({ token });//responding with the token

  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  
  const { username, password } = req.body;//getting username and password from user request

  try {

    const user = await User.findOne({ username });//finding the user
    if (!user || !(await user.comparePassword(password))) {//return invalid if user not found or password mismatches
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });//assigning token after signing in which will be vild for 24 hours.
    res.json({ token });//responding with the token
  } catch (err) {
    res.status(500).send('Server error');
  }
});

//exporting the route
module.exports = router;
