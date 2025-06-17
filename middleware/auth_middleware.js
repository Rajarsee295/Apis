//gets the required module
const jwt = require('jsonwebtoken');

//exports the function required to create tokens
module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });//checks if there any token is present if not return error

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//verifies the token given by the user
    req.user = decoded; // return the id of the user { id: user._id } 
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token' });
  }
};
