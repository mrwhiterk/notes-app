var express = require('express')
var router = express.Router()
const userController = require('../controllers/user')

/* GET home page. */
router.get('/', userController.redirectIfNotAuthenticated, (req, res) => {
  res.render('index')
})

// signup page
router.get('/signup', userController.redirectIfAuthenticated, (req, res) => {
  res.render('auth/signup')
})

// signin page
router.get('/signin', userController.redirectIfAuthenticated, (req, res) => {
  res.render('auth/signin')
})

// signin
router.post('/signin', userController.passportLogin)

// logout
router.get('/logout', userController.logout)

module.exports = router
