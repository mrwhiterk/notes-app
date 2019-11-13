var express = require('express')
var router = express.Router()
const userController = require('../controllers/user')
const upload = require('../utils/multer')

router.post('/', userController.create)

router.get('/profile', userController.show)

router.post(
  '/avatar',
  upload.single('avatar'),
  userController.uploadAvatar,
  userController.catchAvatarErrors
)

router.put('/', userController.update)

router.put('/updatePassword', userController.updatePassword)

module.exports = router
