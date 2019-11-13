const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const sharp = require('sharp')

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
  show: async (req, res) => {
    await req.user.populate('notes').execPopulate()
    res.render('profile')
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

  updatePassword: async (req, res) => {
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
  },

  update: async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username']
    const isValidOperation = updates.every(item =>
      allowedUpdates.includes(item)
    )

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
      if (error.code === 11000) {
        req.flash('errors', 'username already taken')
        res.redirect('back')
      }
    }
  },

  uploadAvatar: async (req, res) => {
    if (!req.file) {
      req.flash('errors', 'please upload file first')
      return res.redirect('back')
    }
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()

    req.user.avatar = buffer

    await req.user.save()

    req.flash('success', 'successfully uploaded avatar img')
    res.redirect('back')
  },

  catchAvatarErrors: async (error, req, res) => {
    if (error) {
      req.flash('errors', error)
    }
    req.flash('errors', 'please upload a jpg, jpeg, or png file')
    res.redirect('back')
  },

  deleteAvatar: async (req, res) => {
    try {
      req.user.avatar = undefined
      await req.user.save()
      req.flash('success', 'successfully removed avatar')
      res.redirect('back')
    } catch (err) {
      req.flash('errors', err)
      res.redirect('back')
    }
  }
}
