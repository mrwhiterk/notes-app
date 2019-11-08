const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

module.exports = {
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
  }
}
