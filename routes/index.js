var express = require('express')
var router = express.Router()
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
})

// signup page
router.get('/signup', (req, res) => {
  res.render('auth/signup')
})



module.exports = router
