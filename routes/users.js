var express = require('express')
var router = express.Router()
const userController = require('../controllers/user')
const upload = require('../utils/multer')

router.get('/', userController.index)

router.post('/', userController.create)

router.get(
  '/profile',
  userController.redirectIfNotAuthenticated,
  userController.show
)

router.get('/bookmark/:noteId', userController.bookmark)

router.get('/removeBookmark/:noteId', userController.removeBookmark)

router.post(
  '/avatar',
  upload.single('avatar'),
  userController.uploadAvatar,
  userController.catchAvatarErrors
)

router.put('/', userController.update)

router.put('/updatePassword', userController.updatePassword)

router.delete('/deleteAvatar', userController.deleteAvatar)

module.exports = router
