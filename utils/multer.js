const multer = require('multer')

const upload = multer({
  limits: {
    fileSize: 2200000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an jpg, jpeg, png'))
    }
    cb(undefined, true)
  }
})

module.exports = upload
