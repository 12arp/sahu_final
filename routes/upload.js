const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

cloudinary.config({
    cloud_name: 'dkvpvv5c3',
    api_key: '852637721374837',
    api_secret: 'oy54TacQ-RVLrHRkrekUgULfheM'
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'your_folder_name' // optional
        });

        // Delete the file from local uploads folder
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete local file:', err);
        });

        res.json({ success: true, data: { url: result.secure_url } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Upload failed', error: err });
    }
});

module.exports = router; 