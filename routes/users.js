var express = require('express')
var router = express.Router()
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const userController = require('../controllers/user')

/* GET users listing. */
router.get('/', function(req, res, next) {})

router.post('/', async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body

    if (password !== password2) {
      throw Error('passwords must match')
    }

    const user = await User.findOne({ email })
    if (user) {
      req.flash('errors', 'email already taken')
      return res.redirect(301, '/signup')
    }

    const userName = await User.findOne({ username })
    if (userName) {
      req.flash('errors', 'username already taken')
      return res.redirect('/signup')
    }

    const me = User({
      username,
      email,
      password
    })

    await me.save()

    req.login(me, err => {
      if (err) {
        return res.status(400).send({ message: err })
      }

      res.redirect('/')
    })
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})

router.get('/profile', async (req, res) => {
  if (req.user.avatar) {
    return res.render('profile', { avatar: req.user.avatar.toString('base64') })
  }
  res.render('profile', { avatar: '' })
})

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

router.post(
  '/avatar',
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()

    req.user.avatar = buffer

    await req.user.save()

    req.flash('success', 'successfully uploaded avatar img')
    res.redirect('back')
  },
  (error, req, res, next) => {
    if (error) {
      console.log(error)
    }
    req.flash('errors', 'please upload a jpg, jpeg, or png file')
    res.redirect('back')
  }
)

router.put('', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['username']
  const isValidOperation = updates.every(item => allowedUpdates.includes(item))

  if (!isValidOperation) {
    req.flash('errors', 'invalid request')
    return res.redirect('back')
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]))

    await req.user.save()

    req.flash('success', 'successfully updated profile')
    res.redirect('back')
  } catch (error) {
    console.log(error)
    if (error.code == 11000) {
      req.flash('errors', 'username already taken')
      res.redirect('back')
    }
  }
})

router.put('/updatePassword', userController.update)

module.exports = router
