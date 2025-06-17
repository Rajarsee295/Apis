const express = require('express');
const auth = require('../middleware/auth_middleware');
const adminOnly = require('../middleware/admin_middleware');
const User = require('../models/User');
const { deleteFromS3 } = require('../utils/s3');

const router = express.Router();

// ✅ List all user avatars
router.get('/avatars', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ avatar: { $ne: null } }, '_id name email avatar');//gets all the avatars
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 🗑 Delete a specific user’s avatar
router.delete('/avatars/:userId', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);//gets the user id whose avatar needs to be deleted
    if (!user || !user.avatar) {//returns error if user or user avatar not found
      return res.status(404).json({ error: 'Avatar not found' });
    }

    await deleteFromS3(user.avatar);//deletes the avatar
    user.avatar = null;//removes the link from mongoose
    await user.save();//saves the updates in mongoose

    res.json({ msg: `Avatar deleted for user ${user.email}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
