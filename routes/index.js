var express = require('express')
var router = express.Router()
const userController = require('../controllers/user')

router.get('/', userController.redirectIfNotAuthenticated, (req, res) => {
  res.render('index')
})

router.get('/signup', userController.redirectIfAuthenticated, (req, res) => {
  res.render('auth/signup')
})

router.get('/signin', userController.redirectIfAuthenticated, (req, res) => {
  res.render('auth/signin')
})

router.post('/signin', userController.passportLogin)

router.get('/logout', userController.logout)

module.exports = router
