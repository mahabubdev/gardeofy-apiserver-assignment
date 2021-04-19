const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');




// setup cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// setup multer
const multerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'webdev3_assignment11',
    },
});


// making the uploader

const uploader = multer({
    storage: multerStorage,
    fileFilter: async (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (
            ext === '.png' ||
            ext === '.jpg' ||
            ext === '.gif' ||
            ext === '.jpeg'
        ) {
            // console.log("extension-name: ", ext);
            callback(null, true);
        }
        else {
            // console.log('error: wrong file type')
            return req.res.status(422).json({
                message: 'Only supported images are allowed'
            })
        }
    },
    limits: {
        fileSize: (1024 * 1024) * 5,   // max file size 100MB only
    },
}).single('picture');





// files remove / delete
const remover = async (fileId) => {
    await cloudinary.uploader.destroy(fileId)
    .then(() => {
        return {
            status: true
        }
    })
    .catch((err) => {
        return {
            status: false,
            errors: err
        }
    })
}


// exports
module.exports = {
    uploader,
    remover,
}