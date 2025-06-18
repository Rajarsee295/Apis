const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

//gets althe function and storage
const { uploadToS3, deleteFromS3 } = require('../utils/s3');
const User = require('../models/User');

//gets all the middlewares
const auth = require('../middleware/auth_middleware');
const rate_limiter = require('../middleware/rate_lmiter_avatar')
const imageModeration = require('../middleware/imageModeration')

//setups the route 
const router = express.Router();

//creating upload function using multer
const upload = multer({
    storage: multer.memoryStorage(),//storing the image in memory first
    limits: { fileSize: 2 * 1024 * 1024 }, // setting limits of image to 2MB 
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];//only allowing .jpeg, .jpg and .png files
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, JPG and PNG are allowed'));
        }
        cb(null, true);
    }
});


//uploading the avatar using multer
router.post('/upload', auth, rate_limiter, upload.single('avatar'), async (req, res) => {
    try {

        //checking if file is provided
        if (!req.file) return res.status(400).json({ msg: 'No file provided' });

        //resizing the image if its not a gif
        let buffer;
        const mimetype = req.file.mimetype
        if (mimetype !== 'image/gif') {
            buffer = await sharp(req.file.buffer)
                .resize(256, 256)
                .png()
                .toBuffer();
            uploadMimeType = 'image/png';
        } else {
            buffer = req.file.buffer;
            uploadMimeType = 'image/gif';
        }

        //checking if the image is safe or not
        if (mimetype !== 'image/gif') {
            const moderation = await moderateImage(buffer);
            if (!moderation.allowed) {
                return res.status(400).json({ error: moderation.reason });
            }
        }


        //getting user
        const user = await User.findById(req.user.id);

        // Delete previous avatar from S3 to upload new avatar
        if (user.avatar) {
            await deleteFromS3(user.avatar);
        }

        //uploading the image and saving the url
        const url = await uploadToS3(buffer, 'image/png', user._id);

        //uploading the avatar to the url
        user.avatar = url;
        await user.save();//saving the url in mongoose

        res.json({ msg: 'Avatar uploaded', avatar: url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//deleting avatar
router.delete('/', auth, async (req, res) => {
    try {
        //getting avatar
        const user = await User.findById(req.user.id);
        if (!user.avatar) return res.status(404).json({ msg: 'No avatar to delete' });

        await deleteFromS3(user.avatar);//deletes the avatar
        user.avatar = null;//removes link from mongoose
        await user.save();//save the avatar

        res.json({ msg: 'Avatar deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
