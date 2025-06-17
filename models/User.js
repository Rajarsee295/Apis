// getting required modules
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//creating the userSchema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();//checks if the field changes is password or anything other 
  this.password = await bcrypt.hash(this.password, 10);//hashes the password using bcrypt
  next();
});

//password verification during login
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);//compares both the password by comparing the already hashed password and hashing the input password
};

//creates and exports the model
module.exports = mongoose.model('test_users', userSchema);
