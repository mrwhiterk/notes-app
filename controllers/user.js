const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

module.exports = {
  create: async (req, res) => {
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
  },
  redirectIfNotAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/signup')
    next()
  },
  redirectIfAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/')
    next()
  },

  passportLogin: passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
  }),

  logout: (req, res) => {
    req.logOut()
    res.redirect('/')
  },

  update: async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['oldPassword', 'newPassword', 'confirmPassword']
    const isValidOperation = updates.every(item =>
      allowedUpdates.includes(item)
    )

    if (!isValidOperation) {
      req.flash('errors', 'invalid request')
      return res.redirect('back')
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      req.flash('errors', 'Confirmation and new password do not match')
      return res.redirect('back')
    }

    if (req.body.newPassword === req.body.oldPassword) {
      req.flash('errors', 'Invalid password')
      return res.redirect('back')
    }
    try {
      const isMatch = await bcrypt.compare(
        req.body.oldPassword,
        req.user.password
      )

      if (!isMatch) {
        req.flash('errors', 'passwords do not match')
        return res.redirect('back')
      }

      req.user.password = req.body.newPassword

      await req.user.save()

      req.flash('success', 'Successfully updated your password')

      res.redirect('back')
    } catch (error) {
      req.flash('errors', error)
      res.redirect('back')
    }
  }
}
