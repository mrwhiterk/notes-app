var express = require('express')
var router = express.Router()
const User = require('../models/user')

/* GET users listing. */
router.get('/', function (req, res, next) {})

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

router.get('/profile', (req, res) => {
  res.render('profile')
})

module.exports = router
