const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

module.exports = {
  redirectIfNotAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/signup')
    next()
  },

  passportLogin: passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })
}
